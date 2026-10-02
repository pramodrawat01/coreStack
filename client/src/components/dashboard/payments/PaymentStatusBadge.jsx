const STYLES = {
  succeeded: "bg-emerald-500/15 text-emerald-300",
  pending: "bg-yellow-500/15 text-yellow-300",
  failed: "bg-red-500/15 text-red-300",
  refunded: "bg-white/10 text-muted",
};

const LABELS = {
  succeeded: "Succeeded",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
};

export default function PaymentStatusBadge({ status }) {
  return (
    <span
    
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STYLES[status] || STYLES.pending
      }`}
    >
      {LABELS[status] || status}
    </span>
  );
}