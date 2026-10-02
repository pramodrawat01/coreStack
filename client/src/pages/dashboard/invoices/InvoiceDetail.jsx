import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowLeft,
  FaBan,
  FaDollarSign,
  FaDownload,
  FaPaperPlane,
  FaPen,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  clearCurrentInvoice,
  deleteInvoice,
  fetchInvoice,
  recordPayment,
  selectInvoicesLoading,
  sendInvoice,
  voidInvoice,
} from "../../../store/invoicesSlice";
import {
  PAYMENT_METHODS,
  fmtDate,
  fmtDateTime,
  fmtMoney,
  toInputDate,
} from "../../../utils/invoice";
import InvoiceStatusBadge from "../../../components/dashboard/invoices/InvoiceStatusBadge";
import { usePermission } from "../../../hooks/usePermission"; // adjust to your hook's path/signature

const inputCls =
  "w-full rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-white placeholder:text-faint focus:border-accent2 focus:outline-none [color-scheme:dark]";

// Prints only the invoice card, on white, so "Download PDF" works via Save as PDF
const PRINT_CSS = `
@media print {
  body * { visibility: hidden; }
  #invoice-print, #invoice-print * { visibility: visible; }
  #invoice-print { position: absolute; inset: 0 auto auto 0; width: 100%; background: #fff !important; color: #000 !important; border: 0 !important; }
  #invoice-print * { color: #000 !important; background: transparent !important; border-color: #ddd !important; }
}`;

const ACTIVITY_ICON = {
  created: FaPlus,
  updated: FaPen,
  sent: FaPaperPlane,
  payment: FaDollarSign,
  voided: FaBan,
};

function RecordPaymentModal({ invoice, onClose, onSubmit, saving }) {
  const [amount, setAmount] = useState(String(invoice.balance));
  const [method, setMethod] = useState("bank_transfer");
  const [paidAt, setPaidAt] = useState(toInputDate(new Date()));
  const [reference, setReference] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ amount: Number(amount), method, paidAt, reference });
        }}
        className="w-full max-w-md rounded-lg border border-line bg-panel p-6"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Record payment</h2>
            <p className="mt-1 text-sm text-muted">
              {invoice.invoiceNumber} · {fmtMoney(invoice.balance)} due
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-faint hover:text-white">
            <FaTimes />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-muted">Amount</label>
            <input type="number" min="0.01" max={invoice.balance} step="0.01" required value={amount}
              onChange={(e) => setAmount(e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm text-muted">Method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
                {PAYMENT_METHODS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-muted">Payment date</label>
              <input type="date" required value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-muted">Reference (optional)</label>
            <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Transaction or cheque number" className={inputCls} />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose}
            className="rounded-md border border-line bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
            {saving ? "Saving…" : "Record payment"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoice = useSelector((s) => s.invoices.current);
  const saving = useSelector(selectInvoicesLoading);
  const companyName = useSelector((s) => s.auth?.company?.name) || "Corestack";
  const canWrite = usePermission("invoices", "write");
  const [paymentOpen, setPaymentOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchInvoice(id))
      .unwrap()
      .catch((msg) => {
        toast.error(msg);
        navigate("/dashboard/invoices", { replace: true });
      });
    return () => dispatch(clearCurrentInvoice());
  }, [dispatch, id, navigate]);

  if (!invoice || invoice._id !== id) {
    return <p className="py-20 text-center text-muted">Loading invoice…</p>;
  }

  const status = invoice.displayStatus;
  const isDraft = invoice.status === "draft";
  const isOpen = ["sent", "partially_paid"].includes(invoice.status);
  const addr = invoice.billingAddress || {};
  const cityLine = [addr.city, [addr.state, addr.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  const run = async (action, success) => {
    try {
      await action().unwrap();
      toast.success(success);
      return true;
    } catch (msg) {
      toast.error(msg);
      return false;
    }
  };

  const onSend = () => run(() => dispatch(sendInvoice(id)), "Invoice marked as sent");

  const onPayment = async (body) => {
    if (await run(() => dispatch(recordPayment({ id, body })), "Payment recorded")) {
      setPaymentOpen(false);
    }
  };

  const onVoid = () => {
    if (window.confirm(`Void ${invoice.invoiceNumber}? This can't be undone.`)) {
      run(() => dispatch(voidInvoice(id)), "Invoice voided");
    }
  };

  const onDelete = async () => {
    if (!window.confirm(`Delete draft ${invoice.invoiceNumber}?`)) return;
    if (await run(() => dispatch(deleteInvoice(id)), "Invoice deleted")) navigate("/invoices");
  };

  return (
    <div className="space-y-6">
      <style>{PRINT_CSS}</style>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            to="/dashboard/invoices"
            className="mb-4 inline-flex items-center gap-2 rounded-md border border-line bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
            <FaArrowLeft className="text-xs" /> Back to invoices
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">{invoice.invoiceNumber}</h1>
            <InvoiceStatusBadge status={status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            Issued {fmtDate(invoice.issueDate, true)} · Due {fmtDate(invoice.dueDate, true)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
            <FaDownload className="text-xs" /> Download PDF
          </button>
          {canWrite && isDraft && (
            <>
              <button onClick={onDelete} disabled={saving}
                className="rounded-md border border-line bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50">
                Delete
              </button>
              <Link to={`/dashboard/invoices/${id}/edit`}
                className="inline-flex items-center gap-2 rounded-md border border-line bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                <FaPen className="text-xs" /> Edit
              </Link>
              <button onClick={onSend} disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
                <FaPaperPlane className="text-xs" /> Mark as sent
              </button>
            </>
          )}
          {canWrite && isOpen && (
            <>
              {invoice.amountPaid === 0 && (
                <button onClick={onVoid} disabled={saving}
                  className="rounded-md border border-line bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50">
                  Void
                </button>
              )}
              <button onClick={() => setPaymentOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
                <FaDollarSign className="text-xs" /> Record payment
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div id="invoice-print" className="rounded-lg border border-line bg-panel p-8">
          <div className="flex items-start justify-between border-b border-line pb-6">
            <p className="text-lg font-semibold text-white">{companyName}</p>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wide text-muted">Invoice</p>
              <p className="text-lg font-semibold text-white">{invoice.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-between gap-6 border-b border-line py-6">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-muted">Bill to</p>
              <p className="font-semibold text-white">{invoice.customerName}</p>
              {invoice.contactName && <p className="text-sm text-muted">{invoice.contactName}</p>}
              <div className="mt-3 text-sm leading-6 text-muted">
                {addr.line1 && <p>{addr.line1}</p>}
                {addr.line2 && <p>{addr.line2}</p>}
                {cityLine && <p>{cityLine}</p>}
                <p>{invoice.billingEmail}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="mb-2 text-xs uppercase tracking-wide text-muted">Payment due</p>
              <p className="font-semibold text-white">{fmtDate(invoice.dueDate, true)}</p>
              <p className="text-sm text-muted">Payment terms: {invoice.paymentTerms}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th className="py-3 font-medium">Description</th>
                  <th className="py-3 text-right font-medium">Qty</th>
                  <th className="py-3 text-right font-medium">Unit price</th>
                  <th className="py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((it, i) => (
                  <tr key={i} className="border-b border-line/60">
                    <td className="py-4 font-medium text-white">{it.description}</td>
                    <td className="py-4 text-right text-muted">{it.quantity}</td>
                    <td className="py-4 text-right text-muted">{fmtMoney(it.unitPrice)}</td>
                    <td className="py-4 text-right font-semibold text-white">{fmtMoney(it.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <dl className="ml-auto mt-6 max-w-xs space-y-2 text-sm">
            <div className="flex justify-between text-muted"><dt>Subtotal</dt><dd>{fmtMoney(invoice.subtotal)}</dd></div>
            <div className="flex justify-between text-muted">
              <dt>Tax{invoice.taxRate ? ` (${invoice.taxRate}%)` : ""}</dt><dd>{fmtMoney(invoice.tax)}</dd>
            </div>
            {invoice.shipping > 0 && (
              <div className="flex justify-between text-muted"><dt>Shipping</dt><dd>{fmtMoney(invoice.shipping)}</dd></div>
            )}
            <div className="flex justify-between border-t border-line pt-3 font-semibold text-white">
              <dt>Total</dt><dd>{fmtMoney(invoice.total)}</dd>
            </div>
            {invoice.amountPaid > 0 && (
              <div className="flex justify-between text-muted"><dt>Paid</dt><dd>−{fmtMoney(invoice.amountPaid)}</dd></div>
            )}
            <div className="flex justify-between rounded-md bg-accent2/15 px-3 py-2.5 font-medium text-blue-300">
              <dt>Balance due</dt><dd>{fmtMoney(invoice.balance)}</dd>
            </div>
          </dl>

          {invoice.notes && <p className="mt-8 text-sm text-muted">{invoice.notes}</p>}
        </div>

        <aside className="h-fit rounded-lg border border-line bg-panel p-5">
          <h2 className="font-semibold text-white">Activity</h2>
          <p className="mb-4 text-sm text-muted">Invoice history</p>
          <ul className="space-y-4">
            {[...invoice.activity].reverse().map((a, i) => {
              const Icon = ACTIVITY_ICON[a.type] || FaPlus;
              return (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs text-accent2">
                    <Icon />
                  </span>
                  <div className="min-w-0">
                    <p className="break-words text-sm font-medium text-white">{a.message}</p>
                    <p className="text-xs text-muted">{fmtDateTime(a.at)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      <AnimatePresence>
        {paymentOpen && (
          <RecordPaymentModal
            invoice={invoice}
            saving={saving}
            onClose={() => setPaymentOpen(false)}
            onSubmit={onPayment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}