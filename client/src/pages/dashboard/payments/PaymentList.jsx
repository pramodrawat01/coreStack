import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  fetchPayments,
  fetchPaymentStats,
  selectPaymentsLoading,
} from "../../../store/paymentsSlice";
import { fmtMoney, fmtDate, PAYMENT_METHODS, methodLabel } from "../../../utils/payment";
import PaymentStatusBadge from "../../../components/dashboard/payments/PaymentStatusBadge";
import { usePermission } from "../../../hooks/usePermission";
import CustomDropdown from "../../../components/common/CustomDropdown";

const STATUSES = [
  ["", "All statuses"],
  ["succeeded", "Succeeded"],
  ["pending", "Pending"],
  ["failed", "Failed"],
  ["refunded", "Refunded"],
];
const METHODS = [["", "All methods"], ...PAYMENT_METHODS];

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

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </div>
  );
}

export default function PaymentList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { payments, pagination, stats, error } = useSelector((s) => s.payments);
  const loading = useSelector(selectPaymentsLoading);
  const canWrite = usePermission("payments", "write");

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [method, setMethod] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchPaymentStats());
  }, [dispatch]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    dispatch(fetchPayments({ search: debounced, method, status, page, limit: 10 }));
  }, [dispatch, debounced, method, status, page]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const { total, pages, limit } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Payments</h1>
          <p className="mt-1 text-sm text-muted">Track incoming payments, refunds, and settlement activity</p>
        </div>
        {canWrite && (
          <Link
            to="new"
            className="inline-flex items-center gap-2 rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <FaPlus className="text-xs" /> Record payment
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collected this month"
          value={fmtMoney(stats?.collectedThisMonth.amount)}
          sub={`${stats?.collectedThisMonth.count ?? 0} payments`}
        />
        <StatCard
          label="Pending"
          value={fmtMoney(stats?.pending.amount)}
          sub={`${stats?.pending.count ?? 0} payments`}
        />
        <StatCard
          label="Failed"
          value={fmtMoney(stats?.failed.amount)}
          sub={`${stats?.failed.count ?? 0} payments`}
        />
        <StatCard
          label="Refunds this month"
          value={fmtMoney(stats?.refundsThisMonth.amount)}
          sub={`${stats?.refundsThisMonth.count ?? 0} payments`}
        />
      </div>

      <div className="rounded-lg border border-line bg-panel">
        <div className="flex flex-wrap gap-3 border-b border-line p-4">
          <div className="relative min-w-[220px] flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-faint" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payments"
              className="w-full rounded-md border border-line bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-faint focus:border-accent2 focus:outline-none"
            />
          </div>
          
          <CustomDropdown
            value={method}
            onChange={(value) => {
              setMethod(value);
              setPage(1);
            }}
            options={METHODS.map(([v, l]) => ({
              value: v,
              label: l,
            }))}
            className="w-44"
          />

          <CustomDropdown
            value={status}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            options={STATUSES.map(([v, l]) => ({
              value: v,
              label: l,
            }))}
            className="w-44"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Invoice</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Method</th>
                <th className="px-4 py-3 text-right font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr
                  key={p._id}
                  onClick={() => navigate(`/dashboard/payments/${p._id}`)}
                  className="cursor-pointer border-b border-line/60 last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-4 font-mono text-accent2">{p.paymentNumber}</td>
                  <td className="px-4 py-4 font-mono text-accent2">{p.invoiceNumber}</td>
                  <td className="px-4 py-4 font-medium text-white">{p.customerName}</td>
                  <td className="px-4 py-4 text-muted">{fmtDate(p.paidAt)}</td>
                  <td className="px-4 py-4 text-muted">{p.methodDetail || methodLabel(p.method)}</td>
                  <td className="px-4 py-4 text-right font-medium text-white">{fmtMoney(p.amount)}</td>
                  <td className="px-4 py-4"><PaymentStatusBadge status={p.status} /></td>
                </tr>
              ))}
              {!payments.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-muted">
                    {loading
                      ? "Loading payments…"
                      : search || method || status
                      ? "No payments match these filters."
                      : "No payments recorded yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line p-4 text-sm text-muted">
          <span>Showing {from}–{to} of {total} payments</span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 hover:text-white disabled:opacity-40">
              Previous
            </button>
            {pageList(page, pages).map((p, i) =>
              p === "…" ? (
                <span key={`gap-${i}`} className="px-2">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`h-8 w-8 rounded-md ${p === page ? "bg-accent2 text-white" : "hover:bg-white/5 hover:text-white"}`}
                >
                  {p}
                </button>
              )
            )}
            <button disabled={page >= pages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 hover:text-white disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}