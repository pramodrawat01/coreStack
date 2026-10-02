
const OPEN = ["sent", "partially_paid"];
const DAY = 86400000;

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const money = (n) => `$${Number(n).toFixed(2)}`;
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Dates are handled in UTC so a "2024-06-12" date input never shifts a day
const startOfToday = () => new Date(new Date().toISOString().slice(0, 10));
const monthStart = (offset = 0) => {
  const n = new Date();
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth() + offset, 1));
};

// const models = async (req) =>
//   getInvoiceModels(await getTenantConnection(req.user.dbName));

const wrap = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ message: err.message });
    if (err.name === "ValidationError") return res.status(400).json({ message: err.message });
    if (err.name === "CastError") return res.status(400).json({ message: "Invalid id" });
    console.error("[invoices]", err);
    res.status(500).json({ message: "Server error" });
  }
};

const decorate = (inv) => ({
  ...inv,
  displayStatus:
    OPEN.includes(inv.status) && new Date(inv.dueDate) < startOfToday()
      ? "overdue"
      : inv.status,
});

const parseDate = (value, label) => {
  const d = new Date(value);
  if (!value || Number.isNaN(d.getTime())) throw new HttpError(400, `${label} is invalid`);
  return d;
};

const pickDetails = (body) => {
  const customerName = body.customerName?.trim();
  const billingEmail = body.billingEmail?.trim();
  if (!customerName) throw new HttpError(400, "Customer is required");
  if (!billingEmail) throw new HttpError(400, "Billing email is required");

  const issueDate = parseDate(body.issueDate, "Issue date");
  const dueDate = parseDate(body.dueDate, "Due date");
  if (dueDate < issueDate) throw new HttpError(400, "Due date can't be before the issue date");

  return {
    customerId: body.customerId || undefined,
    orderId: body.orderId || undefined,
    customerName,
    contactName: body.contactName?.trim() || "",
    billingEmail,
    billingAddress: body.billingAddress || {},
    issueDate,
    dueDate,
    paymentTerms: body.paymentTerms || "Net 30",
    notes: body.notes || "",
  };
};

const buildTotals = ({ items = [], taxRate = 0, shipping = 0 }) => {
  if (!Array.isArray(items) || !items.length) {
    throw new HttpError(400, "Add at least one line item");
  }
  const lines = items.map((i) => {
    const quantity = Number(i.quantity);
    const unitPrice = Number(i.unitPrice);
    if (!i.description?.trim() || !(quantity > 0) || !(unitPrice >= 0)) {
      throw new HttpError(400, "Each line item needs a description, a quantity above 0 and a unit price");
    }
    return {
      productId: i.productId || undefined,
      description: i.description.trim(),
      quantity,
      unitPrice,
      total: round2(quantity * unitPrice),
    };
  });

  const rate = Number(taxRate) || 0;
  const ship = Number(shipping) || 0;
  if (rate < 0 || rate > 100) throw new HttpError(400, "Tax rate must be between 0 and 100");
  if (ship < 0) throw new HttpError(400, "Shipping can't be negative");

  const subtotal = round2(lines.reduce((s, l) => s + l.total, 0));
  const tax = round2((subtotal * rate) / 100);
  return { items: lines, subtotal, taxRate: rate, tax, shipping: ship, total: round2(subtotal + tax + ship) };
};

const buildFilter = ({ search, status, period }) => {
  const filter = {};
  const today = startOfToday();

  if (search?.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ invoiceNumber: rx }, { customerName: rx }];
  }

  if (status === "overdue") {
    Object.assign(filter, { status: { $in: OPEN }, dueDate: { $lt: today } });
  } else if (OPEN.includes(status)) {
    Object.assign(filter, { status, dueDate: { $gte: today } });
  } else if (["draft", "paid", "void"].includes(status)) {
    filter.status = status;
  }

  const ranges = {
    this_month: { $gte: monthStart(0), $lt: monthStart(1) },
    last_month: { $gte: monthStart(-1), $lt: monthStart(0) },
    last_90: { $gte: new Date(Date.now() - 90 * DAY) },
    this_year: { $gte: new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1)) },
  };
  if (ranges[period]) filter.issueDate = ranges[period];

  return filter;
};

// ---------- handlers ----------

export const listInvoices = wrap(async (req, res) => {
  // const { Invoice } = await models(req);
  const { Invoice } = req.tenant.models


  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50);
  const filter = buildFilter(req.query);
  // console.log('filter', filter)

  const [invoices, total] = await Promise.all([
    Invoice.find(filter)
      .sort({ issueDate: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-items -payments -activity")
      .lean(),
    Invoice.countDocuments(filter),
  ]);
  // console.log('invoices : ', invoices)

  res.json({
    invoices: invoices.map(decorate),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

export const getInvoiceStats = wrap(async (req, res) => {
      const { Invoice } = req.tenant.models

  //const { Invoice } = await models(req);
  const today = startOfToday();
  const thisMonth = monthStart(0);
  const nextMonth = monthStart(1);
  const lastMonth = monthStart(-1);

  const sumBalance = (match) =>
    Invoice.aggregate([
      { $match: match },
      { $group: { _id: null, amount: { $sum: "$balance" }, count: { $sum: 1 } } },
    ]);
  const paidIn = (from, to) =>
    Invoice.aggregate([
      { $unwind: "$payments" },
      { $match: { "payments.paidAt": { $gte: from, $lt: to } } },
      { $group: { _id: null, amount: { $sum: "$payments.amount" } } },
    ]);
  const avgDays = (from, to) =>
    Invoice.aggregate([
      { $match: { status: "paid", paidAt: { $gte: from, $lt: to } } },
      {
        $group: {
          _id: null,
          days: { $avg: { $divide: [{ $subtract: ["$paidAt", "$issueDate"] }, DAY] } },
        },
      },
    ]);

  const [outstanding, overdue, paidNow, paidPrev, daysNow, daysPrev] = await Promise.all([
    sumBalance({ status: { $in: OPEN } }),
    sumBalance({ status: { $in: OPEN }, dueDate: { $lt: today } }),
    paidIn(thisMonth, nextMonth),
    paidIn(lastMonth, thisMonth),
    avgDays(thisMonth, nextMonth),
    avgDays(lastMonth, thisMonth),
  ]);

  const paidThis = round2(paidNow[0]?.amount || 0);
  const paidLast = round2(paidPrev[0]?.amount || 0);
  const dNow = daysNow[0]?.days;
  const dPrev = daysPrev[0]?.days;

  res.json({
    stats: {
      outstanding: { amount: round2(outstanding[0]?.amount || 0), count: outstanding[0]?.count || 0 },
      overdue: { amount: round2(overdue[0]?.amount || 0), count: overdue[0]?.count || 0 },
      paidThisMonth: {
        amount: paidThis,
        changePct: paidLast > 0 ? round2(((paidThis - paidLast) / paidLast) * 100) : null,
      },
      avgPaymentDays: {
        value: dNow != null ? Math.round(dNow * 10) / 10 : null,
        delta: dNow != null && dPrev != null ? Math.round((dNow - dPrev) * 10) / 10 : null,
      },
    },
  });
});

export const getInvoice = wrap(async (req, res) => {
//   const { Invoice } = await models(req);
  const { Invoice } = req.tenant.models

  const invoice = await Invoice.findById(req.params.id).lean();
  
  if (!invoice) throw new HttpError(404, "Invoice not found");
  res.json({ invoice: decorate(invoice) });
});

export const createInvoice = wrap(async (req, res) => {
//   const { Invoice, InvoiceCounter } = await models(req);
  const { Invoice, InvoiceCounter } = req.tenant.models

  const details = pickDetails(req.body);
  const totals = buildTotals(req.body);

  const year = details.issueDate.getUTCFullYear();
  const counter = await InvoiceCounter.findOneAndUpdate(
    { _id: `invoice-${year}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  const invoiceNumber = `INV-${year}-${String(counter.seq).padStart(4, "0")}`;

  const invoice = await Invoice.create({
    ...details,
    ...totals,
    invoiceNumber,
    status: "draft",
    amountPaid: 0,
    balance: totals.total,
    createdBy: req.user.userId,
    activity: [{ type: "created", message: "Invoice created", by: req.user.userId }],
  });

  res.status(201).json({ invoice: decorate(invoice.toObject()) });
});

export const updateInvoice = wrap(async (req, res) => {
//   const { Invoice } = await models(req);
  const { Invoice } = req.tenant.models


  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new HttpError(404, "Invoice not found");
  if (invoice.status !== "draft") throw new HttpError(400, "Only draft invoices can be edited");

  const totals = buildTotals(req.body);
  Object.assign(invoice, pickDetails(req.body), totals, { balance: totals.total });
  invoice.activity.push({ type: "updated", message: "Invoice updated", by: req.user.userId });
  await invoice.save();

  res.json({ invoice: decorate(invoice.toObject()) });
});

export const sendInvoice = wrap(async (req, res) => {
//   const { Invoice } = await models(req);
    const { Invoice } = req.tenant.models

  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new HttpError(404, "Invoice not found");
  if (invoice.status !== "draft") throw new HttpError(400, "Invoice has already been sent");

  // Email delivery is deferred; this only marks the invoice as sent and logs it
  invoice.status = "sent";
  invoice.activity.push({
    type: "sent",
    message: `Sent to ${invoice.billingEmail}`,
    by: req.user.userId,
  });
  await invoice.save();

  res.json({ invoice: decorate(invoice.toObject()) });
});

export const recordPayment = wrap(async (req, res) => {
//   const { Invoice } = await models(req);
    const { Invoice } = req.tenant.models

  const invoice = await Invoice.findById(req.params.id);
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

  invoice.payments.push({
    amount,
    method: req.body.method || "bank_transfer",
    reference: req.body.reference || "",
    paidAt,
    recordedBy: req.user.userId,
  });
  invoice.amountPaid = round2(invoice.amountPaid + amount);
  invoice.balance = round2(invoice.total - invoice.amountPaid);

  if (invoice.balance <= 0) {
    invoice.balance = 0;
    invoice.status = "paid";
    invoice.paidAt = paidAt;
  } else {
    invoice.status = "partially_paid";
  }
  invoice.activity.push({
    type: "payment",
    message: `Payment of ${money(amount)} recorded`,
    by: req.user.userId,
  });
  await invoice.save();

  res.json({ invoice: decorate(invoice.toObject()) });
});

export const voidInvoice = wrap(async (req, res) => {
//   const { Invoice } = await models(req);
  const { Invoice } = req.tenant.models

  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new HttpError(404, "Invoice not found");
  if (!OPEN.includes(invoice.status) || invoice.amountPaid > 0) {
    throw new HttpError(400, "Only sent invoices with no payments can be voided");
  }

  invoice.status = "void";
  invoice.balance = 0;
  invoice.activity.push({ type: "voided", message: "Invoice voided", by: req.user.userId });
  await invoice.save();

  res.json({ invoice: decorate(invoice.toObject()) });
});

export const deleteInvoice = wrap(async (req, res) => {
//   const { Invoice } = await models(req);
  const { Invoice } = req.tenant.models

  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) throw new HttpError(404, "Invoice not found");
  if (invoice.status !== "draft") {
    throw new HttpError(400, "Only draft invoices can be deleted. Void it instead.");
  }
  await invoice.deleteOne();
  res.json({ message: "Invoice deleted", id: req.params.id });
});