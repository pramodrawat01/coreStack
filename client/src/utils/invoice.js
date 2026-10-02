export const TERM_DAYS = {
  "Due on receipt": 0,
  "Net 15": 15,
  "Net 30": 30,
  "Net 45": 45,
  "Net 60": 60,
};

export const PAYMENT_METHODS = [
  ["bank_transfer", "Bank transfer"],
  ["card", "Card"],
  ["cash", "Cash"],
  ["cheque", "Cheque"],
  ["other", "Other"],
];

export const fmtMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(n) || 0);

// Dates are stored/displayed in UTC so date inputs never shift a day
export const fmtDate = (d, withYear = false) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
    ...(withYear && { year: "numeric" }),
  });

export const fmtDateTime = (d) =>
  new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const toInputDate = (d) => new Date(d).toISOString().slice(0, 10);

export const addDays = (dateStr, days) => {
  const d = new Date(dateStr);
  d.setUTCDate(d.getUTCDate() + days);
  return toInputDate(d);
};

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// Mirrors the server calculation; the server is still the source of truth
export const calcTotals = (items, taxRate, shipping) => {
  const subtotal = round2(
    items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0)
  );
  const tax = round2((subtotal * (Number(taxRate) || 0)) / 100);
  const ship = Number(shipping) || 0;
  return { subtotal, tax, shipping: ship, total: round2(subtotal + tax + ship) };
};