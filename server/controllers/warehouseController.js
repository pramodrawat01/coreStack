async function withComputedStats(warehouseDoc, Product) {
  const warehouse = warehouseDoc.toObject ? warehouseDoc.toObject() : warehouseDoc
  const products = await Product.find({ warehouse: warehouse._id }).select('stockQuantity').lean()

  const skusHeld = products.length
  const onHandUnits = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0)
  const percentFull = warehouse.storageCapacity > 0
    ? Math.min(100, Math.round((onHandUnits / warehouse.storageCapacity) * 100))
    : 0

  return { ...warehouse, skusHeld, onHandUnits, pendingShipments: 0, percentFull }
}

// GET /api/warehouses
export async function listWarehouses(req, res) {
  const { Warehouse, Product } = req.tenant.models
  const warehouses = await Warehouse.find().sort({ createdAt: -1 }).lean()
  const withStats = await Promise.all(warehouses.map((w) => withComputedStats(w, Product)))
  res.json(withStats)
}

// GET /api/warehouses/summary — the four top stat cards
export async function getWarehouseSummary(req, res) {
  const { Warehouse, Product } = req.tenant.models
  const warehouses = await Warehouse.find().lean()

  const activeFacilities = warehouses.filter((w) => w.status === 'Active').length
  const totalCapacity = warehouses.reduce((sum, w) => sum + (w.storageCapacity || 0), 0)

  const products = await Product.find({ warehouse: { $ne: null } }).select('stockQuantity cost warehouse').lean()
  const stockValueHeld = products.reduce((sum, p) => sum + (p.stockQuantity || 0) * (p.cost || 0), 0)
  const totalOnHand = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0)
  const utilizationPct = totalCapacity > 0 ? Math.round((totalOnHand / totalCapacity) * 100) : 0

  res.json({
    activeFacilities,
    totalCapacity,
    utilizationPct,
    stockValueHeld,
    pendingTransfers: 0, // stubbed until Purchase Orders / Transfers exist
  })
}

// GET /api/warehouses/:id
export async function getWarehouse(req, res) {
  const { Warehouse, Product } = req.tenant.models
  const warehouse = await Warehouse.findById(req.params.id)
  if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' })
  res.json(await withComputedStats(warehouse, Product))
}


// GET /api/warehouses/activity
export async function getRecentActivity(req, res) {
  const { InventoryTransaction } = req.tenant.models
  const transactions = await InventoryTransaction.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('product', 'name sku')
    .populate('warehouse', 'name')
    .populate('performedBy', 'name')
    .lean()

  res.json(transactions)
}


// POST /api/warehouses
export async function createWarehouse(req, res) {
  const warehouse = await req.tenant.models.Warehouse.create(req.body)
  res.status(201).json(await withComputedStats(warehouse, req.tenant.models.Product))
}

// PATCH /api/warehouses/:id
export async function updateWarehouse(req, res) {
  const warehouse = await req.tenant.models.Warehouse.findById(req.params.id)
  if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' })

  Object.assign(warehouse, req.body)
  await warehouse.save()
  res.json(await withComputedStats(warehouse, req.tenant.models.Product))
}

// DELETE /api/warehouses/:id
export async function deleteWarehouse(req, res) {
  const { Warehouse, Product } = req.tenant.models
  const warehouse = await Warehouse.findById(req.params.id)
  if (!warehouse) return res.status(404).json({ message: 'Warehouse not found' })

  const inUse = await Product.exists({ warehouse: warehouse._id })
  if (inUse) return res.status(400).json({ message: 'Cannot delete a warehouse that has products assigned to it' })

  await warehouse.deleteOne()
  res.json({ message: 'Warehouse deleted' })
}