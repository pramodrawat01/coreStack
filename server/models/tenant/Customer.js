import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    customerType: { 
      type: String, 
      enum: ['Enterprise', 'SMB', 'Individual', 'Wholesale'], 
      default: 'Enterprise' 
    },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    primaryContact: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      role: { type: String, trim: true } // e.g. "Procurement Director"
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    
    // B2B Account Details
    accountId: { type: String, trim: true },
    industry: { type: String, trim: true },
    annualOrderValue: { type: Number, default: 0 },
    creditLimit: { type: Number, default: 0 },
    billingTerms: { type: String, default: 'Net 30' },
    assignedAccountManager: { type: String, trim: true },
    preferredContact: { type: String, enum: ['Email', 'Phone', 'SMS'], default: 'Email' },

    address: {
      addressLine1: { type: String, trim: true },
      addressLine2: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, default: 'United States', trim: true }
    },
    notes: { type: String, trim: true },

    // Dynamic metrics
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: { type: Date }
  },
  { timestamps: true }
);

export const getCustomerModel = (conn) =>
  conn.models.Customer || conn.model('Customer', customerSchema);