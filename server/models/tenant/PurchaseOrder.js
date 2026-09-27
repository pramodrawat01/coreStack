import mongoose from 'mongoose'

const purchaseOrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true }, // which warehouse receives this line
    name: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitCost: { type: Number, required: true, min: 0 },
    totalCost: { type: Number, required: true, min: 0 },
  },
  { _id: false }
)

const purchaseOrderTimelineSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    label: { type: String, required: true },
    completedAt: { type: Date, default: null },
  },
  { _id: false }
)

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: { type: String, required: true, unique: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    supplierName: { type: String, required: true }, // denormalized, same pattern as Order.customerName

    warehouse : { type : mongoose.Schema.Types.ObjectId, ref : 'Warehouse', required : true},

    items: [purchaseOrderItemSchema],

    subtotal: { type: Number, required: true, default: 0 },
    shippingCost: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalCost: { type: Number, required: true, default: 0 },

    status: {
      type: String,
      enum: ['Draft', 'Sent', 'Partially Received', 'Received', 'Cancelled'],
      default: 'Sent',
    },
    expectedDeliveryDate: { type: Date },
    notes: { type: String },
    timeline: [purchaseOrderTimelineSchema],
  },
  { timestamps: true }
)

export function getPurchaseOrderModel(connection) {
  return connection.models.PurchaseOrder || connection.model('PurchaseOrder', purchaseOrderSchema)
}