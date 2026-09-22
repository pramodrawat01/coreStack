import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  totalPrice: { type: Number, required: true, min: 0 }
});

const orderTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  label: { type: String, required: true },
  completedAt: { type: Date, default: null }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true }, // e.g., #ORD-20841
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    customerName: { type: String, required: true },
    contactName: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    items: [orderItemSchema],
    
    // Financial Breakdown
    subtotal: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },

    // Statuses
    paymentStatus: { 
      type: String, 
      enum: ['Paid', 'Pending', 'Failed', 'Refunded'], 
      default: 'Pending' 
    },
    fulfillmentStatus: {  
      type: String, 
      enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], 
      default: 'Processing' 
    },
    deliveryMethod: { type: String, default: 'Standard delivery' },

    // Shipping Info
    shippingAddress: {
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String, default: 'United States' }
    },

    notes: { type: String },
    timeline: [orderTimelineSchema]
  },
  { timestamps: true }
);

export const getOrderModel = (conn) =>
  conn.models.Order || conn.model('Order', orderSchema);