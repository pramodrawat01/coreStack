import mongoose from "mongoose";

const inventoryTransactionSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', required: true },

    type: {
      type: String,
      enum: ['PURCHASE', 'SALE', 'RETURN', 'TRANSFER_IN', 'TRANSFER_OUT', 'ADJUSTMENT'],
      required: true,
    },
    quantity: { type: Number, required: true }, // positive for IN, negative for OUT
    balanceAfter: { type: Number, required: true }, // snapshot of onHand after this transaction

    reference: { type: String, trim: true, default: '' }, // e.g. "PO-1234", "ORD-5678"
    notes: { type: String, trim: true, default: '' },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

inventoryTransactionSchema.index({product : 1, createdAt : -1})
inventoryTransactionSchema.index({warehouse : 1, createdAt : -1})

export function getInventoryTransactionModel(connection){
    return connection.models.InventoryTransaction || connection.model('InventoryTransaction', inventoryTransactionSchema)
}