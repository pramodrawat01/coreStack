import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { fetchInventoryReport } from '../../../store/reportsSlice.js'
import { fmtMoney, fmtNum, exportCsv } from '../../../utils/report.js'
import StatCard from '../../../components/dashboard/StatCard.jsx'
import DonutChart from '../../../components/dashboard/charts/DonutChart.jsx'
import ReportHeader from '../../../components/dashboard/reports/ReportHeader.jsx'
import { SkeletonBlock } from '../../../components/dashboard/skeleton/Skeleton.jsx'

const WH_COLORS = ['#3B82F6', '#10B981', '#A855F7', '#F59E0B', '#F43F5E']
const STATUS_BADGE = {
  'In Stock': { label: 'Healthy', cls: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' },
  'Low Stock': { label: 'Low stock', cls: 'border-amber-500/30 bg-amber-500/10 text-amber-400' },
  'Out of Stock': { label: 'Out of stock', cls: 'border-rose-500/30 bg-rose-500/10 text-rose-400' },
}
const th = 'px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-faint'

export default function InventoryReport() {
  const dispatch = useDispatch()
  const { inventory: d, loading } = useSelector((s) => s.reports)
  const [period, setPeriod] = useState('this_month')

  useEffect(() => {
    dispatch(fetchInventoryReport(period))
  }, [dispatch, period])

  const initial = !d
  const k = d?.kpis
  const maxWh = Math.max(...(d?.valueByWarehouse.map((w) => w.value) || [0]), 1)
  const healthyPct = d?.health.total ? Math.round((d.health.healthy / d.health.total) * 100) : 0

  const handleExport = () =>
    exportCsv('inventory-report.csv', [
      ['Product', 'SKU', 'On hand', 'Unit cost', 'Total value', 'Status'],
      ...d.topProducts.map((p) => [p.name, p.sku, p.onHand, p.unitCost, p.totalValue, p.status]),
      [],
      ['Warehouse', 'Stock value'],
      ...d.valueByWarehouse.map((w) => [w.name, w.value]),
    ])

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`space-y-6 transition-opacity ${loading && d ? 'opacity-60' : ''}`}
    >
      <ReportHeader
        title="Inventory report"
        subtitle="Monitor stock value, turnover, and replenishment risk"
        period={period}
        onPeriod={setPeriod}
        onExport={handleExport}
        exportDisabled={!d}
        backTo="/dashboard/reports"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Inventory value" loading={initial} value={fmtMoney(k?.inventoryValue)} sub="At unit cost" />
        <StatCard label="Units on hand" loading={initial} value={fmtNum(k?.unitsOnHand)} sub="Across all warehouses" />
        <StatCard
          label="Low stock items"
          loading={initial}
          value={fmtNum(k?.lowStockItems)}
          sub={k?.lowStockItems > 0 ? 'Needs attention' : 'All stocked'}
          subTone={k?.lowStockItems > 0 ? 'warn' : 'good'}
        />
        <StatCard label="Inventory turnover" loading={initial} value={`${k?.turnover ?? 0}x`} sub="Selected period" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-panel p-5">
          <h2 className="font-semibold text-white">Inventory value by warehouse</h2>
          <p className="mb-5 text-sm text-muted">Total stock value across locations</p>
          {initial ? (
            <SkeletonBlock className="h-32 w-full" />
          ) : d.valueByWarehouse.length === 0 ? (
            <p className="py-8 text-center text-sm text-faint">No warehouses yet</p>
          ) : (
            <div className="space-y-4">
              {d.valueByWarehouse.map((w, i) => (
                <div key={w.name}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-semibold text-white">{w.name}</span>
                    <span className="font-semibold text-white">{fmtMoney(w.value)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(w.value / maxWh) * 100}%`, background: WH_COLORS[i % WH_COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-line bg-panel p-5">
          <h2 className="font-semibold text-white">Stock health</h2>
          <p className="mb-5 text-sm text-muted">Distribution of current inventory status</p>
          {initial ? (
            <SkeletonBlock className="h-[150px] w-full" />
          ) : (
            <DonutChart
              centerLabel={`${healthyPct}%`}
              data={[
                { name: 'Healthy', value: d.health.healthy, color: '#10B981' },
                { name: 'Low stock', value: d.health.low, color: '#F59E0B' },
                { name: 'Out of stock', value: d.health.out, color: '#F43F5E' },
              ]}
            />
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-panel">
        <div className="p-5">
          <h2 className="font-semibold text-white">Highest value products</h2>
          <p className="text-sm text-muted">Products contributing most to inventory value</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-white/[0.03] text-left">
              <tr>
                <th className={th}>Product</th>
                <th className={th}>SKU</th>
                <th className={`${th} text-right`}>On hand</th>
                <th className={`${th} text-right`}>Unit cost</th>
                <th className={`${th} text-right`}>Total value</th>
                <th className={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {initial ? (
                <tr><td colSpan={6} className="p-5"><SkeletonBlock className="h-24 w-full" /></td></tr>
              ) : d.topProducts.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-faint">No products yet</td></tr>
              ) : (
                d.topProducts.map((p) => {
                  const badge = STATUS_BADGE[p.status]
                  return (
                    <tr key={p.sku} className="border-t border-line">
                      <td className="px-5 py-4 font-semibold text-white">{p.name}</td>
                      <td className="px-5 py-4 font-mono text-xs text-muted">{p.sku}</td>
                      <td className="px-5 py-4 text-right text-white">{fmtNum(p.onHand)}</td>
                      <td className="px-5 py-4 text-right text-white">{fmtMoney(p.unitCost)}</td>
                      <td className="px-5 py-4 text-right font-semibold text-white">{fmtMoney(p.totalValue)}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded border px-2 py-0.5 text-xs ${badge.cls}`}>{badge.label}</span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}