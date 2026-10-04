import { SkeletonBlock } from './skeleton/Skeleton.jsx'

const TONES = { good: 'text-emerald-400', warn: 'text-amber-400', bad: 'text-rose-400' }

export default function StatCard({ label, value, sub, subTone, loading }) {
  return (
    <div className="rounded-lg border border-line bg-panel p-4">
      <p className="text-sm text-muted">{label}</p>
      {loading ? (
        <SkeletonBlock className="mt-2 h-7 w-32" />
      ) : (
        <>
          <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
          {sub && <p className={`mt-1 text-xs ${TONES[subTone] || 'text-muted'}`}>{sub}</p>}
        </>
      )}
    </div>
  )
}