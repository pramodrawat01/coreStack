import { recomputeProductTotal } from '../utils/stockSync.js'

export const getPurchaseOrders = async (req, res) => {
  try {
    const { PurchaseOrder } = req.tenant.models
    const { search, status } = req.query

    const query = {}
    if (status && status !== 'All statuses') query.status = status
    if (search) {
      query.$or = [
        { poNumber: { $regex: search, $options: 'i' } },
        { supplierName: { $regex: search, $options: 'i' } },
      ]
    }

    const purchaseOrders = await PurchaseOrder.find(query).sort({ createdAt: -1 })

    const totalPOs = await PurchaseOrder.countDocuments()
    const openPOs = await PurchaseOrder.countDocuments({ status: { $in: ['Sent', 'Partially Received'] } })

    const committedAgg = await PurchaseOrder.aggregate([
      { $match: { status: { $in: ['Sent', 'Partially Received'] } } },
      { $group: { _id: null, total: { $sum: '$totalCost' } } },
    ])

    // Real realized lead time — days between PO creation and the 'received' timeline entry —
    // rather than just averaging Supplier.averageLeadTime (which is a manually-entered estimate).
    const received = await PurchaseOrder.find({ status: 'Received' }).lean()
    let avgLeadTimeDays = 0
    if (received.length > 0) {
      const totalDays = received.reduce((sum, po) => {
        const receivedEntry = po.timeline?.find((t) => t.status === 'received')
        if (!receivedEntry?.completedAt) return sum
        return sum + (new Date(receivedEntry.completedAt) - new Date(po.createdAt)) / 86400000
      }, 0)
      avgLeadTimeDays = totalDays / received.length
    }

    res.json({
      purchaseOrders,
      stats: {
        totalPOs,
        openPOs,
        committedValue: committedAgg[0]?.total || 0,
        avgLeadTimeDays,
      },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getPurchaseOrderById = async (req, res) => {
  try {
    const { PurchaseOrder } = req.tenant.models
    const po = await PurchaseOrder.findById(req.params.id)
    if (!po) return res.status(404).json({ message: 'Purchase order not found' })
    res.json(po)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const createPurchaseOrder = async (req, res) => {
  try {
    const { PurchaseOrder, Supplier } = req.tenant.models
    const { supplierId, items, warehouseId, shippingCost = 0, tax = 0, expectedDeliveryDate, notes } = req.body

    if (!supplierId) return res.status(400).json({ message: 'A supplier is required' })
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' })
    }

    const supplier = await Supplier.findById(supplierId)
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' })

    const resolvedItems = items.map((i) => ({
      product: i.productId,
      // updating the warehouse from per line/item to sigle warehouse for a PO
      warehouse: warehouseId,
      name: i.name,
      sku: i.sku,
      quantity: Number(i.quantity),
      unitCost: Number(i.unitCost),
      totalCost: Number(i.quantity) * Number(i.unitCost),
    }))

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.totalCost, 0)
    const totalCost = subtotal + Number(shippingCost) + Number(tax)

    const count = await PurchaseOrder.countDocuments()
    const poNumber = `PO-${10400 + count + 1}`
    const now = new Date()

    const po = await PurchaseOrder.create({
      poNumber,
      supplier: supplier._id,
      warehouse : warehouseId,
      supplierName: supplier.companyName,
      items: resolvedItems,
      subtotal,
      shippingCost: Number(shippingCost),
      tax: Number(tax),
      totalCost,
      status: 'Sent',
      expectedDeliveryDate,
      notes,
      timeline: [
        { status: 'created', label: 'Purchase order created', completedAt: now },
        { status: 'sent', label: 'Sent to supplier', completedAt: now },
        { status: 'received', label: 'Received', completedAt: null },
      ],
    })

    supplier.openPurchaseOrders = (supplier.openPurchaseOrders || 0) + 1
    await supplier.save()

    res.status(201).json(po)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updatePurchaseOrder = async (req, res) => {
  try {
    const { PurchaseOrder, Supplier } = req.tenant.models
    const { notes, expectedDeliveryDate, status } = req.body
    const po = await PurchaseOrder.findById(req.params.id)
    if (!po) return res.status(404).json({ message: 'Purchase order not found' })

    if (notes !== undefined) po.notes = notes
    if (expectedDeliveryDate !== undefined) po.expectedDeliveryDate = expectedDeliveryDate

    if (status === 'Cancelled' && po.status !== 'Cancelled') {
      po.status = 'Cancelled'
      const supplier = await Supplier.findById(po.supplier)
      if (supplier) {
        supplier.openPurchaseOrders = Math.max(0, (supplier.openPurchaseOrders || 0) - 1)
        await supplier.save()
      }
    }

    await po.save()
    res.json(po)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// POST /api/purchase-orders/:id/receive — the stock-affecting action
export const receivePurchaseOrder = async (req, res) => {
  try {
    const { PurchaseOrder, Product, WarehouseStock, InventoryTransaction, Supplier } = req.tenant.models

    const po = await PurchaseOrder.findById(req.params.id)
    if (!po) return res.status(404).json({ message: 'Purchase order not found' })
    if (po.status === 'Received') return res.status(400).json({ message: 'This purchase order was already received' })
    if (po.status === 'Cancelled') return res.status(400).json({ message: 'Cannot receive a cancelled purchase order' })

    for (const item of po.items) {
      let stockRow = await WarehouseStock.findOne({ product: item.product, warehouse: item.warehouse })
      if (!stockRow) {
        stockRow = await WarehouseStock.create({ product: item.product, warehouse: item.warehouse, quantity: 0 })
      }
      stockRow.quantity += item.quantity
      await stockRow.save()

      await InventoryTransaction.create({
        product: item.product,
        warehouse: item.warehouse,
        type: 'PURCHASE',
        quantity: item.quantity,
        balanceAfter: stockRow.quantity,
        reference: po.poNumber,
        notes: `Received against ${po.poNumber}`,
        performedBy: req.user._id,
      })

      await recomputeProductTotal({ Product, WarehouseStock }, item.product)
    }

    po.status = 'Received'
    const receivedEntry = po.timeline.find((t) => t.status === 'received')
    if (receivedEntry) receivedEntry.completedAt = new Date()
    await po.save()

    const supplier = await Supplier.findById(po.supplier)
    if (supplier) {
      supplier.totalPurchased = (supplier.totalPurchased || 0) + po.totalCost
      supplier.lastDeliveryDate = new Date()
      supplier.openPurchaseOrders = Math.max(0, (supplier.openPurchaseOrders || 0) - 1)
      await supplier.save()
    }

    res.json(po)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}