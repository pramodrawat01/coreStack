export default function Button({ children, variant = 'primary', className = '', as = 'button', href, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium px-4 py-2.5 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent'

  const variants = {
    primary: 'bg-white text-ink hover:bg-white/90',
    secondary: 'bg-transparent text-white border border-line hover:border-white/40',
    ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (as === 'a' || href) {
    return (
      <a href={href || '#'} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
