const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12']
const REVENUE = [42, 48, 45, 58, 54, 66, 62, 74, 70, 84, 80, 96]
const ORDERS = [30, 34, 33, 40, 42, 46, 50, 52, 58, 60, 64, 70]

const WIDTH = 420
const HEIGHT = 150
const PAD_L = 8
const PAD_R = 8
const PAD_T = 16
const PAD_B = 20

function toPoints(values) {
  const max = 100
  const innerW = WIDTH - PAD_L - PAD_R
  const innerH = HEIGHT - PAD_T - PAD_B
  return values.map((v, i) => {
    const x = PAD_L + (i / (values.length - 1)) * innerW
    const y = PAD_T + innerH - (v / max) * innerH
    return [x, y]
  })
}

function toPath(points) {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
}

function toAreaPath(points) {
  const baseY = HEIGHT - PAD_B
  const line = toPath(points)
  const last = points[points.length - 1]
  const first = points[0]
  return `${line} L${last[0].toFixed(1)},${baseY} L${first[0].toFixed(1)},${baseY} Z`
}

const GRID_ROWS = [0, 0.25, 0.5, 0.75, 1]

export default function SalesChart({ className = '' }) {
  const revPoints = toPoints(REVENUE)
  const orderPoints = toPoints(ORDERS)
  const peakIndex = REVENUE.indexOf(Math.max(...REVENUE))
  const peakPoint = revPoints[peakIndex]

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-4 mb-2">
        <span className="flex items-center gap-1.5 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Revenue
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-accent2" />
          Orders
        </span>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto" preserveAspectRatio="none">
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5A2D" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FF5A2D" stopOpacity="0" />
            </linearGradient>
          </defs>

          {GRID_ROWS.map((r) => {
            const y = PAD_T + r * (HEIGHT - PAD_T - PAD_B)
            return (
              <line
                key={r}
                x1={PAD_L}
                x2={WIDTH - PAD_R}
                y1={y}
                y2={y}
                stroke="#1F2124"
                strokeWidth="1"
              />
            )
          })}

          <path d={toAreaPath(revPoints)} fill="url(#revenueFill)" stroke="none" />

          <path
            d={toPath(orderPoints)}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="1.5"
            strokeDasharray="3 3"
            opacity="0.7"
          />

          <path d={toPath(revPoints)} fill="none" stroke="#FF5A2D" strokeWidth="2" />

          {revPoints.map(([x, y], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i === peakIndex ? 3 : 0}
              fill="#FF5A2D"
              stroke="#0E0F11"
              strokeWidth="1.5"
            />
          ))}
        </svg>

        <div
          className="absolute -translate-x-1/2 -translate-y-full rounded-md border border-line bg-panel px-2.5 py-1.5 shadow-lg hidden sm:block"
          style={{
            left: `${(peakPoint[0] / WIDTH) * 100}%`,
            top: `${(peakPoint[1] / HEIGHT) * 100 - 4}%`,
          }}
        >
          <p className="text-[9px] text-faint whitespace-nowrap">Peak week</p>
          <p className="text-[11px] font-semibold text-white whitespace-nowrap">$96,400</p>
        </div>
      </div>

      <div className="flex justify-between mt-1.5">
        {WEEKS.filter((_, i) => i % 2 === 0).map((w) => (
          <span key={w} className="text-[9px] font-mono text-faint">
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}