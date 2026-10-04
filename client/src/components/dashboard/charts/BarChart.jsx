import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { fmtMoney, fmtCompactMoney, fmtBucket } from '../../../utils/report.js'

export default function BarChart({ data, unit }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#26282C" vertical={false} />
        <XAxis
          dataKey="key"
          tickFormatter={(k) => fmtBucket(k, unit)}
          tick={{ fill: '#57595E', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tickFormatter={fmtCompactMoney}
          tick={{ fill: '#57595E', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={56}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{ background: '#141517', border: '1px solid #26282C', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#8B8D93' }}
          labelFormatter={(k) => fmtBucket(k, unit)}
          formatter={(v) => fmtMoney(v)}
        />
        <Legend verticalAlign="top" align="left" iconType="circle" wrapperStyle={{ fontSize: 12, paddingBottom: 12 }} />
        <Bar dataKey="netSales" name="Net sales" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={44} />
        <Bar dataKey="grossProfit" name="Gross profit" fill="#10B981" radius={[3, 3, 0, 0]} maxBarSize={44} />
        <Line dataKey="netSales" legendType="none" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} tooltipType="none" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}