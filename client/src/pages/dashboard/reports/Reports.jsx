import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowRight } from 'react-icons/fa'
import { fetchReportsSummary } from '../../../store/reportsSlice.js'
import { fmtMoney, fmtNum, fmtRange, deltaProps, exportCsv } from '../../../utils/report.js'
import StatCard from '../../../components/dashboard/StatCard.jsx'
import RevenueChart from '../../../components/dashboard/charts/RevenueChart.jsx'
import DonutChart from '../../../components/dashboard/charts/DonutChart.jsx'
import ReportHeader from '../../../components/dashboard/reports/ReportHeader.jsx'
import { SkeletonBlock } from '../../../components/dashboard/skeleton/Skeleton.jsx'

const STATUS_COLORS = { Delivered: '#3B82F6', Processing: '#10B981', Shipped: '#F59E0B', Cancelled: '#F43F5E' }

// `to: null` = report not built yet
const QUICK_REPORTS = [
  { label: 'Sales report', to: '/dashboard/reports/sales' },
  { label: 'Inventory valuation', to: '/dashboard/reports/inventory' },
  { label: 'Accounts receivable', to: null },
  { label: 'Supplier spend', to: null },
]

const rowCls = 'flex items-center justify-between rounded-md bg-white/[0.05] px-3 py-2.5 text-sm font-medium text-white'

export default function Reports() {
  const dispatch = useDispatch()
  const { summary: d, loading } = useSelector((s) => s.reports)
  console.log('ddd', d)
  const [period, setPeriod] = useState('this_month')

  useEffect(() => {
    dispatch(fetchReportsSummary(period))
  }, [dispatch, period])

  const initial = !d
  const k = d?.kpis

  const handleExport = () =>
    exportCsv('reports-summary.csv', [
      ['Period', fmtRange(d.period)],
      ['Revenue', k.revenue.value],
      ['Gross profit', k.grossProfit.value],
      ['Margin %', k.grossProfit.marginPct],
      ['Orders', k.orders.value],
      ['Cash collected', k.cashCollected.value],
      [],
      ['Top customers', 'Total revenue'],
      ...d.topCustomers.map((c) => [c.customer, c.netSales]),
    ])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 transition-opacity ${loading && d ? 'opacity-60' : ''}`}
    >
      <ReportHeader
        title="Reports"
        subtitle="Business performance across sales, purchasing, and cash flow"
        range={fmtRange(d?.period)}
        period={period}
        onPeriod={setPeriod}
        onExport={handleExport}
        exportDisabled={!d}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          loading={initial}
          value={fmtMoney(k?.revenue.value)}
          {...deltaProps(k?.revenue.changePct, 'vs last period')}
        />
        <StatCard
          label="Gross profit"
          loading={initial}
          value={fmtMoney(k?.grossProfit.value)}
          sub={`${k?.grossProfit.marginPct ?? 0}% margin`}
        />
        <StatCard
          label="Orders"
          loading={initial}
          value={fmtNum(k?.orders.value)}
          {...deltaProps(k?.orders.changePct, 'vs last period')}
        />
        <StatCard
          label="Cash collected"
          loading={initial}
          value={fmtMoney(k?.cashCollected.value)}
          {...deltaProps(k?.cashCollected.changePct, 'vs last period')}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-lg border border-line bg-panel p-5 lg:col-span-3">
          <h2 className="font-semibold text-white">Revenue over time</h2>
          <p className="mb-3 text-sm text-muted">{fmtRange(d?.period)}</p>
          {initial ? <SkeletonBlock className="h-[220px] w-full" /> : <RevenueChart data={d.revenueSeries} unit={d.unit} />}
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 lg:col-span-2">
          <h2 className="font-semibold text-white">Order status</h2>
          <p className="mb-4 text-sm text-muted">{fmtNum(d?.totalOrders)} total orders</p>
          {initial ? (
            <SkeletonBlock className="h-[150px] w-full" />
          ) : (
            <DonutChart
              data={d.orderStatus.map((s) => ({ name: s.status, value: s.count, color: STATUS_COLORS[s.status] }))}
            />
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-lg border border-line bg-panel p-5 lg:col-span-3">
          <h2 className="mb-4 font-semibold text-white">Top customers</h2>
          <div className="flex justify-between border-b border-line pb-2 text-[11px] font-medium uppercase tracking-wider text-faint">
            <span>Customer</span>
            <span>Total revenue</span>
          </div>
          {initial ? (
            <SkeletonBlock className="mt-3 h-24 w-full" />
          ) : d.topCustomers.length === 0 ? (
            <p className="py-8 text-center text-sm text-faint">No sales in this period</p>
          ) : (
            d.topCustomers.map((c) => (
              <div key={c.customerId} className="flex justify-between border-b border-line/60 py-3 text-sm last:border-0">
                <span className="font-medium text-white">{c.customer}</span>
                <span className="font-semibold text-white">{fmtMoney(c.netSales)}</span>
              </div>
            ))
          )}
        </div>

        <div className="rounded-lg border border-line bg-panel p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-white">Quick reports</h2>
          <div className="space-y-2">
            {QUICK_REPORTS.map((r) =>
              r.to ? (
                <Link key={r.label} to={r.to} className={`${rowCls} hover:bg-white/[0.09]`}>
                  {r.label} <FaArrowRight className="text-[10px] text-muted" />
                </Link>
              ) : (
                <div key={r.label} className={`${rowCls} cursor-not-allowed opacity-50`}>
                  {r.label}
                  <span className="font-mono text-[10px] uppercase tracking-wider text-faint">Soon</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}