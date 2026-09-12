import mongoose from 'mongoose'

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true },
    manager: { type: String, trim: true, default: '' },
    address: { type: String, trim: true, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    zipCode: { type: String, trim: true, default: '' },
    storageCapacity: { type: Number, min: 0, default: 0 }, // sq ft
    status: { type: String, enum: ['Active', 'Review', 'Inactive'], default: 'Active' },
  },
  { timestamps: true }
)

export function getWarehouseModel(connection) {
  return connection.models.Warehouse || connection.model('Warehouse', warehouseSchema)
}