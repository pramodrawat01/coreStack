export default function FeatureCard({ index, title, description, visual, className = '' }) {
  return (
    <div className={`flex flex-col rounded-xl border border-line bg-surface overflow-hidden ${className}`}>
      <div className="p-6 flex flex-col gap-2.5">
        <span className="font-mono text-xs text-faint">{index}</span>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
      {visual && <div className="mt-auto border-t border-line bg-panel px-6 py-6">{visual}</div>}
    </div>
  )
}
