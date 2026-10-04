import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { fmtMoney, fmtBucket } from '../../../utils/report.js'

export default function RevenueChart({
    data, unit, dataKey = 'revenue', label = 'Revenue', format = fmtMoney, yFormat = format, yAxis = false, height = 220,
 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#26282C" vertical={false} />
        <XAxis
          dataKey="key"
          tickFormatter={(k) => fmtBucket(k, unit)}
          tick={{ fill: '#57595E', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          minTickGap={32}
        />
       {yAxis ? (
          <YAxis
            tickFormatter={yFormat}
            tick={{ fill: '#57595E', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
        ) : (
          <YAxis hide />
        )}
        <Tooltip
          contentStyle={{ background: '#141517', border: '1px solid #26282C', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#8B8D93' }}
          labelFormatter={(k) => fmtBucket(k, unit)}
          formatter={(v) => [format(v), label]}
        />
        <Area type="monotone" dataKey={dataKey} stroke="#3B82F6" strokeWidth={2} fill="url(#revFill)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}