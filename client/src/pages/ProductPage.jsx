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
import DashboardPreview from "../components/landingPage/DashboardPreview";

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

  <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 lg:px-10">
    <div className="mx-auto text-center">

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7 inline-flex items-center gap-2 rounded-md text-sm border border-white/10 bg-white/[0.1] px-5 py-1.5 text-md text-neutral-300 transition-colors hover:bg-white/[0.08] hover:text-white"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />

          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]" />
        </span>

        THE CORESTACK PLATFORM
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-balance mt-4"
      >
        Everything your
        <br />
        operation needs{" "}
        <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">
          connected.
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed mx-auto mt-8"
      >
        Corestack brings inventory, orders, customers, suppliers,
        invoices and payments into one real-time operating system for
        your business.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9"
      >
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
      </motion.div>
    </div>

    
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

    {/* Dashboard Preview */}
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
      className="relative z-10 max-w-6xl mx-auto w-full mt-28"
    >
      <DashboardPreview />
    </motion.div>

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