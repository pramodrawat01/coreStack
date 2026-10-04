import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { fetchSalesReport } from '../../../store/reportsSlice.js'
import { fmtMoney, fmtNum, fmtRange, exportCsv } from '../../../utils/report.js'
import StatCard from '../../../components/dashboard/StatCard.jsx'
import BarChart from '../../../components/dashboard/charts/BarChart.jsx'
import ReportHeader from '../../../components/dashboard/reports/ReportHeader.jsx'
import { SkeletonBlock } from '../../../components/dashboard/skeleton/Skeleton.jsx'

const th = 'px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-faint'

export default function SalesReport() {
  const dispatch = useDispatch()
  const { sales: d, loading } = useSelector((s) => s.reports)
  const [period, setPeriod] = useState('this_quarter')

  useEffect(() => {
    dispatch(fetchSalesReport(period))
  }, [dispatch, period])

  const initial =  !d
  const k = d?.kpis
  const range = fmtRange(d?.period)

  const handleExport = () =>
    exportCsv('sales-report.csv', [
      ['Customer', 'Orders', 'Net sales', 'Gross profit', 'Margin %'],
      ...d.byCustomer.map((c) => [c.customer, c.orders, c.netSales, c.grossProfit, c.marginPct]),
    ])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 transition-opacity ${loading && d ? 'opacity-60' : ''}`}
    >
      <ReportHeader
        title="Sales report"
        subtitle="Detailed sales performance by customer, product, and channel"
        range={range}
        period={period}
        onPeriod={setPeriod}
        onExport={handleExport}
        exportLabel="Export CSV"
        exportDisabled={!d}
        backTo="/dashboard/reports"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Net sales" loading={initial} value={fmtMoney(k?.netSales)} />
        <StatCard label="Gross profit" loading={initial} value={fmtMoney(k?.grossProfit)} />
        <StatCard label="Average order value" loading={initial} value={fmtMoney(k?.avgOrderValue)} />
        <StatCard label="Returning customers" loading={initial} value={`${k?.returningCustomersPct ?? 0}%`} />
      </div>

      <div className="rounded-lg border border-line bg-panel p-5">
        <h2 className="font-semibold text-white">Sales performance</h2>
        <p className="mb-4 text-sm text-muted">
          {d?.unit === 'day' ? 'Daily' : 'Monthly'} sales performance · {range}
        </p>
        {initial ? <SkeletonBlock className="h-[260px] w-full" /> : <BarChart data={d.series} unit={d.unit} />}
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-panel">
        <div className="p-5">
          <h2 className="font-semibold text-white">Sales by customer</h2>
          <p className="text-sm text-muted">Customer-level sales performance · {range}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-white/[0.03] text-left">
              <tr>
                <th className={th}>Customer</th>
                <th className={`${th} text-right`}>Orders</th>
                <th className={`${th} text-right`}>Net sales</th>
                <th className={`${th} text-right`}>Gross profit</th>
                <th className={`${th} text-right`}>Margin</th>
              </tr>
            </thead>
            <tbody>
              {initial ? (
                <tr><td colSpan={5} className="p-5"><SkeletonBlock className="h-24 w-full" /></td></tr>
              ) : d.byCustomer.length === 0 ? (
                <tr><td colSpan={5} className="py-10 text-center text-faint">No sales in this period</td></tr>
              ) : (
                d.byCustomer.map((c) => (
                  <tr key={c.customerId} className="border-t border-line">
                    <td className="px-5 py-4 font-semibold text-white">{c.customer}</td>
                    <td className="px-5 py-4 text-right text-white">{fmtNum(c.orders)}</td>
                    <td className="px-5 py-4 text-right text-white">{fmtMoney(c.netSales)}</td>
                    <td className="px-5 py-4 text-right text-white">{fmtMoney(c.grossProfit)}</td>
                    <td className="px-5 py-4 text-right text-white">{c.marginPct}%</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}