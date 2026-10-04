import { Link } from 'react-router-dom'
import { FaDownload } from 'react-icons/fa'
import { PERIODS } from '../../../utils/report.js'

const btn = 'rounded-md border border-line bg-panel px-3 py-2 text-sm text-white hover:bg-white/5'

export default function ReportHeader({
  title, subtitle, range, period, onPeriod, onExport, exportLabel = 'Export report', exportDisabled, backTo,
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
        {range && <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-faint">{range}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {backTo && <Link to={backTo} className={btn}>Back to reports</Link>}
        <select
          value={period}
          onChange={(e) => onPeriod(e.target.value)}
          className="rounded-md border border-line bg-white/5 px-3 py-2 text-sm text-white focus:border-accent2 focus:outline-none"
        >
          {PERIODS.map(([value, label]) => (
            <option key={value} value={value} className="bg-panel">{label}</option>
          ))}
        </select>
        <button
          onClick={onExport}
          disabled={exportDisabled}
          className="inline-flex items-center gap-2 rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          <FaDownload className="text-xs" /> {exportLabel}
        </button>
      </div>
    </div>
  )
}