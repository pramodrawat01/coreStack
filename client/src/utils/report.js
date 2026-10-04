import { fmtMoney, fmtDate } from './invoice.js'

export { fmtMoney }

export const PERIODS = [
  ['this_month', 'This month'],
  ['last_month', 'Last month'],
  ['this_quarter', 'This quarter'],
  ['last_90', 'Last 90 days'],
  ['this_year', 'This year'],
]

export const fmtNum = (n) => new Intl.NumberFormat('en-US').format(Number(n) || 0)

export const fmtCompactMoney = (n) =>
  `$${new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(Number(n) || 0)}`

// period.to is exclusive, so show the day before it
export const fmtRange = (period) =>
  period ? `${fmtDate(period.from)} – ${fmtDate(new Date(new Date(period.to) - 1), true)}` : ''

// bucket keys are "YYYY-MM-DD" (day) or "YYYY-MM" (month)
export const fmtBucket = (key, unit) =>
  unit === 'month'
    ? new Date(`${key}-01`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    : fmtDate(key)

// spread into <StatCard {...deltaProps(pct, 'vs last period')} />
export const deltaProps = (pct, suffix) =>
  pct == null
    ? { sub: 'No prior data' }
    : { sub: `${pct > 0 ? '+' : ''}${pct}% ${suffix}`, subTone: pct > 0 ? 'good' : pct < 0 ? 'bad' : undefined }

// rows = array of arrays
export function exportCsv(filename, rows) {
  const esc = (v) => {
    const s = String(v ?? '')
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  const blob = new Blob([rows.map((r) => r.map(esc).join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}


export function timeAgo(d) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return days === 1 ? 'Yesterday' : `${days}d ago`
}