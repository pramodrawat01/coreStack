export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, classname }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${classname ? classname : 'rounded-xl'} border border-dashed border-line bg-surface/40 px-6 py-16 text-center`}>
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.06] mb-1">
          <Icon size={18} className="text-faint" />
        </span>
      )}
      <p className="text-sm font-medium text-white">{title}</p>
      {description && <p className="text-sm text-faint max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}