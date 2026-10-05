import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaRegCalendarAlt, FaShoppingCart, FaFileInvoiceDollar, FaBoxOpen, FaTruck, FaChartBar } from 'react-icons/fa'
import { fetchOverview } from '../../store/overviewSlice.js'
import { fmtMoney, fmtNum, fmtCompactMoney, deltaProps, timeAgo } from '../../utils/report.js'
import StatCard from '../../components/dashboard/StatCard.jsx'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'
import EmptyState from '../../components/dashboard/EmptyState.jsx'
import RevenueChart from '../../components/dashboard/charts/RevenueChart.jsx'
import WeeklyBars from '../../components/dashboard/charts/WeeklyBars.jsx'
import { SkeletonBlock } from '../../components/dashboard/skeleton/Skeleton.jsx'
import CustomDropdown from '../../components/common/CustomDropdown.jsx'

const WINDOWS = [
  ['last_7', 'Last 7 days', 7],
  ['last_30', 'Last 30 days', 30],
  ['last_90', 'Last 90 days', 90],
]

const ACTIVITY_ICONS = {
  order: { icon: FaShoppingCart, cls: 'bg-accent2/15 text-accent2' },
  invoice: { icon: FaFileInvoiceDollar, cls: 'bg-emerald-500/15 text-emerald-400' },
  stock: { icon: FaBoxOpen, cls: 'bg-amber-500/15 text-amber-400' },
  supplier: { icon: FaTruck, cls: 'bg-purple-500/15 text-purple-400' },
}

const card = 'rounded-lg border border-line bg-panel p-5'
const rowCls = 'flex items-center justify-between border-b border-line/60 py-3 last:border-0'

function Empty({ children }) {
  return <p className="py-6 text-center text-sm text-faint">{children}</p>
}

export default function Overview() {
  const dispatch = useDispatch()
  const { data: d, loading } = useSelector((s) => s.overview)
  const [period, setPeriod] = useState('last_30')
  const [metric, setMetric] = useState('revenue')

  useEffect(() => {
    dispatch(fetchOverview(period))
  }, [dispatch, period])

  const initial = !d
  const days = WINDOWS.find(([v]) => v === period)[2]
  const k = d?.kpis
  const isRev = metric === 'revenue'
  const t = d?.trend

  const nothingVisible =
    d && !k.revenue && !k.inventoryValue && !k.outstanding && !d.recentOrders && !d.lowStock && d.activity.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 transition-opacity ${loading && d ? 'opacity-60' : ''}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Overview</h1>
          <p className="mt-1 text-sm text-muted">Here is what is happening with your business today.</p>
        </div>
        {/* <label className="relative inline-flex items-center">
          <FaRegCalendarAlt className="pointer-events-none absolute left-3 text-xs text-muted" />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-md border border-line bg-white/5 py-2 pl-9 pr-3 text-sm text-white focus:border-accent2 focus:outline-none"
          >
            {WINDOWS.map(([value, label]) => (
              <option key={value} value={value} className="bg-panel">{label}</option>
            ))}
          </select>
          
        </label> */}
        <div className="relative ">
          <FaRegCalendarAlt
            className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-xs text-muted"
          />

          <CustomDropdown
            value={period}
            onChange={setPeriod}
            options={WINDOWS.map(([value, label]) => ({
              value,
              label,
            }))}
            className="w-44"
            triggerClassName="pl-9 pr-3"
          />
        </div>
      </div>

      {nothingVisible && (
        <EmptyState
          icon={FaChartBar}
          title="Nothing to show yet"
          description="Your role doesn't have access to any modules that feed the overview."
        />
      )}

      {/* KPI row */}
      {(initial || k.revenue || k.openOrders || k.inventoryValue || k.outstanding) && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {(initial || k.revenue) && (
            <StatCard
              label={`Revenue (${days}d)`}
              loading={initial}
              value={fmtMoney(k?.revenue?.value)}
              {...deltaProps(k?.revenue?.changePct, 'vs previous')}
            />
          )}
          {(initial || k.openOrders) && (
            <StatCard
              label="Open orders"
              loading={initial}
              value={fmtNum(k?.openOrders?.value)}
              sub={`${fmtNum(k?.openOrders?.placed)} placed this period`}
            />
          )}
          {(initial || k.inventoryValue) && (
            <StatCard
              label="Inventory value"
              loading={initial}
              value={fmtMoney(k?.inventoryValue?.value)}
              {...deltaProps(k?.inventoryValue?.changePct, 'this period')}
            />
          )}
          {(initial || k.outstanding) && (
            <StatCard
              label="Outstanding payments"
              loading={initial}
              value={fmtMoney(k?.outstanding?.value)}
              sub={k?.outstanding?.overdue > 0 ? `${k.outstanding.overdue} overdue` : 'None overdue'}
              subTone={k?.outstanding?.overdue > 0 ? 'warn' : 'good'}
            />
          )}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          {(initial || t) && (
            <div className={card}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-white">{isRev ? 'Revenue' : 'Orders'}</h2>
                  {initial ? (
                    <SkeletonBlock className="mt-2 h-6 w-28" />
                  ) : (
                    <>
                      <p className="mt-1 text-xl font-semibold text-white">
                        {isRev ? fmtMoney(t.totals.revenue) : fmtNum(t.totals.orders)}
                      </p>
                      {(() => {
                        const { sub, subTone } = deltaProps(
                          isRev ? t.totals.revenueChangePct : t.totals.ordersChangePct,
                          'vs previous 12 months'
                        )
                        return (
                          <p className={`text-xs ${subTone === 'good' ? 'text-emerald-400' : subTone === 'bad' ? 'text-rose-400' : 'text-muted'}`}>
                            {sub}
                          </p>
                        )
                      })()}
                    </>
                  )}
                </div>

                <div className="inline-flex rounded-md border border-line bg-white/[0.03] p-1 text-sm">
                  {[['revenue', 'Revenue'], ['orders', 'Orders']].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setMetric(value)}
                      className={`rounded px-3 py-1 transition-colors ${
                        metric === value ? 'bg-white/10 font-medium text-white' : 'text-muted hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                {initial ? (
                  <SkeletonBlock className="h-[260px] w-full" />
                ) : (
                  <RevenueChart
                    data={t.series}
                    unit="month"
                    dataKey={metric}
                    label={isRev ? 'Revenue' : 'Orders'}
                    format={isRev ? fmtMoney : fmtNum}
                    yFormat={isRev ? fmtCompactMoney : fmtNum}
                    yAxis
                    height={260}
                  />
                )}
              </div>
            </div>
          )}

          {(initial || d.weekly) && (
            <div className={card}>
              <h2 className="mb-4 font-semibold text-white">Sales & order analytics</h2>
              {initial ? <SkeletonBlock className="h-[220px] w-full" /> : <WeeklyBars data={d.weekly} />}
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {(initial || d.recentOrders) && (
            <div className={card}>
              <h2 className="mb-2 font-semibold text-white">Recent orders</h2>
              {initial ? (
                <SkeletonBlock className="h-40 w-full" />
              ) : d.recentOrders.length === 0 ? (
                <Empty>No orders yet</Empty>
              ) : (
                <>
                  {d.recentOrders.map((o) => (
                    <Link key={o._id} to={`/dashboard/orders/${o._id}`} className={`${rowCls} hover:bg-white/[0.02]`}>
                      <div>
                        <p className="text-sm font-semibold text-white">{o.orderNumber}</p>
                        <p className="text-xs text-muted">{o.customerName}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-semibold text-white">{fmtMoney(o.totalAmount)}</span>
                        <StatusBadge status={o.fulfillmentStatus} />
                      </div>
                    </Link>
                  ))}
                  <Link to="/dashboard/orders" className="mt-3 inline-block text-xs text-accent2 hover:underline">
                    View all orders
                  </Link>
                </>
              )}
            </div>
          )}

          {(initial || d.lowStock) && (
            <div className={card}>
              <h2 className="mb-2 font-semibold text-white">Low stock products</h2>
              {initial ? (
                <SkeletonBlock className="h-32 w-full" />
              ) : d.lowStock.items.length === 0 ? (
                <Empty>Everything is well stocked</Empty>
              ) : (
                <>
                  {d.lowStock.items.map((p) => {
                    const critical = p.stockQuantity <= 0 || (p.reorderPoint > 0 && p.stockQuantity / p.reorderPoint <= 0.5)
                    return (
                      <Link key={p._id} to={`/dashboard/products/${p._id}`} className={`${rowCls} gap-3 hover:bg-white/[0.02]`}>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{p.name}</p>
                          <p className="font-mono text-[11px] text-muted">SKU {p.sku}</p>
                        </div>
                        <span className={`shrink-0 text-xs font-semibold ${critical ? 'text-red-400' : 'text-amber-400'}`}>
                          {p.stockQuantity <= 0 ? 'Out of stock' : `${fmtNum(p.stockQuantity)} units left`}
                        </span>
                      </Link>
                    )
                  })}
                  {d.lowStock.total > d.lowStock.items.length && (
                    <Link to="/dashboard/inventory" className="mt-3 inline-block text-xs text-accent2 hover:underline">
                      View all {d.lowStock.total} low stock items
                    </Link>
                  )}
                </>
              )}
            </div>
          )}

          {(initial || d.activity.length > 0) && (
            <div className={card}>
              <h2 className="mb-2 font-semibold text-white">Recent activity</h2>
              {initial ? (
                <SkeletonBlock className="h-40 w-full" />
              ) : (
                d.activity.map((a, i) => {
                  const { icon: Icon, cls } = ACTIVITY_ICONS[a.type]
                  return (
                    <div key={i} className="flex items-start gap-3 border-b border-line/60 py-3 last:border-0">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${cls}`}>
                        <Icon size={12} />
                      </span>
                      <p className="flex-1 text-sm leading-snug text-white">{a.message}</p>
                      <span className="shrink-0 text-[11px] text-faint">{timeAgo(a.at)}</span>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}