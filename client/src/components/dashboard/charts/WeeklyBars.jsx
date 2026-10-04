import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

export default function WeeklyBars({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#26282C" vertical={false} />
        <XAxis dataKey="label" tick={{ fill: '#57595E', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#57595E', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={32}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{ background: '#141517', border: '1px solid #26282C', borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: '#8B8D93' }}
        />
        <Legend verticalAlign="top" align="left" iconType="circle" wrapperStyle={{ fontSize: 12, paddingBottom: 12 }} />
        <Bar dataKey="orders" name="Orders" fill="#3B82F6" radius={[3, 3, 0, 0]} maxBarSize={22} />
        <Bar dataKey="cancelled" name="Cancelled" fill="#57595E" radius={[3, 3, 0, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  )
}