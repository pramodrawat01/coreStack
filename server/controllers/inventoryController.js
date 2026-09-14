function computeStockStatus(quantity, reorderPoint = 0) {
  if (quantity <= 0) return 'Out of Stock'
  if (quantity <= reorderPoint) return 'Low Stock'
  return 'In Stock'
}

// Lazily creates WarehouseStock rows for products that already have a home
// warehouse (Product.warehouse) but no stock row yet — this is what lets every
// product created before WarehouseStock existed keep working with zero migration
// script. Runs cheaply (skips products that already have a row) at the top of
// every read/write endpoint below.
async function bootstrapMissingStockRows({ Product, WarehouseStock }) {
  const products = await Product.find({ warehouse: { $ne: null } })
    .select('warehouse stockQuantity')
    .lean()
  if (products.length === 0) return

  const existing = await WarehouseStock.find({ product: { $in: products.map((p) => p._id) } })
    .select('product warehouse')
    .lean()
  const existingKeys = new Set(existing.map((s) => `${s.product}_${s.warehouse}`))

  const toInsert = products
    .filter((p) => !existingKeys.has(`${p._id}_${p.warehouse}`))
    .map((p) => ({ product: p._id, warehouse: p.warehouse, quantity: p.stockQuantity || 0 }))

  if (toInsert.length > 0) {
    // ordered:false + swallow — a race between two concurrent requests hitting the
    // unique index is fine, it just means the other request already inserted it
    await WarehouseStock.insertMany(toInsert, { ordered: false }).catch(() => {})
  }
}

// Keeps Product.stockQuantity (shown on the Products page) equal to the sum of
// this product's stock across every warehouse it's now split across.
async function recomputeProductTotal({ Product, WarehouseStock }, productId) {
  const rows = await WarehouseStock.find({ product: productId }).select('quantity').lean()
  const total = rows.reduce((sum, r) => sum + r.quantity, 0)
  await Product.findByIdAndUpdate(productId, { stockQuantity: total })
  return total
}

// GET /api/inventory?search=&warehouse=&status=&page=&limit=
export async function listInventory(req, res) {
  const { Product, WarehouseStock } = req.tenant.models
  await bootstrapMissingStockRows({ Product, WarehouseStock })

  const { search = '', warehouse = 'All', status = 'All', page = '1', limit = '50' } = req.query

  let rows = await WarehouseStock.find()
    .populate('product', 'name sku category reorderPoint cost isActive')
    .populate('warehouse', 'name')
    .lean()

  rows = rows.filter((r) => r.product && r.warehouse) // guard against a deleted product/warehouse leaving an orphan row

  if (warehouse !== 'All') rows = rows.filter((r) => String(r.warehouse._id) === warehouse)

  if (search.trim()) {
    const q = search.trim().toLowerCase()
    rows = rows.filter(
      (r) => r.product.name.toLowerCase().includes(q) || r.product.sku.toLowerCase().includes(q)
    )
  }

  rows = rows.map((r) => ({
    ...r,
    available: r.quantity - (r.reserved || 0),
    status: computeStockStatus(r.quantity, r.product.reorderPoint),
  }))

  if (status !== 'All') rows = rows.filter((r) => r.status === status)

  rows.sort((a, b) => a.product.name.localeCompare(b.product.name))

  const total = rows.length
  const skip = (Number(page) - 1) * Number(limit)
  const paginated = rows.slice(skip, skip + Number(limit))

  res.json({ items: paginated, total, page: Number(page), limit: Number(limit) })
}

// GET /api/inventory/summary — the four stat cards at the top of the page
export async function getInventorySummary(req, res) {
  const { Product, WarehouseStock } = req.tenant.models
  await bootstrapMissingStockRows({ Product, WarehouseStock })

  const rows = await WarehouseStock.find().populate('product', 'reorderPoint cost').lean()
  const valid = rows.filter((r) => r.product)

  const totalSKUs = new Set(valid.map((r) => String(r.product._id))).size
  const totalStockValue = valid.reduce((sum, r) => sum + r.quantity * (r.product.cost || 0), 0)
  const lowStockItems = valid.filter((r) => r.quantity > 0 && r.quantity <= (r.product.reorderPoint || 0)).length
  const outOfStock = valid.filter((r) => r.quantity === 0).length

  res.json({ totalSKUs, totalStockValue, lowStockItems, outOfStock })
}

// GET /api/inventory/stock/:productId — this product's stock broken down by warehouse,
// used by the Stock Adjustment and Transfer Stock forms
export async function getProductStock(req, res) {
  const { Product, WarehouseStock } = req.tenant.models
  const product = await Product.findById(req.params.productId).lean()
  if (!product) return res.status(404).json({ message: 'Product not found' })

  await bootstrapMissingStockRows({ Product, WarehouseStock })

  const rows = await WarehouseStock.find({ product: product._id }).populate('warehouse', 'name').lean()

  res.json(
    rows
      .filter((r) => r.warehouse)
      .map((r) => ({
        warehouse: r.warehouse,
        quantity: r.quantity,
        reserved: r.reserved || 0,
        available: r.quantity - (r.reserved || 0),
      }))
  )
}

// POST /api/inventory/adjust
// body: { productId, warehouseId, adjustmentType: 'in' | 'out' | 'set', quantity, reason, notes }
export async function adjustStock(req, res) {
  const { Product, WarehouseStock, InventoryTransaction } = req.tenant.models
  const { productId, warehouseId, adjustmentType, quantity, reason, notes } = req.body

  const qty = Number(quantity)
  if (!productId || !warehouseId || !adjustmentType || !Number.isFinite(qty) || qty < 0) {
    return res.status(400).json({ message: 'Missing or invalid adjustment details' })
  }
  if (!reason?.trim()) return res.status(400).json({ message: 'A reason is required' })

  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ message: 'Product not found' })

  let stockRow = await WarehouseStock.findOne({ product: productId, warehouse: warehouseId })
  if (!stockRow) {
    const seedQty = String(product.warehouse) === String(warehouseId) ? product.stockQuantity : 0
    stockRow = await WarehouseStock.create({ product: productId, warehouse: warehouseId, quantity: seedQty })
  }

  const current = stockRow.quantity
  let newQty
  let delta
  if (adjustmentType === 'in') {
    newQty = current + qty
    delta = qty
  } else if (adjustmentType === 'out') {
    if (qty > current) return res.status(400).json({ message: 'Cannot remove more stock than is available' })
    newQty = current - qty
    delta = -qty
  } else if (adjustmentType === 'set') {
    newQty = qty
    delta = qty - current
  } else {
    return res.status(400).json({ message: 'Invalid adjustment type' })
  }

  stockRow.quantity = newQty
  await stockRow.save()

  const transaction = await InventoryTransaction.create({
    product: productId,
    warehouse: warehouseId,
    type: 'ADJUSTMENT',
    quantity: delta,
    balanceAfter: newQty,
    reference: reason,
    notes: notes || '',
    performedBy: req.user._id,
  })

  await recomputeProductTotal({ Product, WarehouseStock }, productId)

  res.status(201).json({
    quantity: newQty,
    reserved: stockRow.reserved || 0,
    available: newQty - (stockRow.reserved || 0),
    transaction,
  })
}

// POST /api/inventory/transfer
// body: { productId, fromWarehouseId, toWarehouseId, quantity, reason, notes }
export async function transferStock(req, res) {
  const { Product, WarehouseStock, InventoryTransaction } = req.tenant.models
  const { productId, fromWarehouseId, toWarehouseId, quantity, reason, notes } = req.body

  const qty = Number(quantity)
  if (!productId || !fromWarehouseId || !toWarehouseId || !Number.isFinite(qty) || qty <= 0) {
    return res.status(400).json({ message: 'Missing or invalid transfer details' })
  }
  if (fromWarehouseId === toWarehouseId) {
    return res.status(400).json({ message: 'Source and destination warehouse must be different' })
  }
  if (!reason?.trim()) return res.status(400).json({ message: 'A reason is required' })

  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ message: 'Product not found' })

  let fromStock = await WarehouseStock.findOne({ product: productId, warehouse: fromWarehouseId })
  if (!fromStock) {
    const seedQty = String(product.warehouse) === String(fromWarehouseId) ? product.stockQuantity : 0
    fromStock = await WarehouseStock.create({ product: productId, warehouse: fromWarehouseId, quantity: seedQty })
  }

  const available = fromStock.quantity - (fromStock.reserved || 0)
  if (qty > available) {
    return res.status(400).json({ message: 'The transfer quantity cannot exceed the available quantity' })
  }

  let toStock = await WarehouseStock.findOne({ product: productId, warehouse: toWarehouseId })
  if (!toStock) {
    toStock = await WarehouseStock.create({ product: productId, warehouse: toWarehouseId, quantity: 0 })
  }

  fromStock.quantity -= qty
  toStock.quantity += qty
  await fromStock.save()
  await toStock.save()

  const reference = `TRF-${Date.now().toString(36).toUpperCase()}`
  const noteText = notes ? `${reason} — ${notes}` : reason

  const [outTx, inTx] = await Promise.all([
    InventoryTransaction.create({
      product: productId,
      warehouse: fromWarehouseId,
      type: 'TRANSFER_OUT',
      quantity: -qty,
      balanceAfter: fromStock.quantity,
      reference,
      notes: noteText,
      performedBy: req.user._id,
    }),
    InventoryTransaction.create({
      product: productId,
      warehouse: toWarehouseId,
      type: 'TRANSFER_IN',
      quantity: qty,
      balanceAfter: toStock.quantity,
      reference,
      notes: noteText,
      performedBy: req.user._id,
    }),
  ])

  await recomputeProductTotal({ Product, WarehouseStock }, productId)

  res.status(201).json({
    from: { warehouse: fromWarehouseId, quantity: fromStock.quantity },
    to: { warehouse: toWarehouseId, quantity: toStock.quantity },
    transactions: [outTx, inTx],
  })
}