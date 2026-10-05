import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiBox,
  FiUsers,
  FiTruck,
  FiFileText,
  FiCreditCard,
  FiShoppingBag,
  FiBarChart2,
  FiActivity,
  FiCheck,
} from "react-icons/fi";

const modules = [
  {
    icon: FiBox,
    title: "Inventory",
    description:
      "Know exactly what you have, where it is, and when you need to replenish.",
    points: [
      "Multi-warehouse inventory",
      "Stock movement tracking",
      "Low-stock alerts",
    ],
  },
  {
    icon: FiShoppingBag,
    title: "Orders",
    description:
      "Keep every order moving through one connected operational workflow.",
    points: [
      "Order lifecycle tracking",
      "Fulfillment visibility",
      "Real-time order status",
    ],
  },
  {
    icon: FiUsers,
    title: "Customers",
    description:
      "Build a complete view of every customer relationship and interaction.",
    points: [
      "Customer profiles",
      "Order history",
      "Account management",
    ],
  },
  {
    icon: FiTruck,
    title: "Suppliers",
    description:
      "Manage suppliers, purchasing and replenishment from one place.",
    points: [
      "Supplier directory",
      "Purchase management",
      "Supplier performance",
    ],
  },
  {
    icon: FiFileText,
    title: "Invoices",
    description:
      "Create, track and manage invoices without switching between tools.",
    points: [
      "Invoice management",
      "Payment status",
      "Customer billing",
    ],
  },
  {
    icon: FiCreditCard,
    title: "Payments",
    description:
      "See what has been collected, what is pending and where cash is moving.",
    points: [
      "Payment tracking",
      "Outstanding balances",
      "Cash visibility",
    ],
  },
];

const stats = [
  ["01", "Inventory", "Know what is available across every location."],
  ["02", "Orders", "Move every order through a single workflow."],
  ["03", "Customers", "Keep every customer relationship connected."],
  ["04", "Cash", "Understand what is owed and collected."],
];

function DashboardPreview() {
  return (
    <div className="relative mx-auto mt-16 max-w-6xl">
      {/* glow */}
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#08090b] shadow-2xl shadow-black/50">
        {/* top bar */}
        <div className="flex h-12 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
              <FiActivity className="text-black" size={13} />
            </div>

            <span className="text-xs font-semibold text-white">
              Corestack
            </span>
          </div>

          <div className="hidden items-center gap-6 text-[10px] text-neutral-500 sm:flex">
            <span>Overview</span>
            <span>Inventory</span>
            <span>Orders</span>
            <span>Customers</span>
            <span>Analytics</span>
          </div>

          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
        </div>

        <div className="grid min-h-[430px] grid-cols-[180px_1fr]">
          {/* sidebar */}
          <aside className="hidden border-r border-white/10 p-4 sm:block">
            <div className="mb-6 text-[9px] uppercase tracking-[0.18em] text-neutral-600">
              Workspace
            </div>

            <div className="space-y-1">
              {[
                "Overview",
                "Inventory",
                "Orders",
                "Customers",
                "Suppliers",
                "Invoices",
                "Payments",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`rounded-md px-3 py-2 text-[10px] ${
                    index === 0
                      ? "bg-white/[0.08] text-white"
                      : "text-neutral-500"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>

          {/* dashboard */}
          <main className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-neutral-500">
                  Operations overview
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Good morning, your business is moving.
                </div>
              </div>

              <div className="rounded-md border border-white/10 px-3 py-2 text-[9px] text-neutral-500">
                Jun 1 — Jun 30, 2026
              </div>
            </div>

            {/* stat cards */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {[
                ["Revenue", "$128,420", "+14.8%"],
                ["Open orders", "284", "+8.4%"],
                ["Inventory value", "$842K", "+12.1%"],
                ["Cash collected", "$94.2K", "+18.2%"],
              ].map(([title, value, change]) => (
                <div
                  key={title}
                  className="rounded-lg border border-white/10 bg-white/[0.025] p-4"
                >
                  <div className="text-[9px] text-neutral-500">{title}</div>

                  <div className="mt-3 text-xl font-semibold text-white">
                    {value}
                  </div>

                  <div className="mt-2 text-[9px] text-emerald-400">
                    {change} this month
                  </div>
                </div>
              ))}
            </div>

            {/* charts */}
            <div className="mt-3 grid gap-3 lg:grid-cols-[1.5fr_1fr]">
              <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
                <div className="flex justify-between">
                  <span className="text-[10px] text-neutral-400">
                    Revenue
                  </span>
                  <span className="text-[9px] text-neutral-600">
                    Last 30 days
                  </span>
                </div>

                <div className="mt-8 flex h-36 items-end gap-3">
                  {[40, 58, 48, 75, 65, 92, 78, 100].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-blue-500/80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
                <div className="text-[10px] text-neutral-400">
                  Order status
                </div>

                <div className="flex h-36 items-center justify-center">
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-[12px] border-blue-500">
                    <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-r-emerald-400 border-t-emerald-400 rotate-45" />

                    <div className="text-center">
                      <div className="text-lg font-semibold text-white">
                        284
                      </div>
                      <div className="text-[8px] text-neutral-500">
                        orders
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default function Product() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative border-b border-white/10">
        {/* grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 90%)",
          }}
        />

        {/* blue glow */}
        <div className="absolute left-1/2 top-[25%] h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

        <div className="relative mx-auto  max-w-7xl px-6 pb-24 pt-20 lg:px-10 ">
          <div className="mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/5 px-4 py-2 text-[11px] font-medium tracking-wide text-blue-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_#3b82f6]" />
              THE CORESTACK PLATFORM
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-8xl"
            >
              Everything your
              <br />
              operation needs{" "}
              <span className="text-blue-500">connected.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg"
            >
              Corestack brings inventory, orders, customers, suppliers,
              invoices and payments into one real-time operating system for
              your business.
            </motion.p>

            <div className="mt-9 flex justify-center gap-3">
              <a
                href="/auth?mode=signup"
                className="rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Start building
              </a>

              <a
                href="#platform"
                className="rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                Explore platform
              </a>
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section id="platform" className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <div className="text-xs font-medium uppercase tracking-[0.25em] text-blue-500">
                ONE OPERATING LAYER
              </div>

              <h2 className="mt-5 max-w-lg text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                One system.
                <br />
                Every operation.
              </h2>
            </div>

            <div className="max-w-2xl lg:pt-8">
              <p className="text-lg leading-8 text-slate-400">
                Your inventory shouldn't live in one system, your orders in
                another, and your financial data somewhere else.
              </p>

              <p className="mt-5 text-lg leading-8 text-slate-400">
                Corestack connects the operational pieces so your team can
                understand what is happening and act on it immediately.
              </p>
            </div>
          </div>

          <div className="mt-20 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([number, title, description]) => (
              <div
                key={number}
                className="min-h-[220px] border-b border-r border-white/10 p-7"
              >
                <div className="text-sm font-medium text-blue-500">
                  {number}
                </div>

                <h3 className="mt-16 text-xl font-medium text-white">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          MODULES
      ===================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
              BUILT FOR OPERATIONS
            </div>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
              Everything your team
              <br />
              needs to move faster.
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-400">
              Replace disconnected tools with one operational system designed
              around how your business actually works.
            </p>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => {
              const Icon = module.icon;

              return (
                <motion.div
                  key={module.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group min-h-[390px] rounded-xl border border-white/10 bg-[#08090b] p-7 transition duration-300 hover:-translate-y-1 hover:border-blue-500/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-500">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-12 text-2xl font-medium">
                    {module.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {module.description}
                  </p>

                  <div className="mt-8 space-y-3">
                    {module.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-2 text-xs text-slate-400"
                      >
                        <FiCheck className="text-blue-500" size={13} />
                        {point}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-xs font-medium text-blue-500 opacity-0 transition group-hover:opacity-100">
                    Explore {module.title}
                    <FiArrowUpRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          OPERATING ADVANTAGE
      ===================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
                THE OPERATING ADVANTAGE
              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
                From fragmented
                <br />
                to flowing.
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-500">
                Replace disconnected tools and manual handoffs with a single
                system that compounds every operational improvement.
              </p>
            </div>

            <div className="space-y-3">
              {[
                [
                  "01",
                  "Connect your critical systems",
                  "Bring inventory, orders, customers and financial operations together in one clean operating layer.",
                ],
                [
                  "02",
                  "Turn activity into workflows",
                  "Move repetitive processes into reliable workflows that keep your team moving without the busywork.",
                ],
                [
                  "03",
                  "Make decisions with context",
                  "Use real-time visibility and connected data to understand what is happening before deciding what happens next.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="grid gap-6 rounded-xl border border-white/10 bg-white/[0.025] p-7 sm:grid-cols-[70px_1fr] sm:p-8"
                >
                  <div className="text-xl font-medium text-blue-500">
                    {number}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white">
                      {title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="relative overflow-hidden rounded-2xl border border-blue-400/20 bg-[#071326] px-7 py-14 sm:px-12 lg:px-14">
          <div className="absolute right-[-100px] top-[-150px] h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[100px]" />

          <div className="relative flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-blue-400">
                CORESTACK
              </div>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Ready to consolidate your chaos?
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Build a faster, clearer way to run every part of your
                operation.
              </p>
            </div>

            <div className="flex shrink-0 gap-3">
              <a
                href="/auth?mode=signup"
                className="rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Start building
              </a>

              <a
                href="#contact"
                className="rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/5"
              >
                Talk to sales
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}