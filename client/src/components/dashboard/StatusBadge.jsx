const STYLES = {
  Active: 'text-emerald-400 bg-emerald-400/10',
  'Low Stock': 'text-amber-400 bg-amber-400/10',
  'Out of Stock': 'text-red-400 bg-red-400/10',
  Inactive: 'text-faint bg-white/[0.06]',
  Shipped: 'text-emerald-400 bg-emerald-400/10',
  Delivered: 'text-emerald-400 bg-emerald-400/10',
  Confirmed: 'text-accent2 bg-accent2/10',
  Processing: 'text-purple-400 bg-purple-400/10',
  Pending: 'text-amber-400 bg-amber-400/10',
  'Pending invite': 'text-amber-400 bg-amber-400/10',
  Suspended: 'text-red-400 bg-red-400/10',
  Overdue: 'text-red-400 bg-red-400/10',
}

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'text-faint bg-white/[0.06]'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs ${style}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}