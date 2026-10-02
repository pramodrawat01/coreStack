import mongoose from "mongoose";

const { Schema } = mongoose;

const LineItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId },
    description: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0.01 },
    unitPrice: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const PaymentSchema = new Schema({
  amount: { type: Number, required: true, min: 0.01 },
  method: {
    type: String,
    enum: ["bank_transfer", "card", "cash", "cheque", "other"],
    default: "bank_transfer",
  },
  reference: { type: String, trim: true, default: "" },
  paidAt: { type: Date, required: true },
  recordedBy: { type: Schema.Types.ObjectId },
});

const ActivitySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["created", "updated", "sent", "payment", "voided"],
      required: true,
    },
    message: { type: String, required: true },
    at: { type: Date, default: Date.now },
    by: { type: Schema.Types.ObjectId },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    line1: { type: String, trim: true, default: "" },
    line2: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    zip: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

export const InvoiceSchema = new Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },

    // Customer is snapshotted so an invoice never changes if the customer record does
    customerId: { type: Schema.Types.ObjectId },
    customerName: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true, default: "" },
    billingEmail: { type: String, required: true, trim: true, lowercase: true },
    billingAddress: { type: AddressSchema, default: () => ({}) },
    orderId: { type: Schema.Types.ObjectId },

    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    paymentTerms: {
      type: String,
      enum: ["Due on receipt", "Net 15", "Net 30", "Net 45", "Net 60"],
      default: "Net 30",
    },

    items: { type: [LineItemSchema], validate: (v) => v.length > 0 },
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balance: { type: Number, required: true },

    // "overdue" is derived at read time (sent/partially_paid + past due), never stored
    status: {
      type: String,
      enum: ["draft", "sent", "partially_paid", "paid", "void"],
      default: "draft",
    },
    paidAt: { type: Date },

    notes: { type: String, default: "" },
    payments: { type: [PaymentSchema], default: [] },
    activity: { type: [ActivitySchema], default: [] },
    createdBy: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

InvoiceSchema.index({ status: 1, dueDate: 1 });
InvoiceSchema.index({ issueDate: -1 });
InvoiceSchema.index({ customerName: 1 });

// Per-year sequence so numbers read INV-2024-0184
export const InvoiceCounterSchema = new Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 },
});

export const getInvoiceModels = (conn) => ({
  Invoice: conn.models.Invoice || conn.model("Invoice", InvoiceSchema),
  InvoiceCounter:
    conn.models.InvoiceCounter ||
    conn.model("InvoiceCounter", InvoiceCounterSchema),
});