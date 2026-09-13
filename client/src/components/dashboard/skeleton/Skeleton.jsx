export function SkeletonBlock({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-white/[0.06] ${className}`} />
}

export function SkeletonText({ width = 'w-24', className = '' }) {
  return <SkeletonBlock className={`h-3 ${width} ${className}`} />
}

export function SkeletonCircle({ size = 'h-8 w-8' }) {
  return <SkeletonBlock className={`rounded-full ${size}`} />
}