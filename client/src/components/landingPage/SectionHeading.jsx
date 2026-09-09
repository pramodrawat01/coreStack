export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  size = 'md',
  className = '',
}) {
  const alignment = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left'
  const titleSize =
    size === 'lg'
      ? 'text-4xl sm:text-5xl lg:text-6xl'
      : size === 'sm'
      ? 'text-2xl sm:text-3xl'
      : 'text-3xl sm:text-4xl lg:text-5xl'

  return (
    <div className={`flex flex-col gap-4 max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <span className="font-mono text-xs tracking-wider text-faint uppercase">{eyebrow}</span>
      )}
      <h2 className={`${titleSize} font-semibold tracking-tight leading-[1.08] text-balance`}>
        {title}
      </h2>
      {description && <p className="text-muted text-base sm:text-lg leading-relaxed">{description}</p>}
    </div>
  )
}
