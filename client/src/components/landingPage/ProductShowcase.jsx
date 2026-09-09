import { useState } from 'react'
import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaWarehouse,
} from 'react-icons/fa'

const TABS = ['Dashboard', 'Inventory', 'Orders', 'Invoices', 'Reports']

const SIDEBAR_ITEMS = [
  { icon: FaHome, label: 'Overview' },
  { icon: FaBoxOpen, label: 'Inventory' },
  { icon: FaShoppingCart, label: 'Orders' },
  { icon: FaWarehouse, label: 'Purchases' },
  { icon: FaUsers, label: 'Customers' },
  { icon: FaFileInvoiceDollar, label: 'Invoices' },
  { icon: FaChartBar, label: 'Reports' },
]

const INVENTORY_ROWS = [
  { sku: 'SKU-1042', name: 'Steel Bracket 4in', stock: 1280, status: 'In stock' },
  { sku: 'SKU-2071', name: 'Poly Strapping Roll', stock: 34, status: 'Low stock' },
  { sku: 'SKU-3390', name: 'Cardboard Box M', stock: 6120, status: 'In stock' },
  { sku: 'SKU-4410', name: 'Foam Insert Set', stock: 0, status: 'Out of stock' },
]

const INVENTORY_STATUS_STYLES = {
  'In stock': 'text-emerald-400 bg-emerald-400/10',
  'Low stock': 'text-amber-400 bg-amber-400/10',
  'Out of stock': 'text-red-400 bg-red-400/10',
}

const INVOICE_ROWS = [
  { id: 'INV-0912', customer: 'Ashford Retail', due: 'Oct 14', amount: '$3,240', status: 'Paid' },
  { id: 'INV-0913', customer: 'Meridian Foods', due: 'Oct 18', amount: '$8,960', status: 'Sent' },
  { id: 'INV-0914', customer: 'Nolan & Co', due: 'Sep 30', amount: '$650', status: 'Overdue' },
]

const INVOICE_STATUS_STYLES = {
  Paid: 'text-emerald-400 bg-emerald-400/10',
  Sent: 'text-accent2 bg-accent2/10',
  Overdue: 'text-red-400 bg-red-400/10',
}

function Frame({ active, children }) {
  return (
    <div className="flex rounded-xl border border-line bg-panel overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
      <div className="hidden sm:flex w-[168px] shrink-0 flex-col border-r border-line bg-surface px-3 py-4">
        <div className="flex items-center gap-2 px-2 pb-4">
          <span className="h-5 w-5 rounded bg-white" />
          <span className="text-xs font-semibold">Corestack</span>
        </div>
        <div className="flex flex-col gap-0.5">
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] ${
                item.label === active || (active === 'Overview' && item.label === 'Overview')
                  ? 'bg-white/[0.07] text-white'
                  : 'text-faint'
              }`}
            >
              <item.icon size={11} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 min-w-0 p-5 sm:p-6 min-h-[340px]">{children}</div>
    </div>
  )
}

function DashboardPanel() {
  return (
    <div className="flex flex-col h-full gap-3">
      <p className="text-sm font-medium">Overview</p>
      <div className="grid grid-cols-3 gap-2.5">
        {['Revenue', 'Orders', 'Customers'].map((label, i) => (
          <div key={label} className="rounded-lg border border-line bg-surface px-3 py-2.5">
            <p className="text-[10px] text-faint">{label}</p>
            <p className="text-sm font-semibold mt-1">{['$182,940', '346', '1,204'][i]}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-lg border border-line bg-surface p-3.5 flex items-end gap-1.5">
        {[40, 55, 48, 65, 60, 78, 70, 88, 82, 95].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-accent/70 to-accent2/60" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function InventoryPanel() {
  return (
    <div className="flex flex-col h-full gap-3">
      <p className="text-sm font-medium">Inventory</p>
      <div className="rounded-lg border border-line bg-surface overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-left text-faint border-b border-line">
              <th className="px-3 py-2 font-normal">SKU</th>
              <th className="px-3 py-2 font-normal">Product</th>
              <th className="px-3 py-2 font-normal">Stock</th>
              <th className="px-3 py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {INVENTORY_ROWS.map((row) => (
              <tr key={row.sku} className="border-b border-line last:border-0">
                <td className="px-3 py-2.5 font-mono text-faint">{row.sku}</td>
                <td className="px-3 py-2.5">{row.name}</td>
                <td className="px-3 py-2.5">{row.stock.toLocaleString()}</td>
                <td className="px-3 py-2.5">
                  <span className={`rounded px-1.5 py-0.5 ${INVENTORY_STATUS_STYLES[row.status]}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrdersPanel() {
  return (
    <div className="flex flex-col h-full gap-3">
      <p className="text-sm font-medium">Orders</p>
      <div className="flex flex-col gap-2">
        {['#OR-3021 · Meridian Foods', '#OR-3020 · Ashford Retail', '#OR-3019 · Blue Harbor Ltd'].map((row) => (
          <div key={row} className="flex items-center justify-between rounded-lg border border-line bg-surface px-3.5 py-3 text-[11px]">
            <span className="font-mono text-faint">{row}</span>
            <span className="rounded px-1.5 py-0.5 text-emerald-400 bg-emerald-400/10">Fulfilled</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function InvoicesPanel() {
  return (
    <div className="flex flex-col h-full gap-3">
      <p className="text-sm font-medium">Invoices</p>
      <div className="rounded-lg border border-line bg-surface overflow-hidden">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-left text-faint border-b border-line">
              <th className="px-3 py-2 font-normal">Invoice</th>
              <th className="px-3 py-2 font-normal">Customer</th>
              <th className="px-3 py-2 font-normal">Due</th>
              <th className="px-3 py-2 font-normal">Amount</th>
              <th className="px-3 py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody>
            {INVOICE_ROWS.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-3 py-2.5 font-mono text-faint">{row.id}</td>
                <td className="px-3 py-2.5">{row.customer}</td>
                <td className="px-3 py-2.5 text-muted">{row.due}</td>
                <td className="px-3 py-2.5">{row.amount}</td>
                <td className="px-3 py-2.5">
                  <span className={`rounded px-1.5 py-0.5 ${INVOICE_STATUS_STYLES[row.status]}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReportsPanel() {
  return (
    <div className="flex flex-col h-full gap-3">
      <p className="text-sm font-medium">Reports</p>
      <div className="grid grid-cols-2 gap-2.5 flex-1">
        <div className="rounded-lg border border-line bg-surface p-3.5 flex flex-col justify-between">
          <p className="text-[10px] text-faint">Revenue by channel</p>
          <div className="flex items-end gap-1.5 h-16">
            {[30, 60, 45, 80, 55].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-accent/70" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-line bg-surface p-3.5 flex flex-col justify-between">
          <p className="text-[10px] text-faint">Fulfillment rate</p>
          <p className="text-2xl font-semibold">94.2%</p>
        </div>
      </div>
    </div>
  )
}

const PANELS = {
  Dashboard: DashboardPanel,
  Inventory: InventoryPanel,
  Orders: OrdersPanel,
  Invoices: InvoicesPanel,
  Reports: ReportsPanel,
}

export default function ProductShowcase() {
  const [active, setActive] = useState('Dashboard')
  const Panel = PANELS[active]

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`rounded-md px-3.5 py-1.5 text-sm transition-colors ${
              active === tab ? 'bg-white text-ink' : 'bg-white/[0.04] text-muted hover:text-white border border-line'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <Frame active={active === 'Dashboard' ? 'Overview' : active}>
        <Panel />
      </Frame>
    </div>
  )
}
