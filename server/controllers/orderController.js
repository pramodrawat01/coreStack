import { recomputeProductTotal } from '../utils/stockSync.js'

export const getOrders = async (req, res) => {
  try {
    const { Order } = req.tenant.models
    const { search, status } = req.query
    

    const query = {}
    if (status && status !== 'All') query.fulfillmentStatus = status
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
      ]
    }

    const orders = await Order.find(query).sort({ createdAt: -1 })
    const totalOrders = await Order.countDocuments()
    const processingCount = await Order.countDocuments({ fulfillmentStatus: 'Processing' })
    const shippedCount = await Order.countDocuments({ fulfillmentStatus: 'Shipped' })
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])
   
    res.json({
      orders,
      stats: { totalOrders, processingCount, shippedCount, revenue: totalRevenue[0]?.total || 0 },
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getOrderById = async (req, res) => {
  try {
    const { Order } = req.tenant.models
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Prefer the product's own "primary" warehouse if it alone has enough stock,
// otherwise fall back to whichever warehouse holds the most. Returns null if
// nothing can cover the full quantity.
async function pickFulfillmentWarehouse(Product, WarehouseStock, productId, quantity) {
  const product = await Product.findById(productId).select('warehouse').lean()
  const rows = await WarehouseStock.find({ product: productId }).lean()
  const withAvailable = rows.map((r) => ({ ...r, available: r.quantity - (r.reserved || 0) }))

  if (product?.warehouse) {
    const primary = withAvailable.find((r) => String(r.warehouse) === String(product.warehouse))
    if (primary && primary.available >= quantity) return primary
  }

  const best = withAvailable.sort((a, b) => b.available - a.available)[0]
  if (!best || best.available < quantity) return null
  return best
}

export const createOrder = async (req, res) => {
  try {
    const { Order, Customer, Product, WarehouseStock, InventoryTransaction } = req.tenant.models
    const {
      customerId, items, shippingFee = 0, tax = 0,
      paymentStatus = 'Pending', deliveryMethod = 'Standard delivery',
      shippingAddress, notes,
    } = req.body

    if (!customerId) return res.status(400).json({ message: 'A customer is required' })
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' })
    }

    const customer = await Customer.findById(customerId)
    if (!customer) return res.status(404).json({ message: 'Customer not found' })

    const resolvedItems = []
    for (const line of items) {
      const product = await Product.findById(line.productId)
      if (!product) return res.status(404).json({ message: `Product not found: ${line.productId}` })

      const quantity = Number(line.quantity)
      if (!Number.isFinite(quantity) || quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` })
      }

      const fulfillment = await pickFulfillmentWarehouse(Product, WarehouseStock, product._id, quantity)
      if (!fulfillment) {
        return res.status(400).json({ message: `Not enough stock available for ${product.name}` })
      }

      const unitPrice = line.unitPrice != null ? Number(line.unitPrice) : product.price
      resolvedItems.push({
        product: product._id, warehouse: fulfillment.warehouse,
        name: product.name, sku: product.sku,
        quantity, unitPrice, totalPrice: unitPrice * quantity,
      })
    }

    const subtotal = resolvedItems.reduce((sum, i) => sum + i.totalPrice, 0)
    const totalAmount = subtotal + Number(shippingFee) + Number(tax)
    const count = await Order.countDocuments()
    const orderNumber = `#ORD-${20800 + count + 1}`
    const now = new Date()

    const order = await Order.create({
      orderNumber,
      customer: customer._id,
      customerName: customer.companyName,
      contactName: [customer.primaryContact?.firstName, customer.primaryContact?.lastName].filter(Boolean).join(' '),
      contactEmail: customer.email,
      contactPhone: customer.phone,
      items: resolvedItems,
      subtotal, shippingFee: Number(shippingFee), tax: Number(tax), totalAmount,
      paymentStatus, fulfillmentStatus: 'Processing', deliveryMethod,
      shippingAddress: shippingAddress || customer.address,
      notes,
      timeline: [
        { status: 'placed', label: 'Order placed', completedAt: now },
        { status: 'payment', label: 'Payment confirmed', completedAt: paymentStatus === 'Paid' ? now : null },
        { status: 'picking', label: 'Picking in progress', completedAt: now },
        { status: 'shipped', label: 'Shipped', completedAt: null },
      ],
    })

    for (const item of resolvedItems) {
      const stockRow = await WarehouseStock.findOne({ product: item.product, warehouse: item.warehouse })
      stockRow.quantity -= item.quantity
      await stockRow.save()

      await InventoryTransaction.create({
        product: item.product, warehouse: item.warehouse, type: 'SALE',
        quantity: -item.quantity, balanceAfter: stockRow.quantity,
        reference: orderNumber, notes: `Order ${orderNumber}`, performedBy: req.user._id,
      })

      await recomputeProductTotal({ Product, WarehouseStock }, item.product)
    }

    customer.totalOrders = (customer.totalOrders || 0) + 1
    customer.totalSpent = (customer.totalSpent || 0) + totalAmount
    customer.lastOrderDate = now
    await customer.save()

    res.status(201).json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const updateOrder = async (req, res) => {
  try {
    const { Order } = req.tenant.models
    const { notes, paymentStatus, status } = req.body
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })

    if (notes !== undefined) order.notes = notes
    if (paymentStatus !== undefined) {
      order.paymentStatus = paymentStatus
      if (paymentStatus === 'Paid') {
        const stage = order.timeline.find((t) => t.status === 'payment')
        if (stage && !stage.completedAt) stage.completedAt = new Date()
      }
    }
    if (status === 'Cancelled' && !['Shipped', 'Delivered', 'Cancelled'].includes(order.fulfillmentStatus)) {
      order.fulfillmentStatus = 'Cancelled'
    }

    await order.save()
    res.json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const shipOrder = async (req, res) => {
  try {
    const { Order } = req.tenant.models
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.fulfillmentStatus !== 'Processing') {
      return res.status(400).json({ message: `Cannot ship an order in "${order.fulfillmentStatus}" status` })
    }
    order.fulfillmentStatus = 'Shipped'
    const stage = order.timeline.find((t) => t.status === 'shipped')
    if (stage) stage.completedAt = new Date()
    await order.save()
    res.json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const deliverOrder = async (req, res) => {
  try {
    const { Order } = req.tenant.models
    const order = await Order.findById(req.params.id)
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.fulfillmentStatus !== 'Shipped') {
      return res.status(400).json({ message: `Cannot mark delivered from "${order.fulfillmentStatus}" status` })
    }
    order.fulfillmentStatus = 'Delivered'
    await order.save()
    res.json(order)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}