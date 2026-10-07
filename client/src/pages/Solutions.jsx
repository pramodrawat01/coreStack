import React from "react";
import { motion } from "framer-motion";


// ======================================================
// ANIMATIONS
// ======================================================

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeUpLarge = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -24,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const fadeRight = {
  hidden: {
    opacity: 0,
    x: 24,
  },
  visible: {
    opacity: 1,
    x: 0,
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const viewport = {
  once: true,
  amount: 0.2,
};


// ======================================================
// MAIN PAGE
// ======================================================

export default function SolutionsPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] font-sans text-white selection:bg-blue-500/30">

      {/* ==================================================
          BACKGROUND GRID
      ================================================== */}

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-500px)] z-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <main className="relative z-10">

        {/* ==================================================
            1. HERO
        ================================================== */}

        <section className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 pt-32 text-center">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]" />
            </span>

            Corestack 2.0 is Live now : Track Operations & Update
          </motion.div>


          <motion.h1
            variants={fadeUpLarge}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{
              duration: 0.6,
              delay: 0.05,
            }}
            className="mb-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight md:text-7xl"
          >
            <span className="text-blue-500">Consolidate</span> your chaos.
            <br />
            Accelerate your{" "}
            <span className="text-blue-500">growth</span>.
          </motion.h1>


          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="mb-12 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl"
          >
            Get real-time visibility into your inventory, cash flow, and
            customers—all from a single dashboard designed for speed.
          </motion.p>


          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="rounded-md bg-white px-8 py-3 font-semibold text-black transition-colors duration-200 hover:bg-gray-200"
            >
              Get Started
            </motion.button>

            <motion.button
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="rounded-md border border-white/20 bg-transparent px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-white/5"
            >
              Book a Demo
            </motion.button>
          </motion.div>
        </section>


        {/* ==================================================
            2. TRUSTED BY
        ================================================== */}

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          className="border-y border-white/10 bg-white/[0.02] py-10"
        >
          <div className="mx-auto max-w-7xl px-6 text-center">

            <p className="mb-6 text-sm font-medium uppercase tracking-wider text-gray-500">
              Powering operations for modern teams
            </p>

            <motion.div
              variants={stagger}
              className="flex flex-wrap items-center justify-center gap-8 opacity-50 grayscale md:gap-16"
            >
              {[
                "Acme Corp",
                "GlobalTech",
                "NEXUS",
                "Vortex",
              ].map((logo, index) => (
                <motion.div
                  key={logo}
                  variants={fadeUp}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.05,
                  }}
                  className={`text-xl font-bold ${
                    index === 0
                      ? "font-mono"
                      : index === 1
                      ? "font-serif"
                      : "tracking-widest"
                  }`}
                >
                  {logo}
                </motion.div>
              ))}
            </motion.div>

          </div>
        </motion.section>


        {/* ==================================================
            3. CORE SOLUTION PILLARS
        ================================================== */}

        <section className="mx-auto max-w-7xl px-6 py-24">

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              The All-In-One Platform To Run Your Operations.
            </h2>

            <p className="text-lg text-gray-400">
              Stop paying for five different tools. Consolidate your tech stack.
            </p>
          </motion.div>


          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
          >

            {/* Inventory */}
            <motion.div
              variants={fadeUpLarge}
              transition={{ duration: 0.6 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 md:col-span-2"
            >
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] transition-all duration-500 group-hover:bg-blue-500/20" />

              <h3 className="mb-3 text-2xl font-semibold">
                Real-Time Inventory Sync
              </h3>

              <p className="max-w-md text-gray-400">
                Never oversell or stockout again. Corestack syncs your
                warehouse data across all sales channels instantly.
              </p>

              <div className="mt-8 flex h-32 items-center justify-center rounded-lg border border-white/5 bg-black/50">
                <span className="font-mono text-sm text-gray-600">
                  Inventory Graph Placeholder
                </span>
              </div>
            </motion.div>


            {/* Cash Flow */}
            <motion.div
              variants={fadeUpLarge}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8"
            >
              <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-purple-500/10 blur-[60px] transition-all duration-500 group-hover:bg-purple-500/20" />

              <h3 className="relative mb-3 text-xl font-semibold">
                Automated Cash Flow
              </h3>

              <p className="relative text-sm text-gray-400">
                Connect invoices to payments automatically. Get a live view
                of your runway.
              </p>

              <div className="relative mt-8 flex h-32 items-center justify-center rounded-lg border border-white/5 bg-black/50">
                <span className="font-mono text-sm text-gray-600">
                  Cash Flow UI
                </span>
              </div>
            </motion.div>


            {/* CRM */}
            <motion.div
              variants={fadeUpLarge}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8"
            >
              <h3 className="mb-3 text-xl font-semibold">
                Unified CRM
              </h3>

              <p className="text-sm text-gray-400">
                Every order tied to a customer profile. Know exactly who your
                best buyers are.
              </p>
            </motion.div>


            {/* Security */}
            <motion.div
              variants={fadeUpLarge}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.05] to-transparent p-8 md:col-span-2"
            >
              <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] transition-all duration-500 group-hover:bg-emerald-500/20" />

              <h3 className="mb-3 text-2xl font-semibold">
                Enterprise-Grade Security
              </h3>

              <p className="max-w-md text-gray-400">
                SOC2 Type II compliant. Granular role-based access control.
                Your data is encrypted at rest and in transit.
              </p>
            </motion.div>

          </motion.div>
        </section>


        {/* ==================================================
            4. HOW IT WORKS
        ================================================== */}

        <section className="relative border-t border-white/5 bg-black/50 py-24">

          <div className="mx-auto max-w-7xl px-6">

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              transition={{ duration: 0.6 }}
              className="mb-16 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                How it works
              </h2>

              <p className="mx-auto max-w-2xl text-gray-400">
                From purchase order to final payment, Corestack streamlines
                every step of your operational workflow.
              </p>
            </motion.div>


            <div className="space-y-12">

              {/* Step 1 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                className="flex flex-col items-center gap-8 md:flex-row"
              >

                <motion.div
                  variants={fadeLeft}
                  transition={{ duration: 0.6 }}
                  className="w-full p-8 md:w-1/2"
                >
                  <div className="mb-2 font-mono text-sm text-blue-500">
                    01 — INGEST
                  </div>

                  <h3 className="mb-4 text-2xl font-bold">
                    Connect your data sources
                  </h3>

                  <p className="text-gray-400">
                    Integrate seamlessly with Shopify, Amazon, QuickBooks,
                    and your existing WMS. Data flows in automatically
                    without manual CSV uploads.
                  </p>
                </motion.div>


                <motion.div
                  variants={fadeRight}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="flex h-64 w-full items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a] md:w-1/2"
                >
                  <span className="font-mono text-gray-600">
                    Integration UI Placeholder
                  </span>
                </motion.div>

              </motion.div>


              {/* Step 2 */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                className="flex flex-col items-center gap-8 md:flex-row-reverse"
              >

                <motion.div
                  variants={fadeRight}
                  transition={{ duration: 0.6 }}
                  className="w-full p-8 md:w-1/2"
                >
                  <div className="mb-2 font-mono text-sm text-blue-500">
                    02 — PROCESS
                  </div>

                  <h3 className="mb-4 text-2xl font-bold">
                    Automate the busywork
                  </h3>

                  <p className="text-gray-400">
                    Set custom rules for reordering, invoicing, and customer
                    notifications. Corestack acts as your operational
                    autopilot.
                  </p>
                </motion.div>


                <motion.div
                  variants={fadeLeft}
                  transition={{ duration: 0.6, delay: 0.08 }}
                  className="flex h-64 w-full items-center justify-center rounded-xl border border-white/10 bg-[#0a0a0a] md:w-1/2"
                >
                  <span className="font-mono text-gray-600">
                    Automation Rules UI
                  </span>
                </motion.div>

              </motion.div>

            </div>
          </div>
        </section>


        {/* ==================================================
            5. METRICS
        ================================================== */}

        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={stagger}
          className="border-t border-white/10 bg-white/[0.02] py-20"
        >

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 text-center md:grid-cols-3">

            <motion.div
              variants={fadeUpLarge}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
                99.9%
              </div>

              <div className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Uptime SLA
              </div>
            </motion.div>


            <motion.div
              variants={fadeUpLarge}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
                10M+
              </div>

              <div className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Orders Processed
              </div>
            </motion.div>


            <motion.div
              variants={fadeUpLarge}
              transition={{ duration: 0.6, delay: 0.16 }}
            >
              <div className="mb-2 text-4xl font-bold text-white md:text-5xl">
                30%
              </div>

              <div className="text-sm font-medium uppercase tracking-wider text-gray-400">
                Avg. OpEx Reduction
              </div>
            </motion.div>

          </div>
        </motion.section>


        {/* ==================================================
            6. FINAL CTA
        ================================================== */}

        <section className="px-6 py-32">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.25,
            }}
            variants={fadeUpLarge}
            transition={{ duration: 0.7 }}
            className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-b from-blue-900/20 to-black p-12 text-center"
          >

            <div className="absolute left-1/2 top-0 h-32 w-full -translate-x-1/2 bg-blue-500/20 blur-[100px]" />


            <motion.h2
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="relative z-10 mb-6 text-3xl font-bold md:text-5xl"
            >
              Ready to consolidate your stack?
            </motion.h2>


            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="relative z-10 mb-10 text-lg text-gray-400"
            >
              Join the modern businesses running their entire operation on
              Corestack.
            </motion.p>


            <motion.div
              variants={stagger}
              className="relative z-10 flex flex-col justify-center gap-4 sm:flex-row"
            >

              <motion.button
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                className="rounded-md bg-blue-600 px-8 py-3 font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-colors duration-200 hover:bg-blue-500"
              >
                Get Started for Free
              </motion.button>

              <motion.button
                variants={fadeUp}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="rounded-md border border-white/20 bg-transparent px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-white/5"
              >
                Talk to Sales
              </motion.button>

            </motion.div>

          </motion.div>
        </section>

      </main>
    </div>
  );
}