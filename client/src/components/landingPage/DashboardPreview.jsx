import {
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaFileInvoiceDollar,
  FaChartBar,
  FaWarehouse,
  FaCog,
  FaSearch,
  FaBell,
} from 'react-icons/fa'

import SalesChart from './SalesChart'

const SIDEBAR_ITEMS = [
  { icon: FaHome, label: 'Overview', active: true },
  { icon: FaBoxOpen, label: 'Inventory' },
  { icon: FaShoppingCart, label: 'Orders' },
  { icon: FaWarehouse, label: 'Purchases' },
  { icon: FaUsers, label: 'Customers' },
  { icon: FaFileInvoiceDollar, label: 'Invoices' },
  { icon: FaChartBar, label: 'Reports' },
]

const STAT_CARDS = [
  { label: 'Revenue (30d)', value: '$182,940', delta: '+12.4%', up: true },
  { label: 'Open orders', value: '346', delta: '+8', up: true },
  { label: 'Inventory value', value: '$94,210', delta: '-2.1%', up: false },
  { label: 'Outstanding', value: '$21,050', delta: '4 overdue', up: false },
]

const RECENT_ORDERS = [
  { id: '#OR-3021', customer: 'Meridian Foods', amount: '$4,280', status: 'Fulfilled' },
  { id: '#OR-3020', customer: 'Ashford Retail', amount: '$1,120', status: 'Processing' },
  { id: '#OR-3019', customer: 'Blue Harbor Ltd', amount: '$8,960', status: 'Fulfilled' },
  { id: '#OR-3018', customer: 'Nolan & Co', amount: '$650', status: 'Pending' },
]

const STATUS_STYLES = {
  Fulfilled: 'text-emerald-400 bg-emerald-400/10',
  Processing: 'text-accent2 bg-accent2/10',
  Pending: 'text-amber-400 bg-amber-400/10',
}

const CHART_BARS = [38, 52, 44, 61, 58, 72, 66, 80, 74, 90, 84, 96]

export default function DashboardPreview({ className = '' }) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl border border-line bg-panel shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div className="flex">
        {/* Sidebar */}
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
                  item.active ? 'bg-white/[0.07] text-white' : 'text-faint'
                }`}
              >
                <item.icon size={11} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[11px] text-faint">
            <FaCog size={11} />
            <span>Settings</span>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 py-4">
          {/* Top bar */}
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-2.5 py-1.5 text-[11px] text-faint w-40 sm:w-56">
              <FaSearch size={10} />
              <span>Search orders, SKUs…</span>
            </div>
            <div className="flex items-center gap-3">
              <FaBell size={12} className="text-faint" />
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-accent to-accent2" />
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {STAT_CARDS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-line bg-surface px-3 py-2.5">
                <p className="text-[10px] text-faint">{stat.label}</p>
                <p className="text-sm sm:text-base font-semibold mt-1">{stat.value}</p>
                <p className={`text-[10px] mt-0.5 ${stat.up ? 'text-emerald-400' : 'text-faint'}`}>{stat.delta}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2.5 mt-2.5">
            {/* Chart */}
            <div className="lg:col-span-3 rounded-lg border border-line bg-surface p-3.5">
              <SalesChart/>
              {/* <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-white">Sales analytics</p>
                <span className="text-[10px] text-faint font-mono">LAST 12 WEEKS</span>
              </div>
              <div className="flex items-end gap-1.5 h-24">
                {CHART_BARS.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-accent/70 to-accent2/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div> */}
            </div>
          

            {/* Recent orders */}
            <div className="lg:col-span-2 rounded-lg border border-line bg-surface p-3.5">
              <p className="text-[11px] text-white mb-2.5">Recent orders</p>
              <div className="flex flex-col gap-2">
                {RECENT_ORDERS.map((order) => (
                  <div key={order.id} className="flex items-center justify-between text-[10.5px]">
                    <div className="min-w-0">
                      <p className="text-white truncate">{order.customer}</p>
                      <p className="text-faint font-mono">{order.id}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-muted">{order.amount}</span>
                      <span className={`rounded px-1.5 py-0.5 ${STATUS_STYLES[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
