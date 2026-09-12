import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    category: { type: String, trim: true, default: 'Uncategorized' },
    description: { type: String, trim: true, default: '' },
    price: { type: Number, required: true, min: 0 },
    cost: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    reorderPoint: { type: Number, min: 0, default: 0 },
    weight: { type: Number, min: 0, default: 0 },
    // warehouse : { type : String, trim : true, default : ""},
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref : 'Warehouse', default : null },
    supplier: { type: String, trim: true, default: '' },
    images: [{ type: String }], // base64 data URLs for now
    isActive: { type: Boolean, default: true },
    // stockMovements: [stockMovementSchema],
  },
  { timestamps: true }
)

/// indexing 
productSchema.index({ sku : 1}, { unique : true})

export function getProductModel(connection){
    return connection.models.Product || connection.model('Product', productSchema)
}