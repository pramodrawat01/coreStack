import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiFetch } from "../../../lib/api";
import {
  createInvoice,
  updateInvoice,
  fetchInvoice,
  selectInvoicesLoading,
} from "../../../store/invoicesSlice";
import {
  TERM_DAYS,
  addDays,
  calcTotals,
  fmtMoney,
  toInputDate,
} from "../../../utils/invoice";

const inputCls =
  "w-full rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-white placeholder:text-faint focus:border-accent2 focus:outline-none [color-scheme:dark]";
const labelCls = "mb-1.5 block text-sm text-muted";

const emptyItem = () => ({ productId: "", description: "", quantity: 1, unitPrice: "" });
const emptyAddress = { line1: "", line2: "", city: "", state: "", zip: "" };

const initialForm = () => {
  const issueDate = toInputDate(new Date());
  return {
    customerId: "",
    customerName: "",
    contactName: "",
    billingEmail: "",
    billingAddress: { ...emptyAddress },
    issueDate,
    paymentTerms: "Net 30",
    dueDate: addDays(issueDate, 30),
    items: [emptyItem()],
    taxRate: "",
    shipping: "",
    notes: "Thank you for your business.",
  };
};

// Tolerates { customers: [] }, { data: [] } or a bare array
const pluck = (result, key) => {
  if (result.status !== "fulfilled") return [];
  const d = result.value
  return d?.[key] ?? d?.data ?? (Array.isArray(d) ? d : []);
};

export default function InvoiceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const saving = useSelector(selectInvoicesLoading);

  const [form, setForm] = useState(initialForm);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Customer/product suggestions are a convenience; the form works if these calls fail
  useEffect(() => {
    Promise.allSettled([
      apiFetch("/api/customers?limit=200"),
      apiFetch("/api/products?limit=200"),
    ]).then(([c, p]) => {
      setCustomers(pluck(c, "customers"));
      setProducts(pluck(p, "products"));
    });
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    dispatch(fetchInvoice(id))
      .unwrap()
      .then(({ invoice: inv }) => {
        if (inv.status !== "draft") {
          toast.error("Only draft invoices can be edited");
          return navigate(`/invoices/${id}`, { replace: true });
        }
        setForm({
          customerId: inv.customerId || "",
          customerName: inv.customerName,
          contactName: inv.contactName || "",
          billingEmail: inv.billingEmail,
          billingAddress: { ...emptyAddress, ...inv.billingAddress },
          issueDate: toInputDate(inv.issueDate),
          paymentTerms: inv.paymentTerms,
          dueDate: toInputDate(inv.dueDate),
          items: inv.items.map((i) => ({
            productId: i.productId || "",
            description: i.description,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
          taxRate: inv.taxRate || "",
          shipping: inv.shipping || "",
          notes: inv.notes || "",
        });
      })
      .catch((msg) => {
        toast.error(msg);
        navigate("/invoices", { replace: true });
      });
  }, [dispatch, id, isEdit, navigate]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onCustomerChange = (name) => {
    const match = customers.find((c) => (c.name || c.companyName || "").toLowerCase() === name.toLowerCase());
    if (!match) return set({ customerName: name, customerId: "" });
    set({
      customerName: name,
      customerId: match._id,
      contactName: match.contactName || form.contactName,
      billingEmail: match.email || form.billingEmail,
      billingAddress:
        match.address && typeof match.address === "object"
          ? { ...emptyAddress, ...match.address }
          : form.billingAddress,
    });
  };

  const onTermsChange = (paymentTerms) =>
    set({ paymentTerms, dueDate: addDays(form.issueDate, TERM_DAYS[paymentTerms]) });

  const onIssueDateChange = (issueDate) =>
    set({ issueDate, dueDate: addDays(issueDate, TERM_DAYS[form.paymentTerms]) });

  const setItem = (index, patch) =>
    set({ items: form.items.map((it, i) => (i === index ? { ...it, ...patch } : it)) });

  const onItemDescription = (index, description) => {
    const match = products.find((p) => p.name?.toLowerCase() === description.toLowerCase());
    const patch = { description, productId: match?._id || "" };
    const price = match?.sellingPrice ?? match?.price;
    if (match && price != null && !form.items[index].unitPrice) patch.unitPrice = price;
    setItem(index, patch);
  };

  const removeItem = (index) =>
    set({ items: form.items.length > 1 ? form.items.filter((_, i) => i !== index) : form.items });

  const totals = calcTotals(form.items, form.taxRate, form.shipping);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim()) return toast.error("Enter a customer");
    if (!form.billingEmail.trim()) return toast.error("Enter a billing email");
    const validItems = form.items.filter((i) => i.description.trim());
    if (!validItems.length) return toast.error("Add at least one line item");
    if (validItems.some((i) => !(Number(i.quantity) > 0) || i.unitPrice === "" || Number(i.unitPrice) < 0)) {
      return toast.error("Each line item needs a quantity above 0 and a unit price");
    }

    const body = {
      ...form,
      customerId: form.customerId || undefined,
      items: validItems.map((i) => ({
        productId: i.productId || undefined,
        description: i.description,
        quantity: Number(i.quantity),
        unitPrice: Number(i.unitPrice),
      })),
      taxRate: Number(form.taxRate) || 0,
      shipping: Number(form.shipping) || 0,
    };

    try {
      const { invoice } = isEdit
        ? await dispatch(updateInvoice({ id, body })).unwrap()
        : await dispatch(createInvoice(body)).unwrap();
      toast.success(isEdit ? "Invoice updated" : `Invoice ${invoice.invoiceNumber} created`);
      navigate(`/dashboard/invoices/${invoice._id}`);
    } catch (msg) {
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {isEdit ? "Edit invoice" : "Create invoice"}
          </h1>
          <p className="mt-1 text-sm text-muted">Generate an invoice for a customer order</p>
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
            disabled={saving}
            className="rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create invoice"}
          </button>
        </div>
      </div>

      <section className="rounded-lg border border-line bg-panel p-6">
        <h2 className="mb-5 font-semibold text-white">Invoice details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Customer</label>
            <input
              list="customer-options"
              value={form.customerName}
              onChange={(e) => onCustomerChange(e.target.value)}
              placeholder="Customer name"
              className={inputCls}
            />
            <datalist id="customer-options">
              {customers.map((c) => (
                <option key={c._id} value={c.name || c.companyName} />
              ))}
            </datalist>
          </div>
          <div>
            <label className={labelCls}>Billing email</label>
            <input
              type="email"
              value={form.billingEmail}
              onChange={(e) => set({ billingEmail: e.target.value })}
              placeholder="billing@customer.com"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Contact name</label>
            <input
              value={form.contactName}
              onChange={(e) => set({ contactName: e.target.value })}
              className={inputCls}
            />
          </div>
          <div />
          <div>
            <label className={labelCls}>Issue date</label>
            <input type="date" value={form.issueDate} onChange={(e) => onIssueDateChange(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Due date</label>
            <input type="date" value={form.dueDate} onChange={(e) => set({ dueDate: e.target.value })} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Payment terms</label>
            <select value={form.paymentTerms} onChange={(e) => onTermsChange(e.target.value)} className={inputCls}>
              {Object.keys(TERM_DAYS).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <p className="mb-3 text-sm text-muted">Billing address</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Street address" value={form.billingAddress.line1}
              onChange={(e) => set({ billingAddress: { ...form.billingAddress, line1: e.target.value } })} className={inputCls} />
            <input placeholder="Suite, unit (optional)" value={form.billingAddress.line2}
              onChange={(e) => set({ billingAddress: { ...form.billingAddress, line2: e.target.value } })} className={inputCls} />
            <input placeholder="City" value={form.billingAddress.city}
              onChange={(e) => set({ billingAddress: { ...form.billingAddress, city: e.target.value } })} className={inputCls} />
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="State" value={form.billingAddress.state}
                onChange={(e) => set({ billingAddress: { ...form.billingAddress, state: e.target.value } })} className={inputCls} />
              <input placeholder="ZIP" value={form.billingAddress.zip}
                onChange={(e) => set({ billingAddress: { ...form.billingAddress, zip: e.target.value } })} className={inputCls} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-panel p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-white">Items</h2>
          <button
            type="button"
            onClick={() => set({ items: [...form.items, emptyItem()] })}
            className="inline-flex items-center gap-2 rounded-md border border-line bg-ink px-3 py-1.5 text-sm text-white hover:bg-white/10"
          >
            <FaPlus className="text-xs" /> Add line item
          </button>
        </div>

        <datalist id="product-options">
          {products.map((p) => (
            <option key={p._id} value={p.name} />
          ))}
        </datalist>

        <div className="hidden grid-cols-[1fr_90px_130px_110px_32px] gap-3 px-1 pb-2 text-xs uppercase tracking-wide text-muted sm:grid">
          <span>Item</span><span>Quantity</span><span>Unit price</span><span className="text-right">Total</span><span />
        </div>
        <div className="space-y-3">
          {form.items.map((it, i) => (
            <div key={i} className="grid items-center gap-3 sm:grid-cols-[1fr_90px_130px_110px_32px]">
              <input
                list="product-options"
                value={it.description}
                onChange={(e) => onItemDescription(i, e.target.value)}
                placeholder="Item or description"
                className={inputCls}
              />
              <input type="number" min="0" step="any" value={it.quantity}
                onChange={(e) => setItem(i, { quantity: e.target.value })} className={inputCls} />
              <input type="number" min="0" step="0.01" value={it.unitPrice} placeholder="0.00"
                onChange={(e) => setItem(i, { unitPrice: e.target.value })} className={inputCls} />
              <span className="text-right text-sm font-medium text-white">
                {fmtMoney((Number(it.quantity) || 0) * (Number(it.unitPrice) || 0))}
              </span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                disabled={form.items.length === 1}
                aria-label="Remove line item"
                className="text-faint hover:text-white disabled:opacity-30"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end border-t border-line pt-5">
          <dl className="w-full max-w-xs space-y-3 text-sm">
            <div className="flex justify-between text-muted">
              <dt>Subtotal</dt><dd className="text-white">{fmtMoney(totals.subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-muted">
              <dt>Tax rate (%)</dt>
              <dd>
                <input type="number" min="0" max="100" step="0.01" value={form.taxRate} placeholder="0"
                  onChange={(e) => set({ taxRate: e.target.value })} className={`${inputCls} w-24 text-right`} />
              </dd>
            </div>
            <div className="flex justify-between text-muted">
              <dt>Tax</dt><dd className="text-white">{fmtMoney(totals.tax)}</dd>
            </div>
            <div className="flex items-center justify-between text-muted">
              <dt>Shipping</dt>
              <dd>
                <input type="number" min="0" step="0.01" value={form.shipping} placeholder="0.00"
                  onChange={(e) => set({ shipping: e.target.value })} className={`${inputCls} w-24 text-right`} />
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-semibold text-white">
              <dt>Total</dt><dd>{fmtMoney(totals.total)}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="rounded-lg border border-line bg-panel p-6">
        <label className={labelCls}>Notes</label>
        <textarea rows={3} value={form.notes} onChange={(e) => set({ notes: e.target.value })} className={inputCls} />
      </section>
    </form>
  );
}