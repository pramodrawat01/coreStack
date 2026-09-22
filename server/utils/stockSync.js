// Lazily creates WarehouseStock rows for products that already have a home
// warehouse (Product.warehouse) but no stock row yet — this is what lets every
// product created before WarehouseStock existed keep working with zero migration
// script. Runs cheaply (skips products that already have a row) at the top of
// every read/write endpoint below.

export async function bootstrapMissingStockRows({ Product, WarehouseStock }) {
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
export async function recomputeProductTotal({ Product, WarehouseStock }, productId) {
  const rows = await WarehouseStock.find({ product: productId }).select('quantity').lean()
  const total = rows.reduce((sum, r) => sum + r.quantity, 0)
  await Product.findByIdAndUpdate(productId, { stockQuantity: total })
  return total
}

export function computeStockStatus(quantity, reorderPoint = 0) {
  if (quantity <= 0) return 'Out of Stock'
  if (quantity <= reorderPoint) return 'Low Stock'
  return 'In Stock'
}