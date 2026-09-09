export default function EmptyState({ title, description }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
      <p className="text-sm font-medium text-white">{title}</p>
      {description && <p className="text-sm text-faint mt-1">{description}</p>}
    </div>
  )
}