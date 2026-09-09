import SectionHeading from '../components/landingPage/SectionHeading.jsx'
import FeatureCard from '../components/landingPage/FeatureCard.jsx'

function StockVisual() {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1">
        <p className="text-[10px] text-faint mb-1">Foam Insert Set</p>
        <div className="h-1.5 rounded-full bg-line overflow-hidden">
          <div className="h-full w-[8%] bg-red-400" />
        </div>
      </div>
      <span className="text-[10px] rounded px-1.5 py-0.5 text-red-400 bg-red-400/10">Low</span>
    </div>
  )
}

function OrdersVisual() {
  return (
    <div className="flex flex-col gap-1.5">
      {['New', 'Packed', 'Shipped'].map((s, i) => (
        <div key={s} className="flex items-center gap-2 text-[10px] text-muted">
          <span className={`h-1.5 w-1.5 rounded-full ${i === 2 ? 'bg-emerald-400' : 'bg-line'}`} />
          {s}
        </div>
      ))}
    </div>
  )
}

function PurchaseVisual() {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="rounded px-1.5 py-0.5 text-accent2 bg-accent2/10">PO-2210</span>
      <span className="text-faint">Vantage Supply · Due Oct 12</span>
    </div>
  )
}

function InvoiceVisual() {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <span className="text-muted">Balance due</span>
      <span className="font-mono text-white">$1,240.00</span>
    </div>
  )
}

function AnalyticsVisual() {
  return (
    <div className="flex items-end gap-1 h-8">
      {[30, 55, 40, 70, 60, 85].map((h, i) => (
        <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-accent/70 to-accent2/50" style={{ height: `${h}%` }} />
      ))}
    </div>
  )
}

function TeamVisual() {
  return (
    <div className="flex items-center gap-2 text-[10px]">
      <span className="rounded px-1.5 py-0.5 text-muted bg-white/[0.06]">Admin</span>
      <span className="rounded px-1.5 py-0.5 text-muted bg-white/[0.06]">Warehouse</span>
      <span className="rounded px-1.5 py-0.5 text-muted bg-white/[0.06]">Sales</span>
    </div>
  )
}

const FEATURES = [
  {
    index: '01',
    title: 'Inventory Management',
    description: 'Track stock across warehouses, monitor low-stock products and manage stock movements in real time.',
    visual: <StockVisual />,
  },
  {
    index: '02',
    title: 'Sales & Orders',
    description: 'Create, manage and track customer orders from one centralized workspace.',
    visual: <OrdersVisual />,
  },
  {
    index: '03',
    title: 'Purchase Management',
    description: 'Manage suppliers, purchase orders and incoming stock efficiently.',
    visual: <PurchaseVisual />,
  },
  {
    index: '04',
    title: 'Invoicing & Payments',
    description: 'Create invoices, track payments and monitor outstanding balances.',
    visual: <InvoiceVisual />,
  },
  {
    index: '05',
    title: 'Business Analytics',
    description: 'Turn operational data into useful reports and actionable insights.',
    visual: <AnalyticsVisual />,
  },
  {
    index: '06',
    title: 'Team & Permissions',
    description: 'Control employee access with roles and granular permissions.',
    visual: <TeamVisual />,
  },
]

export default function Features() {
  return (
    <section id="features" className="relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHeading
          eyebrow="Features"
          title="Every part of the operation, connected."
          description="Corestack replaces the patchwork of spreadsheets and side tools with one system your whole team already trusts."
          align="center"
          size="lg"
          className="mb-14"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
