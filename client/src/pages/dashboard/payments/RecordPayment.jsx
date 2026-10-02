// import { useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { apiFetch } from "../../../lib/api.js";
// import { createPayment, selectPaymentsLoading } from "../../../store/paymentsSlice";
// import { fmtMoney, toInputDate, PAYMENT_METHODS, DEPOSIT_ACCOUNTS } from "../../../utils/payment";
// import { fetchInvoices } from "../../../store/invoicesSlice";

// const inputCls =
//   "w-full rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-white placeholder:text-faint focus:border-accent2 focus:outline-none [color-scheme:dark]";
// const labelCls = "mb-1.5 block text-sm text-muted";

// // Open invoices are sent, partially paid, or overdue (overdue is a sent/partially_paid
// // invoice past its due date, so it's filtered client-side via displayStatus)
// const isPayable = (inv) => ["sent", "partially_paid", "overdue"].includes(inv.displayStatus);

// export default function RecordPayment() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const saving = useSelector(selectPaymentsLoading);

//   const [invoices, setInvoices] = useState([]);
//   const [invoiceSearch, setInvoiceSearch] = useState('')

//   const [invoiceId, setInvoiceId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [paidAt, setPaidAt] = useState(toInputDate(new Date()));
//   const [method, setMethod] = useState("bank_transfer");
//   const [reference, setReference] = useState("");
//   const [depositAccount, setDepositAccount] = useState(DEPOSIT_ACCOUNTS[0]);
//   const [notes, setNotes] = useState("");

//   useEffect(() => {
//     apiFetch("/api/invoices?limit=200")
//       .then((d) => setInvoices((d.invoices || []).filter(isPayable)))
//       .catch(() => setInvoices([]));
//   }, []);

//     useEffect(() => {
//         if (invoiceSearch.trim().length >= 2) {
//         dispatch(fetchInvoices({ search: invoiceSearch, page: 1, limit: 8 }));
//         }
//     }, [dispatch, invoiceSearch]);

//   const selected = useMemo(() => invoices.find((i) => i._id === invoiceId), [invoices, invoiceId]);
//   const options = useMemo(
//     () => invoices.map((i) => ({ id: i._id, label: `${i.invoiceNumber} — ${i.customerName}` })),
//     [invoices]
//   );

//   const onInvoicePick = (label) => {
//     const match = options.find((o) => o.label === label);
//     setInvoiceId(match?.id || "");
//     if (match) {
//       const inv = invoices.find((i) => i._id === match.id);
//       setAmount(String(inv.balance));
//     }
//   };

//   const applyingNow = Number(amount) || 0;
//   const previouslyPaid = selected?.amountPaid || 0;
//   const invoiceTotal = selected?.total || 0;
//   const remaining = Math.max(0, round2(invoiceTotal - previouslyPaid - applyingNow));

//   function round2(n) {
//     return Math.round((Number(n) + Number.EPSILON) * 100) / 100;
//   }

//   const submit = async (e) => {
//     e.preventDefault();
//     if (!selected) return toast.error("Select an invoice");
//     if (!(applyingNow > 0)) return toast.error("Enter a payment amount above 0");
//     if (applyingNow > selected.balance + 0.001) {
//       return toast.error(`Payment exceeds the balance due (${fmtMoney(selected.balance)})`);
//     }

//     try {
//       const { payment } = await dispatch(
//         createPayment({
//           invoiceId,
//           amount: applyingNow,
//           paidAt,
//           method,
//           reference,
//           depositAccount,
//           notes,
//         })
//       ).unwrap();
//       toast.success(`Payment ${payment.paymentNumber} recorded`);
//       navigate(`/payments/${payment._id}`);
//     } catch (msg) {
//       toast.error(msg);
//     }
//   };

//   return (
//     <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold text-white">Record payment</h1>
//           <p className="mt-1 text-sm text-muted">Apply a payment to an outstanding invoice</p>
//         </div>
//         <div className="flex gap-2">
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="rounded-md border border-line bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={saving}
//             className="rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
//           >
//             {saving ? "Saving…" : "Record payment"}
//           </button>
//         </div>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
//         <section className="rounded-lg border border-line bg-panel p-6">
//           <h2 className="font-semibold text-white">Payment details</h2>
//           <p className="mb-5 text-sm text-muted">Enter the payment information below.</p>

//           <div className="space-y-5">
//             <div>
//               <label className={labelCls}>Invoice</label>
//               <input
//                 list="invoice-options"
//                 defaultValue=""
//                 // onChange={(e) => onInvoicePick(e.target.value)}
//                                 onChange={(e) => setInvoiceSearch(e.target.value)}

//                 placeholder="Search by invoice number or customer"
//                 className={inputCls}
//                 value={invoiceSearch}
//               />
//               <datalist id="invoice-options">
//                 {options.map((o) => (
//                   <option key={o.id} value={o.label} />
//                 ))}
//               </datalist>
//             </div>
//             <div>
//               <label className={labelCls}>Customer</label>
//               <input value={selected?.customerName || ""} readOnly className={`${inputCls} opacity-70`} />
//             </div>
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className={labelCls}>Payment amount</label>
//                 <input
//                   type="number"
//                   min="0.01"
//                   step="0.01"
//                   max={selected?.balance}
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="0.00"
//                   className={inputCls}
//                 />
//               </div>
//               <div>
//                 <label className={labelCls}>Payment date</label>
//                 <input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className={inputCls} />
//               </div>
//             </div>
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div>
//                 <label className={labelCls}>Payment method</label>
//                 <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
//                   {PAYMENT_METHODS.map(([v, l]) => (
//                     <option key={v} value={v}>{l}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className={labelCls}>Reference</label>
//                 <input
//                   value={reference}
//                   onChange={(e) => setReference(e.target.value)}
//                   placeholder="Transaction or cheque number"
//                   className={inputCls}
//                 />
//               </div>
//             </div>
//             <div>
//               <label className={labelCls}>Deposit account</label>
//               <select value={depositAccount} onChange={(e) => setDepositAccount(e.target.value)} className={inputCls}>
//                 {DEPOSIT_ACCOUNTS.map((a) => (
//                   <option key={a} value={a}>{a}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className={labelCls}>Notes</label>
//               <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
//             </div>
//           </div>
//         </section>

//         <aside className="h-fit rounded-lg border border-line bg-panel p-5">
//           <h2 className="font-semibold text-white">Payment summary</h2>
//           <p className="mb-4 text-sm text-muted">Review the amount being applied.</p>
//           <dl className="space-y-3 text-sm">
//             <div className="flex justify-between text-muted"><dt>Invoice total</dt><dd className="text-white">{fmtMoney(invoiceTotal)}</dd></div>
//             <div className="flex justify-between text-muted"><dt>Previously paid</dt><dd className="text-white">{fmtMoney(previouslyPaid)}</dd></div>
//             <div className="flex justify-between text-muted"><dt>Applying now</dt><dd className="text-blue-300">{fmtMoney(applyingNow)}</dd></div>
//             <div className="flex justify-between border-t border-line pt-3 font-semibold text-white">
//               <dt>Remaining balance</dt><dd>{fmtMoney(remaining)}</dd>
//             </div>
//           </dl>
//         </aside>
//       </div>
//     </form>
//   );
// }








import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchInvoices } from "../../../store/invoicesSlice";
import { createPayment, selectPaymentsLoading } from "../../../store/paymentsSlice";
import { fmtMoney, toInputDate, PAYMENT_METHODS, DEPOSIT_ACCOUNTS } from "../../../utils/payment";
import CustomDropdown from "../../../components/common/CustomDropdown";

const inputCls =
  "w-full rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-white placeholder:text-faint focus:border-accent2 focus:outline-none [color-scheme:dark]";
const labelCls = "mb-1.5 block text-sm text-muted";

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

function InvoicePicker({ selectedInvoice, onSelect }) {
  const dispatch = useDispatch();
  const { invoices } = useSelector((s) => s.invoices);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const boxRef = useRef(null);

  // Default list (no search yet) vs. live search, same gating as a type-ahead search
  useEffect(() => {
    if (!open) return;
    dispatch(fetchInvoices({ search: search.trim(), page: 1, limit: 8 }));
  }, [dispatch, open, search]);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const payableResults = invoices.filter((inv) =>
    ["sent", "partially_paid", "overdue"].includes(inv.displayStatus)
  );

  const pick = (inv) => {
    onSelect(inv);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputCls} flex items-center justify-between text-left`}
      >
        {selectedInvoice ? (
          <span>
            <span className="font-mono text-accent2">{selectedInvoice.invoiceNumber}</span>
            <span className="ml-2 text-white">{selectedInvoice.customerName}</span>
          </span>
        ) : (
          <span className="text-faint">Select an invoice</span>
        )}
        <FaChevronDown className={`text-xs text-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-line bg-panel shadow-lg">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2">
            <FaSearch size={12} className="text-faint" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by invoice number or customer"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-faint outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {payableResults.length === 0 ? (
              <p className="px-3 py-3 text-xs text-faint">No open invoices match</p>
            ) : (
              payableResults.map((inv) => (
                <button
                  type="button"
                  key={inv._id}
                  onClick={() => pick(inv)}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/[0.05]"
                >
                  <span>
                    <span className="font-mono text-accent2">{inv.invoiceNumber}</span>
                    <span className="ml-2 text-white">{inv.customerName}</span>
                  </span>
                  <span className="text-xs text-faint">{fmtMoney(inv.balance)} due</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecordPayment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saving = useSelector(selectPaymentsLoading);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [amount, setAmount] = useState("");
  const [paidAt, setPaidAt] = useState(toInputDate(new Date()));
  const [method, setMethod] = useState("bank_transfer");
  const [reference, setReference] = useState("");
  const [depositAccount, setDepositAccount] = useState(DEPOSIT_ACCOUNTS[0]);
  const [notes, setNotes] = useState("");

  const onSelectInvoice = (inv) => {
    setSelectedInvoice(inv);
    setAmount(String(inv.balance));
  };

  const applyingNow = Number(amount) || 0;
  const previouslyPaid = selectedInvoice?.amountPaid || 0;
  const invoiceTotal = selectedInvoice?.total || 0;
  const remaining = Math.max(0, round2(invoiceTotal - previouslyPaid - applyingNow));

  const submit = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return toast.error("Select an invoice");
    if (!(applyingNow > 0)) return toast.error("Enter a payment amount above 0");
    if (applyingNow > selectedInvoice.balance + 0.001) {
      return toast.error(`Payment exceeds the balance due (${fmtMoney(selectedInvoice.balance)})`);
    }

    try {
      const { payment } = await dispatch(
        createPayment({
          invoiceId: selectedInvoice._id,
          amount: applyingNow,
          paidAt,
          method,
          reference,
          depositAccount,
          notes,
        })
      ).unwrap();
      toast.success(`Payment ${payment.paymentNumber} recorded`);
      navigate(`/dashboard/payments/${payment._id}`);
    } catch (msg) {
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto space-y-6">
      
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Record payment</h1>
          <p className="mt-1 text-sm text-muted">Apply a payment to an outstanding invoice</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-line bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !selectedInvoice}
            className="rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Record payment"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <section className="rounded-lg border border-line bg-panel p-6">
          <h2 className="font-semibold text-white">Payment details</h2>
          <p className="mb-5 text-sm text-muted">Enter the payment information below.</p>

          <div className="space-y-5">
            <div>
              <label className={labelCls}>Invoice</label>
              <InvoicePicker selectedInvoice={selectedInvoice} onSelect={onSelectInvoice} />
            </div>
            <div>
              <label className={labelCls}>Customer</label>
              <input value={selectedInvoice?.customerName || ""} readOnly className={`${inputCls} opacity-70`} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Payment amount</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  max={selectedInvoice?.balance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className={inputCls}
                  disabled={!selectedInvoice}
                />
              </div>
              <div>
                <label className={labelCls}>Payment date</label>
                <input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Payment method</label>
                <CustomDropdown
                  value={method}
                  onChange={setMethod}
                  options={PAYMENT_METHODS.map(([v, l]) => ({
                    value: v,
                    label: l,
                  }))}
                  className="w-full"
                />
              </div>
              <div>
                <label className={labelCls}>Reference</label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Transaction or cheque number"
                  className={inputCls}
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Deposit account</label>
              <CustomDropdown
              value={depositAccount}
              onChange={setDepositAccount}
              options={DEPOSIT_ACCOUNTS.map((account) => ({
                value: account,
                label: account,
              }))}
              className=""
            />
            </div>
            <div>
              <label className={labelCls}>Notes</label>
              <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} />
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-line bg-panel p-5">
          <h2 className="font-semibold text-white">Payment summary</h2>
          <p className="mb-4 text-sm text-muted">Review the amount being applied.</p>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between text-muted"><dt>Invoice total</dt><dd className="text-white">{fmtMoney(invoiceTotal)}</dd></div>
            <div className="flex justify-between text-muted"><dt>Previously paid</dt><dd className="text-white">{fmtMoney(previouslyPaid)}</dd></div>
            <div className="flex justify-between text-muted"><dt>Applying now</dt><dd className="text-blue-300">{fmtMoney(applyingNow)}</dd></div>
            <div className="flex justify-between border-t border-line pt-3 font-semibold text-white">
              <dt>Remaining balance</dt><dd>{fmtMoney(remaining)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </form>
  );
}