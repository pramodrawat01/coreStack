import { FaCubes } from 'react-icons/fa'

export default function BrandingPanel() {
  return (
    <div className="flex flex-col items-center lg:items-start gap-6 max-w-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink">
          <FaCubes size={13} />
        </span>
        <span className="font-semibold tracking-tight text-[15px] text-white">Corestack</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight text-center lg:text-left">
        <span className="text-white">Run your </span>
        <span className="text-accent2">entire business</span>
        <span className="text-white"> from one place.</span>
      </h1>

      <div className="rounded-xl border border-line bg-surface px-5 py-4 w-52">
        <p className="text-[11px] text-faint">Revenue (30d)</p>
        <p className="text-lg font-semibold text-white mt-1">$182,940</p>
        <p className="text-xs text-emerald-400 mt-0.5">+12.4%</p>
      </div>
    </div>
  )
}