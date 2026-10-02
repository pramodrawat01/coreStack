export { fmtMoney, fmtDate, fmtDateTime, toInputDate } from "./invoice.js";

export const PAYMENT_METHODS = [
  ["bank_transfer", "ACH transfer"],
  ["card", "Card"],
  ["cash", "Cash"],
  ["cheque", "Cheque"],
  ["other", "Other"],
];

export const DEPOSIT_ACCOUNTS = ["Operating account", "Payroll account", "Savings account"];

export const methodLabel = (m) => PAYMENT_METHODS.find(([v]) => v === m)?.[1] || m;