import mongoose from 'mongoose'

const supplierSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    supplierType: {
      type: String,
      enum: ['Strategic manufacturer', 'Distributor', 'Wholesaler', 'Local vendor'],
      default: 'Strategic manufacturer',
    },
    status: { type: String, enum: ['Active', 'Inactive', 'Pending review'], default: 'Active' },

    primaryContact: {
      firstName: { type: String, trim: true },
      lastName: { type: String, trim: true },
      role: { type: String, trim: true }, // e.g. "Account Manager"
    },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },

    supplierId: { type: String, trim: true },
    category: { type: String, trim: true },
    annualPurchaseValue: { type: Number, default: 0 },
    paymentTerms: { type: String, default: 'Net 30' },
    averageLeadTime: { type: Number, default: 0 }, // days — entered manually per supplier, real even without POs
    assignedBuyer: { type: String, trim: true },
    preferredContact: { type: String, enum: ['Email', 'Phone', 'SMS'], default: 'Email' },

    address: {
      addressLine1: { type: String, trim: true },
      addressLine2: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, default: 'United States', trim: true },
    },
    notes: { type: String, trim: true },

    // Denormalized purchase-order metrics — stay at 0/null until the Purchase
    // Orders module exists. Same pattern as Customer.totalOrders/totalSpent:
    // whatever creates a PO later is responsible for incrementing these.
    totalPurchased: { type: Number, default: 0 },
    openPurchaseOrders: { type: Number, default: 0 },
    lastDeliveryDate: { type: Date },
  },
  { timestamps: true }
)

supplierSchema.index({ email: 1 })

export function getSupplierModel(connection) {
  return connection.models.Supplier || connection.model('Supplier', supplierSchema)
}