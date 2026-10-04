import { PieChart, Pie, Cell } from 'recharts'

// data = [{ name, value, color }]
export default function DonutChart({ data, centerLabel, size = 150 }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const slices = total > 0 ? data : [{ name: 'None', value: 1, color: '#26282C' }]

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <PieChart width={size} height={size}>
          <Pie
            data={slices}
            dataKey="value"
            innerRadius={size * 0.33}
            outerRadius={size * 0.5}
            paddingAngle={total > 0 ? 2 : 0}
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {slices.map((s) => (
              <Cell key={s.name} fill={s.color} />
            ))}
          </Pie>
        </PieChart>
        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-white">
            {centerLabel}
          </div>
        )}
      </div>

      <ul className="min-w-[160px] flex-1 space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.name} className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
            <span className="text-muted">{d.name}</span>
            <span className="ml-auto font-semibold text-white">
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}