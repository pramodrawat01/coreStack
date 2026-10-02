const STYLES = {
  draft: "bg-white/10 text-muted",
  sent: "bg-blue-500/15 text-blue-300",
  partially_paid: "bg-yellow-500/15 text-yellow-300",
  overdue: "bg-orange-500/15 text-orange-300",
  paid: "bg-emerald-500/15 text-emerald-300",
  void: "bg-white/5 text-faint line-through",
};

const LABELS = {
  draft: "Draft",
  sent: "Sent",
  partially_paid: "Partially paid",
  overdue: "Overdue",
  paid: "Paid",
  void: "Void",
};

export default function InvoiceStatusBadge({ status }) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STYLES[status] || STYLES.draft
      }`}
    >
      {LABELS[status] || status}
    </span>
  );
}