import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiBarChart2,
  FiBox,
  FiCheck,
  FiCreditCard,
  FiFileText,
  FiLayers,
  FiShoppingBag,
  FiTruck,
  FiUsers,
  FiZap,
} from "react-icons/fi";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

const stagger = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.08,
    },
  },
  viewport: {
    once: true,
    amount: 0.15,
  },
};

const modules = [
  {
    icon: FiBox,
    title: "Inventory",
    description:
      "Keep a real-time view of what you have, where it is, and what needs attention before it becomes a problem.",
  },
  {
    icon: FiShoppingBag,
    title: "Orders",
    description:
      "Manage sales and orders from creation to fulfillment while keeping every transaction connected to inventory.",
  },
  {
    icon: FiUsers,
    title: "Customers",
    description:
      "Keep customer information, order history, activity, and relationships organized in one place.",
  },
  {
    icon: FiTruck,
    title: "Suppliers",
    description:
      "Manage supplier relationships, purchasing activity, and incoming stock without scattered spreadsheets.",
  },
  {
    icon: FiFileText,
    title: "Invoices",
    description:
      "Create, manage, and track invoices while keeping financial activity connected to your operational data.",
  },
  {
    icon: FiCreditCard,
    title: "Payments",
    description:
      "Track payment activity and understand what has been received, what is pending, and what needs attention.",
  },
  {
    icon: FiBarChart2,
    title: "Analytics",
    description:
      "Turn operational data into useful insights across inventory, sales, customers, cash flow, and business performance.",
  },
  {
    icon: FiLayers,
    title: "Users & Access",
    description:
      "Give your team the right access to the right areas while keeping your business operations organized.",
  },
];

const principles = [
  {
    number: "01",
    title: "One operational system",
    text: "Your business should not need a different tool for every part of its operation. Corestack brings the essential pieces together.",
  },
  {
    number: "02",
    title: "Connected by default",
    text: "An order should affect inventory. A customer should connect to their orders. An invoice should connect to a transaction. Corestack is designed around these relationships.",
  },
  {
    number: "03",
    title: "Built for visibility",
    text: "Good decisions require good information. Corestack puts the information that matters in front of you without forcing you to search across disconnected systems.",
  },
  {
    number: "04",
    title: "Designed to scale",
    text: "Start with the workflows your business needs today and expand as your operation becomes more complex.",
  },
];

const upcoming = [
  {
    icon: FiZap,
    title: "Workflow automation",
    text: "Automate repetitive operational tasks, alerts, approvals, and recurring workflows.",
    status: "Planned",
  },
  {
    icon: FiLayers,
    title: "Deeper integrations",
    text: "Connect Corestack with the tools and services your business already relies on.",
    status: "Planned",
  },
  {
    icon: FiBarChart2,
    title: "Advanced intelligence",
    text: "Move beyond reporting toward smarter insights that help identify trends, risks, and opportunities.",
    status: "Planned",
  },
  {
    icon: FiUsers,
    title: "More collaboration",
    text: "Improve how teams communicate, coordinate, approve, and manage operational work.",
    status: "Planned",
  },
];

export default function About() {
  return (
    <main className="relative overflow-hidden bg-black text-white">

      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative border-b border-white/10">
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          }}
        />

        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-[20%] h-[450px] w-[750px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-28 pt-24 lg:px-10 lg:pt-32">
          <div className="mx-auto max-w-5xl text-center">

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-5 py-1.5 text-sm text-neutral-300"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.7)]" />
              </span>

              ABOUT CORESTACK
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
            >
              The operating system for
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(56,189,248,0.25)]">
                modern operations.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg"
            >
              Corestack is a unified business operations platform built to
              bring inventory, orders, customers, suppliers, invoices,
              payments, users, and analytics into one connected system.
            </motion.p>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHAT IS CORESTACK
      ========================================================== */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

          <motion.div
            {...stagger}
            className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start"
          >
            <motion.div {...fadeUp}>
              <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
                What is Corestack?
              </p>

              <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Your business has many moving parts.
                <span className="text-neutral-500">
                  {" "}
                  They should not feel like separate businesses.
                </span>
              </h2>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="space-y-6 text-base leading-8 text-neutral-400 sm:text-lg"
            >
              <p>
                As businesses grow, their operations become increasingly
                fragmented. Inventory lives in one place. Orders live
                somewhere else. Customer information sits in another system,
                while invoices, payments, suppliers, and reporting are often
                managed separately.
              </p>

              <p>
                Corestack is built around a simple idea:{" "}
                <span className="text-white">
                  your operational data should work together.
                </span>
              </p>

              <p>
                Instead of treating inventory, orders, customers, suppliers,
                invoices, payments, and analytics as isolated products,
                Corestack connects them into a single operating layer.
              </p>

              <p>
                The result is a clearer view of the business, fewer manual
                processes, better coordination between teams, and a foundation
                that can grow with the operation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          CORE IDEA
      ========================================================== */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

          <motion.div
            {...fadeUp}
            className="mb-14 max-w-2xl"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
              The Corestack model
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Everything connected.
              <br />
              Nothing isolated.
            </h2>

            <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
              Corestack is designed around the relationships between your
              business operations—not just the individual tools.
            </p>
          </motion.div>

          {/* Connected system */}
          <motion.div
            {...stagger}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(59,130,246,0.12),transparent_45%)]" />

            <div className="relative grid min-h-[430px] place-items-center p-8 sm:p-14">

              {/* Center */}
              <motion.div
                variants={fadeUp}
                className="relative z-20 flex h-32 w-32 items-center justify-center rounded-3xl border border-blue-400/30 bg-blue-500/10 shadow-[0_0_80px_rgba(59,130,246,0.15)]"
              >
                <div className="text-center">
                  <div className="text-xl font-semibold">Corestack</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-blue-400">
                    Operations
                  </div>
                </div>
              </motion.div>

              {/* Orbit items */}
              <div className="pointer-events-none absolute inset-0 hidden sm:block">
                <div className="absolute left-[12%] top-[20%] rounded-xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-neutral-300">
                  Inventory
                </div>

                <div className="absolute right-[12%] top-[20%] rounded-xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-neutral-300">
                  Orders
                </div>

                <div className="absolute left-[10%] bottom-[20%] rounded-xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-neutral-300">
                  Customers
                </div>

                <div className="absolute right-[10%] bottom-[20%] rounded-xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-neutral-300">
                  Suppliers
                </div>

                <div className="absolute left-1/2 top-[8%] -translate-x-1/2 rounded-xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-neutral-300">
                  Analytics
                </div>

                <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 rounded-xl border border-white/10 bg-black/70 px-5 py-3 text-sm text-neutral-300">
                  Finance
                </div>
              </div>

              {/* Lines */}
              <div className="pointer-events-none absolute inset-0 hidden sm:block">
                <div className="absolute left-[22%] top-[32%] h-px w-[28%] rotate-[20deg] bg-gradient-to-r from-transparent via-blue-500/30 to-blue-500/20" />
                <div className="absolute right-[22%] top-[32%] h-px w-[28%] -rotate-[20deg] bg-gradient-to-l from-transparent via-blue-500/30 to-blue-500/20" />
                <div className="absolute bottom-[32%] left-[22%] h-px w-[28%] -rotate-[20deg] bg-gradient-to-r from-transparent via-blue-500/30 to-blue-500/20" />
                <div className="absolute bottom-[32%] right-[22%] h-px w-[28%] rotate-[20deg] bg-gradient-to-l from-transparent via-blue-500/30 to-blue-500/20" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          CORE FUNCTIONALITIES
      ========================================================== */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

          <motion.div
            {...fadeUp}
            className="mb-14 max-w-3xl"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
              Core functionalities
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              One platform.
              <br />
              Every essential operation.
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              Corestack brings the fundamental systems behind a growing
              business into one place, allowing teams to manage daily
              operations without constantly switching between disconnected
              tools.
            </p>
          </motion.div>

          <motion.div
            {...stagger}
            className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <motion.div
                  key={module.title}
                  variants={fadeUp}
                  className="group bg-black p-7 transition-colors duration-300 hover:bg-white/[0.035]"
                >
                  <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-neutral-400 transition-colors group-hover:border-blue-400/30 group-hover:text-blue-400">
                    <Icon size={18} />
                  </div>

                  <h3 className="text-lg font-medium text-white">
                    {module.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {module.description}
                  </p>

                  <div className="mt-7 flex items-center gap-2 text-xs text-neutral-600 transition-colors group-hover:text-blue-400">
                    <span>Core capability</span>
                    <FiArrowUpRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================== */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

            <motion.div {...fadeUp}>
              <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
                How Corestack works
              </p>

              <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Operations become
                <br />
                a connected flow.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-neutral-400 sm:text-lg">
                Corestack is not simply a collection of management screens.
                The platform is designed so information can move between
                different parts of the business.
              </p>

              <p className="mt-5 max-w-xl text-base leading-7 text-neutral-500">
                A customer creates an order. The order affects inventory. The
                transaction contributes to financial activity. The resulting
                data becomes part of your analytics. Each action contributes
                to a bigger picture.
              </p>
            </motion.div>

            <motion.div
              {...stagger}
              className="space-y-3"
            >
              {[
                ["01", "Capture", "Bring operational activity into one system."],
                ["02", "Connect", "Link customers, products, orders and finance."],
                ["03", "Understand", "Turn operational activity into visibility."],
                ["04", "Act", "Use that visibility to make faster decisions."],
              ].map(([number, title, text]) => (
                <motion.div
                  key={number}
                  variants={fadeUp}
                  className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-blue-400/20 hover:bg-white/[0.04]"
                >
                  <span className="text-sm text-blue-400">{number}</span>

                  <div>
                    <h3 className="font-medium text-white">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-neutral-500">
                      {text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* =========================================================
          PRINCIPLES
      ========================================================== */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

          <motion.div {...fadeUp} className="mb-14">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
              What we believe
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Built around the way
              <br />
              businesses actually operate.
            </h2>
          </motion.div>

          <motion.div
            {...stagger}
            className="grid border-l border-t border-white/10 md:grid-cols-2"
          >
            {principles.map((item) => (
              <motion.div
                key={item.number}
                variants={fadeUp}
                className="border-b border-r border-white/10 p-8 lg:p-10"
              >
                <span className="text-sm text-blue-400">
                  {item.number}
                </span>

                <h3 className="mt-8 text-xl font-medium">
                  {item.title}
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-neutral-500">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          UPCOMING
      ========================================================== */}
      <section className="relative border-b border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.06] blur-[150px]" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">

          <motion.div
            {...fadeUp}
            className="mb-14 max-w-3xl"
          >
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
              What's coming next
            </p>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Corestack is just
              <br />
              getting started.
            </h2>

            <p className="mt-6 text-base leading-relaxed text-neutral-400 sm:text-lg">
              The current platform focuses on bringing your core operations
              together. The next stage is about making those operations
              increasingly intelligent, automated, connected, and easier to
              manage.
            </p>
          </motion.div>

          <motion.div
            {...stagger}
            className="grid gap-4 md:grid-cols-2"
          >
            {upcoming.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="group rounded-2xl border border-white/10 bg-white/[0.025] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-blue-400">
                      <Icon size={18} />
                    </div>

                    <span className="rounded-full border border-blue-400/20 bg-blue-400/5 px-3 py-1 text-[10px] uppercase tracking-wider text-blue-400">
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-8 text-lg font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-3 max-w-lg text-sm leading-6 text-neutral-500">
                    {item.text}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          VISION
      ========================================================== */}
      <section className="relative border-b border-white/10">
        <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:py-40">

          <motion.div {...fadeUp}>
            <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
              Our vision
            </p>

            <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
              Make running a business
              <br />
              <span className="text-neutral-500">
                feel less complicated.
              </span>
            </h2>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-neutral-400 sm:text-lg">
              We believe business software should give people clarity rather
              than create more complexity. Corestack aims to become the
              operational foundation businesses can rely on as they grow—from
              managing everyday activity to understanding the bigger picture
              and eventually automating what comes next.
            </p>
          </motion.div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================== */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center lg:py-36">

          <motion.div {...fadeUp}>
            <div className="mx-auto mb-7 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-blue-400">
              <FiCheck size={20} />
            </div>

            <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Build your operations
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
                on Corestack.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg">
              Bring your products, orders, customers, suppliers, invoices,
              payments, and analytics together in one operating system.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="/auth?mode=signup"
                className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
              >
                Get started
                <FiArrowUpRight size={15} />
              </a>

              <a
                href="/product"
                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-white/30 hover:bg-white/5"
              >
                Explore Corestack
                <FiArrowUpRight size={15} />
              </a>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}