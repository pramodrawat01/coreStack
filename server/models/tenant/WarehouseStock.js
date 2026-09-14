import mongoose from 'mongoose'

// One row per (product, warehouse) combination — this is what makes it possible
// for a single product to have stock split across multiple warehouses.
// Product.stockQuantity stays as a denormalized TOTAL (sum of these rows for that
// product), kept in sync by inventoryController after every adjust/transfer.
const warehouseStockSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },
    quantity: { type: Number, required: true, min: 0, default: 0 }, // on-hand at this warehouse
    reserved: { type: Number, required: true, min: 0, default: 0 }, // promised to orders — not wired yet, reserved for when Orders exists
  },
  { timestamps: true }
)

warehouseStockSchema.index({ product: 1, warehouse: 1 }, { unique: true })

export function getWarehouseStockModel(connection) {
  return connection.models.WarehouseStock || connection.model('WarehouseStock', warehouseStockSchema)
}