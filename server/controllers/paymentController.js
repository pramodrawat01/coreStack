const OPEN = ["sent", "partially_paid"];

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const money = (n) => `$${Number(n).toFixed(2)}`;
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const monthStart = (offset = 0) => {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + offset, 1));
};

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
    if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid id" });
    console.error("[payments]", err);
    res.status(500).json({ message: "Server error" });
  }
};

const parseDate = (value, label) => {
  const d = new Date(value);
  if (!value || Number.isNaN(d.getTime())) throw new HttpError(400, `${label} is invalid`);
  return d;
};

const buildFilter = ({ search, method, status }) => {
  const filter = {};
  if (search?.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ paymentNumber: rx }, { invoiceNumber: rx }, { customerName: rx }];
  }
  if (["bank_transfer", "card", "cash", "cheque", "other"].includes(method)) filter.method = method;
  if (["succeeded", "pending", "failed", "refunded"].includes(status)) filter.status = status;
  return filter;
};

// ---------- handlers ----------

export const listPayments = wrap(async (req, res) => {
  const { Payment } = req.tenant.models;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const filter = buildFilter(req.query);

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .sort({ paidAt: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-activity")
      .lean(),
    Payment.countDocuments(filter),
  ]);

  res.json({
    payments,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

export const getPaymentStats = wrap(async (req, res) => {
  const { Payment } = req.tenant.models;
  const thisMonth = monthStart(0);
  const nextMonth = monthStart(1);

  const sumByStatus = (status, dateField, from, to) => {
    const match = { status };
    if (from) match[dateField] = to ? { $gte: from, $lt: to } : { $gte: from };
    return Payment.aggregate([
      { $match: match },
      { $group: { _id: null, amount: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
  };

  const [collected, pending, failed, refunds] = await Promise.all([
    sumByStatus("succeeded", "paidAt", thisMonth, nextMonth),
    sumByStatus("pending", "paidAt"),
    sumByStatus("failed", "paidAt"),
    sumByStatus("refunded", "refundedAt", thisMonth, nextMonth),
  ]);

  res.json({
    stats: {
      collectedThisMonth: { amount: round2(collected[0]?.amount || 0), count: collected[0]?.count || 0 },
      pending: { amount: round2(pending[0]?.amount || 0), count: pending[0]?.count || 0 },
      failed: { amount: round2(failed[0]?.amount || 0), count: failed[0]?.count || 0 },
      refundsThisMonth: { amount: round2(refunds[0]?.amount || 0), count: refunds[0]?.count || 0 },
    },
  });
});

export const getPayment = wrap(async (req, res) => {
  const { Payment } = req.tenant.models;
  const payment = await Payment.findById(req.params.id).lean();
  if (!payment) throw new HttpError(404, "Payment not found");
  res.json({ payment });
});

export const createPayment = wrap(async (req, res) => {
  const { Invoice, Payment, PaymentCounter } = req.tenant.models;

  const invoiceId = req.body.invoiceId;
  if (!invoiceId) throw new HttpError(400, "Select an invoice");

  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new HttpError(404, "Invoice not found");
  if (!OPEN.includes(invoice.status)) {
    throw new HttpError(400, "Payments can only be recorded on sent invoices with a balance");
  }

  const amount = round2(req.body.amount);
  if (!(amount > 0)) throw new HttpError(400, "Enter a payment amount above 0");
  if (amount > invoice.balance + 0.001) {
    throw new HttpError(400, `Payment exceeds the balance due (${money(invoice.balance)})`);
  }

  const paidAt = req.body.paidAt ? parseDate(req.body.paidAt, "Payment date") : new Date();

  // Apply to the invoice — same mechanics as invoiceController.recordPayment
  invoice.amountPaid = round2(invoice.amountPaid + amount);
  invoice.balance = round2(invoice.total - invoice.amountPaid);
  if (invoice.balance <= 0) {
    invoice.balance = 0;
    invoice.status = "paid";
    invoice.paidAt = paidAt;
  } else {
    invoice.status = "partially_paid";
  }
  invoice.payments.push({
    amount,
    method: req.body.method || "bank_transfer",
    reference: req.body.reference || "",
    paidAt,
    recordedBy: req.user.userId,
  });
  invoice.activity.push({
    type: "payment",
    message: `Payment of ${money(amount)} recorded`,
    by: req.user.userId,
  });
  await invoice.save();

  const counter = await PaymentCounter.findOneAndUpdate(
    { _id: "payment" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const paymentNumber = `PAY-${String(counter.seq).padStart(6, "0")}`;

  const payment = await Payment.create({
    paymentNumber,
    invoiceId: invoice._id,
    invoiceNumber: invoice.invoiceNumber,
    customerId: invoice.customerId,
    customerName: invoice.customerName,
    contactName: invoice.contactName,
    contactEmail: invoice.billingEmail,
    amount,
    method: req.body.method || "bank_transfer",
    methodDetail: req.body.methodDetail?.trim() || "",
    status: "succeeded",
    reference: req.body.reference || "",
    transactionId: req.body.transactionId?.trim() || "",
    processor: req.body.processor?.trim() || "Manual",
    depositAccount: req.body.depositAccount || "",
    notes: req.body.notes || "",
    paidAt,
    settlementDate: paidAt, // no gateway yet, so no real settlement lag to model
    invoiceTotal: invoice.total,
    balanceAfter: invoice.balance,
    recordedBy: req.user.userId,
    activity: [
      { type: "initiated", message: "Payment initiated", at: paidAt },
      { type: "authorized", message: "Authorized", at: paidAt },
      { type: "captured", message: "Captured", at: paidAt },
    ],
  });

  res.status(201).json({ payment });
});

export const refundPayment = wrap(async (req, res) => {
  const { Invoice, Payment } = req.tenant.models;
  const payment = await Payment.findById(req.params.id);
  if (!payment) throw new HttpError(404, "Payment not found");
  if (payment.status !== "succeeded") throw new HttpError(400, "Only succeeded payments can be refunded");

  const invoice = await Invoice.findById(payment.invoiceId);
  if (invoice) {
    invoice.amountPaid = round2(Math.max(0, invoice.amountPaid - payment.amount));
    invoice.balance = round2(invoice.total - invoice.amountPaid);
    invoice.status = invoice.amountPaid > 0 ? "partially_paid" : "sent";
    invoice.activity.push({
      type: "payment",
      message: `Payment of ${money(payment.amount)} refunded`,
      by: req.user.userId,
    });
    await invoice.save();
  }

  payment.status = "refunded";
  payment.refundedAt = new Date();
  payment.activity.push({ type: "refunded", message: "Payment refunded", at: payment.refundedAt });
  await payment.save();

  res.json({ payment });
});