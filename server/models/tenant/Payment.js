import mongoose from "mongoose";

const { Schema } = mongoose;

const ActivitySchema = new Schema(
  {
    type: {
      type: String,
      enum: ["initiated", "authorized", "captured", "failed", "refunded"],
      required: true,
    },
    message: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { _id: false }
);

export const PaymentSchema = new Schema(
  {
    paymentNumber: { type: String, required: true, unique: true },

    invoiceId: { type: Schema.Types.ObjectId, required: true },
    invoiceNumber: { type: String, required: true },

    // Snapshotted so a payment record never changes if the customer record does
    customerId: { type: Schema.Types.ObjectId },
    customerName: { type: String, required: true, trim: true },
    contactName: { type: String, trim: true, default: "" },
    contactEmail: { type: String, trim: true, default: "" },

    amount: { type: Number, required: true, min: 0.01 },
    method: {
      type: String,
      enum: ["bank_transfer", "card", "cash", "cheque", "other"],
      default: "bank_transfer",
    },
    methodDetail: { type: String, trim: true, default: "" }, // e.g. "Visa ending 4242"

    status: {
      type: String,
      enum: ["succeeded", "pending", "failed", "refunded"],
      default: "succeeded",
    },

    reference: { type: String, trim: true, default: "" },
    transactionId: { type: String, trim: true, default: "" },
    processor: { type: String, trim: true, default: "Manual" },
    depositAccount: { type: String, trim: true, default: "" },
    notes: { type: String, default: "" },

    paidAt: { type: Date, required: true },
    settlementDate: { type: Date },
    refundedAt: { type: Date },

    // Invoice snapshot at the moment of payment, for the detail screen
    invoiceTotal: { type: Number },
    balanceAfter: { type: Number },

    activity: { type: [ActivitySchema], default: [] },
    recordedBy: { type: Schema.Types.ObjectId },
  },
  { timestamps: true }
);

PaymentSchema.index({ status: 1, paidAt: -1 });
PaymentSchema.index({ invoiceId: 1 });
PaymentSchema.index({ customerName: 1 });

// Global running sequence so numbers read PAY-009842 (not per-year, unlike invoices)
export const PaymentCounterSchema = new Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 },
});

export const getPaymentModels = (conn) => ({
  Payment: conn.models.Payment || conn.model("Payment", PaymentSchema),
  PaymentCounter:
    conn.models.PaymentCounter ||
    conn.model("PaymentCounter", PaymentCounterSchema),
});