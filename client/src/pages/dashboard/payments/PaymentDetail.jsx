import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaBan,
  FaCheck,
  FaDownload,
  FaFileImport,
  FaPaperPlane,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import {
  clearCurrentPayment,
  fetchPayment,
  refundPayment,
  selectPaymentsLoading,
} from "../../../store/paymentsSlice";
import { fmtDateTime, fmtMoney, methodLabel } from "../../../utils/payment";
import PaymentStatusBadge from "../../../components/dashboard/payments/PaymentStatusBadge";
import { usePermission } from "../../../hooks/usePermission";

const ACTIVITY_ICON = {
  initiated: FaFileImport,
  authorized: FaCheck,
  captured: FaCheck,
  failed: FaTimesCircle,
  refunded: FaBan,
};

export default function PaymentDetail() {

  const [acknowledged, setAcknowledged] = useState(false);  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payment = useSelector((s) => s.payments.current);
  const saving = useSelector(selectPaymentsLoading);
  const canWrite = usePermission("payments", "write");

  useEffect(() => {
    dispatch(fetchPayment(id))
      .unwrap()
      .catch((msg) => {
        toast.error(msg);
        navigate("/dashboard/payments", { replace: true });
      });
    return () => dispatch(clearCurrentPayment());
  }, [dispatch, id, navigate]);

  if (!payment || payment._id !== id) {
    return <p className="py-20 text-center text-muted">Loading payment…</p>;
  }

  const onRefund = async () => {
    if (
      !window.confirm(
        `Refund ${payment.paymentNumber} for ${fmtMoney(payment.amount)}?`,
      )
    )
      return;
    try {
      await dispatch(refundPayment(id)).unwrap();
      toast.success("Payment refunded");
    } catch (msg) {
      toast.error(msg);
    }
  };

  return (
    <div className="mx-auto  space-y-6">

      {/*** top header */}
      <div className="flex justify-between items-center">
        <button
          onClick={()=> navigate( `/dashboard/payments`)}
          className="flex items-center gap-2 text-sm text-faint hover:text-white transition-colors mb-3">
          <FaArrowLeft size={11} /> Payments /
        </button>

      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {payment.paymentNumber}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Payment received {fmtDateTime(payment.paidAt)}
          </p>
        </div>
        <div className="flex gap-2">
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <FaDownload className="text-xs" /> Download receipt
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-panel p-6 ">
        <p className="mb-2 text-sm text-muted">Payment status</p>
        <div className="flex items-end justify-between">
          <PaymentStatusBadge status={payment.status} />
          <p className="text-3xl font-semibold text-white">
            {fmtMoney(payment.amount)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="rounded-lg border border-line bg-panel p-5">
          <h2 className="mb-4 font-semibold text-white">Payment details</h2>
          <dl className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <dt className="text-muted">Payment method</dt>
              <dd className="mt-1 text-white">
                {payment.methodDetail || methodLabel(payment.method)}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Transaction ID</dt>
              <dd className="mt-1 text-white">
                {payment.transactionId || "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Processor</dt>
              <dd className="mt-1 text-white">{payment.processor || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted">Settlement date</dt>
              <dd className="mt-1 text-white">
                {payment.settlementDate
                  ? fmtDateTime(payment.settlementDate)
                  : "—"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-line bg-panel p-5">
          <h2 className="mb-4 font-semibold text-white">Customer</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-muted">Company</dt>
              <dd className="mt-1 text-white">{payment.customerName}</dd>
            </div>
            {payment.contactName && (
              <div>
                <dt className="text-muted">Contact</dt>
                <dd className="mt-1 text-white">{payment.contactName}</dd>
              </div>
            )}
            {payment.contactEmail && (
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 text-accent2">{payment.contactEmail}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      <section className="rounded-lg border border-line bg-panel p-5">
        <h2 className="mb-4 font-semibold text-white">Applied to invoice</h2>
        <dl className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-muted">Invoice</dt>
            <dd className="mt-1">
              <Link
                to={`/invoices/${payment.invoiceId}`}
                className="text-accent2"
              >
                {payment.invoiceNumber}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="text-muted">Invoice total</dt>
            <dd className="mt-1 text-white">
              {fmtMoney(payment.invoiceTotal)}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Remaining balance</dt>
            <dd className="mt-1 text-white">
              {fmtMoney(payment.balanceAfter)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-line bg-panel p-5">
        <h2 className="mb-4 font-semibold text-white">Activity</h2>
        <ul className="space-y-4">
          {(payment.activity || []).map((a, i) => {
            const Icon = ACTIVITY_ICON[a.type] || FaCheck;
            return (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs text-accent2">
                  <Icon />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{a.message}</p>
                  <p className="text-xs text-muted">{fmtDateTime(a.at)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      {/* <!-- Refund Warning & Guidelines Section --> */}
      <div class="bg-[#1a1a1e] border border-gray-800 rounded-lg p-6 mb-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10">
            <svg
              class="w-5 h-5 text-amber-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h3 class="text-white text-base font-semibold m-0">
            Important: Refund Action Requires Review
          </h3>
        </div>

        <p class="text-gray-400 text-sm mb-6 leading-relaxed">
          Issuing a refund is a{" "}
          <span class="text-red-400 font-medium">
            non-reversible financial transaction
          </span>
          . Please review the following enterprise guidelines before proceeding.
          This action will be logged and may require managerial approval.
        </p>

        <div class="space-y-4 mb-6">
          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
              1
            </span>
            <div class="flex-1">
              <p class="text-gray-300 text-sm mb-1">
                <span class="font-semibold text-white">
                  Verify Refund Reason
                </span>
              </p>
              <p class="text-gray-400 text-sm">
                Confirm the refund reason is documented (defective product,
                duplicate charge, customer dispute, or cancellation).
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
              2
            </span>
            <div class="flex-1">
              <p class="text-gray-300 text-sm mb-1">
                <span class="font-semibold text-white">
                  Check Eligibility Window
                </span>
              </p>
              <p class="text-gray-400 text-sm">
                Verify the transaction falls within the allowable refund period
                (typically 30–90 days from settlement).
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
              3
            </span>
            <div class="flex-1">
              <p class="text-gray-300 text-sm mb-1">
                <span class="font-semibold text-white">
                  Confirm Refund Amount
                </span>
              </p>
              <p class="text-gray-400 text-sm">
                Decide between a{" "}
                <span class="text-white font-medium">
                  full refund ($4,606.40)
                </span>{" "}
                or a <span class="text-white font-medium">partial refund</span>{" "}
                with justification.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
              4
            </span>
            <div class="flex-1">
              <p class="text-gray-300 text-sm mb-1">
                <span class="font-semibold text-white">
                  Customer Communication
                </span>
              </p>
              <p class="text-gray-400 text-sm">
                Ensure the customer (
                <span class="text-white font-medium">
                  herry — Nexes Tor pvt.ltd
                </span>
                ) has been notified and acknowledged the refund.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
              5
            </span>
            <div class="flex-1">
              <p class="text-gray-300 text-sm mb-1">
                <span class="font-semibold text-white">Invoice Impact</span>
              </p>
              <p class="text-gray-400 text-sm">
                This refund affects invoice{" "}
                <span class="text-blue-400 font-medium">INV-2026-0002</span>.
                Remaining balance is{" "}
                <span class="text-white font-medium">$0.00</span>. A credit
                balance will be created.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
              6
            </span>
            <div class="flex-1">
              <p class="text-gray-300 text-sm mb-1">
                <span class="font-semibold text-white">Tax & Compliance</span>
              </p>
              <p class="text-gray-400 text-sm">
                Refunds may impact GST/VAT filings. Generate a credit note if
                required by local regulations.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-red-500/10 text-red-400 text-xs font-bold">
              7
            </span>
            <div class="flex-1">
              <p class="text-gray-300 text-sm mb-1">
                <span class="font-semibold text-white">Approval Threshold</span>
              </p>
              <p class="text-gray-400 text-sm">
                Refunds over <span class="text-white font-medium">$1,000</span>{" "}
                require manager approval. This refund of{" "}
                <span class="text-red-400 font-medium">$4,606.40</span> exceeds
                the limit.
              </p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <span class="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold">
              8
            </span>
            <div class="flex-1">
              <p class="text-gray-300 text-sm mb-1">
                <span class="font-semibold text-white">Audit Trail</span>
              </p>
              <p class="text-gray-400 text-sm">
                All refund actions are permanently logged. Include a clear
                reason code for compliance.
              </p>
            </div>
          </div>
        </div>

       <div class="border-t border-gray-800 pt-4 mt-6">
          <label class="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              id="refundAcknowledge" 
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked) }
              class="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
            />
            <span class="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
              I confirm I have reviewed all guidelines, verified the refund reason, obtained necessary approvals, and understand this action is <span class="text-red-400 font-medium">irreversible</span>.
            </span>
          </label>
        </div>
      </div>

      <div class="flex items-center justify-center gap-8 border border-white/10 rounded-md py-4 mt-4">
  
        <p class="text-gray-500 text-sm">
          Acknowledge the guidelines above to enable the refund action.
        </p>

        {canWrite && payment.status === "succeeded" && (
          <button
            onClick={onRefund}
            disabled={saving || !acknowledged}
            className={`rounded-md border border-line bg-white/5 px-4 py-2 text-sm text-white ${acknowledged && `hover:bg-white/10` }  disabled:opacity-50`}
          >
            Proceed payment refund
          </button>
        )}
      </div>


    </div>
  );
}
