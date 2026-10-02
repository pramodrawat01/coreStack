import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchInvoices,
  fetchInvoiceStats,
  selectInvoicesLoading,
} from "../../../store/invoicesSlice";
import { fmtMoney, fmtDate } from "../../../utils/invoice";
import InvoiceStatusBadge from "../../../components/dashboard/invoices/InvoiceStatusBadge";
import { usePermission } from "../../../hooks/usePermission"; // adjust to your hook's path/signature

const STATUSES = [
  ["", "All statuses"],
  ["draft", "Draft"],
  ["sent", "Sent"],
  ["partially_paid", "Partially paid"],
  ["overdue", "Overdue"],
  ["paid", "Paid"],
  ["void", "Void"],
];
const PERIODS = [
  ["this_month", "This month"],
  ["last_month", "Last month"],
  ["last_90", "Last 90 days"],
  ["this_year", "This year"],
  ["all", "All time"],
];

const selectCls =
  "rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-white focus:border-accent2 focus:outline-none";

const pageList = (page, pages) => {
  if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
  const nums = [...new Set([1, pages, page - 1, page, page + 1])]
    .filter((p) => p >= 1 && p <= pages)
    .sort((a, b) => a - b);
  const out = [];
  nums.forEach((p, i) => {
    if (i && p - nums[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
};

function StatCard({ label, value, sub, subTone }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {sub && (
        <p className={`mt-1 text-xs ${subTone === "good" ? "text-emerald-400" : "text-muted"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

export default function InvoiceList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoices, pagination, stats, error } = useSelector((s) => s.invoices);
  const loading = useSelector(selectInvoicesLoading);
  const canWrite = usePermission("invoices", "write");

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("this_month");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchInvoiceStats());
  }, [dispatch]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    dispatch(fetchInvoices({ search: debounced, status, period, page, limit: 10 }));
  }, [dispatch, debounced, status, period, page]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const { total, pages, limit } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const pct = stats?.paidThisMonth?.changePct;
  const delta = stats?.avgPaymentDays?.delta;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Invoices</h1>
          <p className="mt-1 text-sm text-muted">Manage billing, due dates, and collections</p>
        </div>
        {canWrite && (
          <Link
            to="new"
            className="inline-flex items-center gap-2 rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <FaPlus className="text-xs" /> Create invoice
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Outstanding"
          value={fmtMoney(stats?.outstanding.amount)}
          sub={`${stats?.outstanding.count ?? 0} invoices`}
        />
        <StatCard
          label="Overdue"
          value={fmtMoney(stats?.overdue.amount)}
          sub={`${stats?.overdue.count ?? 0} invoices`}
        />
        <StatCard
          label="Paid this month"
          value={fmtMoney(stats?.paidThisMonth.amount)}
          sub={pct == null ? "No data for last month" : `${pct > 0 ? "+" : ""}${pct}% vs last month`}
          subTone={pct > 0 ? "good" : undefined}
        />
        <StatCard
          label="Average payment time"
          value={stats?.avgPaymentDays.value != null ? `${stats.avgPaymentDays.value} days` : "—"}
          sub={delta == null ? null : `${delta > 0 ? "+" : ""}${delta} days vs last month`}
          subTone={delta < 0 ? "good" : undefined}
        />
      </div>

      <div className="rounded-lg border border-line bg-panel">
        <div className="flex flex-wrap gap-3 border-b border-line p-4">
          <div className="relative min-w-[220px] flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoice number or customer"
              className="w-full rounded-md border border-line bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-faint focus:border-accent2 focus:outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className={selectCls}
          >
            {STATUSES.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
          <select
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setPage(1);
            }}
            className={selectCls}
          >
            {PERIODS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Issue date</th>
                <th className="px-4 py-3 font-medium">Due date</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv._id}
                  onClick={() => navigate(`/dashboard/invoices/${inv._id}`)}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-4 font-mono text-accent2">{inv.invoiceNumber}</td>
                  <td className="px-4 py-4 font-medium text-white">{inv.customerName}</td>
                  <td className="px-4 py-4 text-muted">{fmtDate(inv.issueDate)}</td>
                  <td className="px-4 py-4 text-muted">{fmtDate(inv.dueDate)}</td>
                  <td className="px-4 py-4 text-right font-medium text-white">{fmtMoney(inv.total)}</td>
                  <td className="px-4 py-4 text-right font-medium text-white">{fmtMoney(inv.balance)}</td>
                  <td className="px-4 py-4"><InvoiceStatusBadge status={inv.displayStatus} /></td>
                </tr>
              ))}
              {!invoices.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-muted">
                    {loading
                      ? "Loading invoices…"
                      : search || status || period !== "all"
                      ? "No invoices match these filters. Try a wider period or clear the search."
                      : "No invoices yet. Create your first invoice to start billing."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4 text-sm text-muted">
          <span>
            Showing {from}–{to} of {total} invoices
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 hover:text-white disabled:opacity-40"
            >
              Previous
            </button>
            {pageList(page, pages).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-2">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-md ${
                    p === page ? "bg-accent2 text-white" : "hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              disabled={page >= pages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 hover:text-white disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}