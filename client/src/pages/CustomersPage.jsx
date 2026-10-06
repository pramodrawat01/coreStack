import { motion, AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";import {
  FiArrowUpRight,
  FiUsers,
  FiPackage,
  FiDollarSign,
  FiShoppingBag,
  FiActivity,
  FiCheck,
  FiMapPin,
  FiBox,
  FiBarChart2,
  FiEye,
  FiShoppingCart,
  FiTruck,
} from "react-icons/fi";
import LogoMarquee from "../components/common/LogoMarquee";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const customerLogos = [
  "Northstar Retail Group",
  "Acme Components",
  "Meridian Office Co.",
  "Harbor Market",
  "Atlas Industrial",
];

// use along with logoes
// const customerLogos = [
//   {
//     label: "Northstar Retail Group",
//     logo: "/logos/northstar.svg",
//   },
//   {
//     label: "Acme Components",
//     logo: "/logos/acme.svg",
//   },
//   {
//     label: "Meridian Office Co.",
//     logo: "/logos/meridian.svg",
//   },
//   {
//     label: "Harbor Market",
//     logo: "/logos/harbor.svg",
//   },
//   {
//     label: "Atlas Industrial",
//     logo: "/logos/atlas.svg",
//   },
// ];

const useCases = [
  {
    icon: FiPackage,
    title: "Multi-location operations",
    description:
      "Give every location a shared view of inventory, orders, customers, and operational performance.",
  },
  {
    icon: FiShoppingBag,
    title: "High-volume commerce",
    description:
      "Keep customer demand, fulfillment, and inventory connected as order volume grows.",
  },
  {
    icon: FiUsers,
    title: "Enterprise accounts",
    description:
      "Manage complex customer relationships with the operational context your teams need.",
  },
];

const metrics = [
  {
    value: "98.4%",
    label: "Fulfillment visibility",
  },
  {
    value: "14",
    label: "Locations connected",
  },
  {
    value: "2,840",
    label: "Orders in motion",
  },
  {
    value: "31%",
    label: "Faster operations",
  },
];

export default function Customers() {

    const sectionRef = useRef(null);
    const [activeStep, setActiveStep] = useState(0);
    const [direction, setDirection] = useState(1);

    const leftContent = [
    {
        label: "ONE CUSTOMER, COMPLETE CONTEXT",
        title: (
        <>
            From first order
            <br />
            to long-term account.
        </>
        ),
        description:
        "Corestack connects the entire customer lifecycle so your teams don't have to reconstruct context every time they interact.",
    },

    {
        label: "ORDERS THAT STAY CONNECTED",
        title: (
        <>
            From demand
            <br />
            to fulfillment.
        </>
        ),
        description:
        "Connect every order directly to inventory, warehouses and fulfillment so your team always knows what happens next.",
    },

    {
        label: "EVERY PAYMENT IN CONTEXT",
        title: (
        <>
            Know what is
            <br />
            owed and why.
        </>
        ),
        description:
        "Keep invoices, payments and outstanding balances connected to the customer and the underlying operational activity.",
    },

    {
        label: "RELATIONSHIPS THAT GROW",
        title: (
        <>
            Turn history
            <br />
            into opportunity.
        </>
        ),
        description:
        "Use the complete operational history of every account to identify opportunities and build stronger customer relationships.",
    },
    ];

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(
        3,
        Math.floor(latest * 4)
    );

    if (step !== activeStep) {
        setDirection(step > activeStep ? 1 : -1);
        setActiveStep(step);
    }
});
  return (
    <main className="min-h-screen bg-black text-white">
      {/* =====================================================
          1. HERO
      ===================================================== */}

      <section className="relative border-b border-white/10 overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 85%)",
          }}
        />

        {/* Blue glow */}
        <div className="absolute left-1/2 top-32 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[130px]" />

        <div className="relative mx-auto max-w-5xl px-6 pb-24 pt-20 text-center lg:pt-28">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.5,
            }}
            className="mb-7 text-xs font-medium uppercase tracking-[0.28em] text-blue-500"
          >
            TRUSTED BY OPERATORS
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              delay: 0.05,
            }}
            className="text-5xl font-semibold leading-[0.95] tracking-[-0.055em] sm:text-6xl lg:text-7xl"
          >
            The teams moving business
            <br />
            forward run on <span className="text-blue-500">Corestack.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg"
          >
            From growing distributors to multi-location enterprises, operators
            use Corestack to turn complexity into momentum.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
            }}
            className="mt-9 flex justify-center gap-3"
          >
            <a
              href="#stories"
              className="rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              See customer stories
            </a>

            <a
              href="#contact"
              className="rounded-md border border-white/20 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5"
            >
              Talk to sales
            </a>
          </motion.div>

          {/* Logo marquee */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="mt-20"
          >
            <LogoMarquee items={customerLogos} speed={35} />
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          2. CUSTOMER COMMAND CENTER
      ===================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-12"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
              CUSTOMER COMMAND CENTER
            </div>

            <div className="mt-5 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <h2 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Every customer.
                <br />
                Every detail. Connected.
              </h2>

              <p className="max-w-md text-sm leading-6 text-slate-500">
                Give your teams the context they need before every conversation,
                order, and decision.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="overflow-hidden rounded-2xl border border-white/15 bg-[#08090b]"
          >
            {/* top bar */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <FiUsers size={15} />
                </div>

                <div>
                  <div className="text-xs font-medium text-white">
                    Northstar Retail Group
                  </div>
                  <div className="text-[10px] text-neutral-600">
                    Enterprise customer
                  </div>
                </div>
              </div>

              <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[9px] text-emerald-400">
                Active account
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.4fr]">
              {/* customer information */}
              <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
                <div className="text-[10px] uppercase tracking-[0.15em] text-neutral-600">
                  Account overview
                </div>

                <div className="mt-8">
                  <div className="text-2xl font-semibold text-white">
                    Northstar Retail Group
                  </div>

                  <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                    <FiMapPin size={12} />
                    14 operating locations
                  </div>
                </div>

                <div className="mt-10 grid grid-cols-2 gap-3">
                  {[
                    ["Revenue", "$842K"],
                    ["Orders", "2,840"],
                    ["Locations", "14"],
                    ["Open issues", "08"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-white/10 bg-white/[0.025] p-4"
                    >
                      <div className="text-[9px] text-neutral-600">{label}</div>

                      <div className="mt-2 text-lg font-medium text-white">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* activity */}
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-white">
                    Recent activity
                  </div>

                  <span className="text-[10px] text-neutral-600">Live</span>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["Order #CS-8421", "Fulfillment completed", "2 min ago"],
                    ["Warehouse #04", "Inventory replenished", "18 min ago"],
                    ["Invoice #INV-2841", "Payment received", "42 min ago"],
                    [
                      "Customer request",
                      "Priority account updated",
                      "1 hr ago",
                    ],
                  ].map(([title, description, time]) => (
                    <div
                      key={title}
                      className="flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.02] p-4"
                    >
                      <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-white">
                          {title}
                        </div>

                        <div className="mt-1 text-[10px] text-neutral-600">
                          {description}
                        </div>
                      </div>

                      <div className="text-[9px] text-neutral-700">{time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          3. ONE CUSTOMER COMPLETE CONTEXT
      ===================================================== */}

      <section 
        ref={sectionRef}
        className="relative lg:min-h-[400vh] border-b border-white/10">
        <div className="lg:sticky lg:top-20">
            <div className="mx-auto max-w-7xl  border-white px-6 py-28 lg:px-10">

                <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
                    {/* <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    >
                        <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
                            ONE CUSTOMER, COMPLETE CONTEXT
                        </div>

                        <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                            From first order
                            <br />
                            to long-term account.
                        </h2>

                        <p className="mt-6 max-w-md text-base leading-7 text-slate-500">
                            Corestack connects the entire customer lifecycle so your teams
                            don't have to reconstruct context every time they interact.
                        </p>
                    </motion.div> */}
                    {/*** left section */}
                    <div className="relative min-h-[300px]">

                       <AnimatePresence mode="wait" custom={direction}>
    <motion.div
        key={activeStep}
        custom={direction}
        variants={{
            initial: (direction) => ({
                opacity: 0,
                y: direction === 1 ? 30 : -30,
            }),

            animate: {
                opacity: 1,
                y: 0,
            },

            exit: (direction) => ({
                opacity: 0,
                y: direction === 1 ? -30 : 30,
            }),
        }}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute inset-0"
    >

                                <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
                                    {leftContent[activeStep].label}
                                </div>

                                <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                                    {leftContent[activeStep].title}
                                </h2>

                                <p className="mt-6 max-w-md text-base leading-7 text-slate-500">
                                    {leftContent[activeStep].description}
                                </p>

                            </motion.div>

                        </AnimatePresence>
                    </div>

                    { /** right section */}
                    <div
                    variants={stagger}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="space-y-3"
                    >
                    {/* {[
                        [
                        "01",
                        "Customer acquisition",
                        "Capture the account, contacts, requirements and commercial context.",
                        ],
                        [
                        "02",
                        "Orders & fulfillment",
                        "Connect customer demand directly to inventory and fulfillment.",
                        ],
                        [
                        "03",
                        "Payments & invoices",
                        "Track billing, payments and outstanding balances without leaving the account.",
                        ],
                        [
                        "04",
                        "Account growth",
                        "Use operational history to identify opportunities and strengthen relationships.",
                        ],
                     ].map(([number, title, description]) => (
                        <motion.div
                        key={number}
                        variants={fadeUp}
                        className="group grid grid-cols-[55px_1fr] rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-blue-500/30 hover:bg-blue-500/[0.025]"
                        >
                        <div className="text-lg font-medium text-blue-500">
                            {number}
                        </div>

                        <div>
                            <h3 className="text-base font-medium text-white">
                            {title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                            {description}
                            </p>
                        </div>
                        </motion.div>
                    ))} */}

                    {[
                        [
                            "01",
                            "Customer acquisition",
                            "Capture the account, contacts, requirements and commercial context.",
                        ],
                        [
                            "02",
                            "Orders & fulfillment",
                            "Connect customer demand directly to inventory and fulfillment.",
                        ],
                        [
                            "03",
                            "Payments & invoices",
                            "Track billing, payments and outstanding balances without leaving the account.",
                        ],
                        [
                            "04",
                            "Account growth",
                            "Use operational history to identify opportunities and strengthen relationships.",
                        ],
                        ].map(([number, title, description], index) => {
                        const isActive = activeStep === index;

                        return (
                            <motion.div
                            key={number}
                            variants={fadeUp}
                            // className={`
                            //     group
                            //     grid
                            //     grid-cols-[55px_1fr]
                            //     rounded-xl
                            //     border
                            //     p-6
                            //     transition-all
                            //     duration-500

                            //     ${
                            //     isActive
                            //         ? "border-blue-500/50 bg-blue-500/[0.06] shadow-[0_0_30px_rgba(59,130,246,0.06)]"
                            //         : "border-white/10 bg-white/[0.02]"
                            //     }
                            // `}
                            className={`
                                relative
                                grid
                                grid-cols-[55px_1fr]
                                rounded-xl
                                border
                                p-6
                                transition-all
                                duration-500

                                ${
                                    isActive
                                    ? `
                                        border-blue-500/50
                                        bg-blue-500/[0.055]
                                        shadow-[0_0_35px_rgba(59,130,246,0.07)]
                                    `
                                    : `
                                        border-white/10
                                        bg-white/[0.015]
                                    `
                                }
                                `}
                            >
                            {/* Number */}
                            <div
                                className={`
                                text-lg
                                font-medium
                                transition-all
                                duration-500
                                ${
                                    isActive
                                    ? "text-blue-400"
                                    : "text-slate-600"
                                }
                                `}
                            >
                                {number}
                            </div>

                            {/* Content */}
                            <div>
                                <h3
                                className={`
                                    text-base
                                    font-medium
                                    transition-all
                                    duration-500
                                    ${
                                    isActive
                                        ? "text-white"
                                        : "text-slate-300"
                                    }
                                `}
                                >
                                {title}
                                </h3>

                                <p
                                className={`
                                    mt-2
                                    text-sm
                                    leading-6
                                    transition-all
                                    duration-500
                                    ${
                                    isActive
                                        ? "text-slate-400"
                                        : "text-slate-600"
                                    }
                                `}
                                >
                                {description}
                                </p>
                            </div>

                            {/* Active indicator */}
                            <motion.div
                                initial={false}
                                animate={{
                                opacity: isActive ? 1 : 0,
                                scaleX: isActive ? 1 : 0,
                                }}
                                transition={{ duration: 0.35 }}
                                className="absolute left-0 top-[30%] h-10 w-[2px]  origin-left rounded-full bg-blue-500"
                            />
                        </motion.div>
                        );
                        })}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* =====================================================
          4. BUILT FOR EVERY RELATIONSHIP
      ===================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
              BUILT FOR EVERY RELATIONSHIP
            </div>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Designed around
              <br />
              how operators work.
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-500">
              Whether you're managing dozens of accounts or thousands of orders,
              Corestack keeps your customer operation connected.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-16 grid gap-4 md:grid-cols-3"
          >
            {useCases.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="min-h-[330px] rounded-xl border border-white/10 bg-[#08090b] p-7 transition hover:border-blue-500/30"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    <Icon size={19} />
                  </div>

                  <h3 className="mt-16 text-xl font-medium">{item.title}</h3>

                  <p className="mt-4 text-sm leading-7 text-slate-500">
                    {item.description}
                  </p>

                  <div className="mt-8 flex items-center gap-2 text-xs text-blue-500">
                    Explore use case
                    <FiArrowUpRight size={13} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          5. CUSTOMER IMPACT
      ===================================================== */}

      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
                THE CUSTOMER IMPACT
              </div>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Better visibility.
                <br />
                Better decisions.
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-slate-500">
                When your teams work from the same operational truth, small
                improvements compound into measurable business outcomes.
              </p>
            </div>

            <motion.div variants={stagger} className="grid grid-cols-2 gap-3">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.label}
                  variants={fadeUp}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
                >
                  <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {metric.value}
                  </div>

                  <div className="mt-3 text-xs text-neutral-500">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          6. CUSTOMER STORIES
      ===================================================== */}

      {/* =====================================================
    CUSTOMER STORIES
===================================================== */}

      <section id="stories" className="relative border-b border-white/10">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-500/[0.04] blur-[120px]" />

          <div className="absolute right-[5%] bottom-[10%] h-[350px] w-[350px] rounded-full bg-indigo-500/[0.04] blur-[120px]" />

          {/* subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `
          linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
        `,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10">
          {/* =================================================
        SECTION HEADER
    ================================================= */}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-blue-500">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                CUSTOMER STORIES
              </div>

              <h2 className="mt-5 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
                Proof from the
                <br />
                <span className="text-neutral-400">operating floor.</span>
              </h2>
            </div>

            <p className="max-w-sm text-sm leading-6 text-neutral-500">
              See how operators use Corestack to connect their teams, eliminate
              operational blind spots, and move faster.
            </p>
          </motion.div>

          {/* =================================================
        FEATURED CUSTOMER
    ================================================= */}

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
        relative
        mt-14
        overflow-hidden
        rounded-2xl
        border
        border-white/10
        bg-[#080d18]
      "
          >
            {/* blue glow */}
            <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[120px]" />

            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              {/* =================================================
            LEFT STORY
        ================================================= */}

              <div className="relative z-10 flex flex-col justify-between border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.22em] text-blue-400">
                    NORTHSTAR RETAIL GROUP
                  </div>

                  <h3 className="mt-8 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                    From disconnected data
                    <br />
                    to unified operations.
                  </h3>

                  <p className="mt-6 max-w-lg text-sm leading-7 text-neutral-400 sm:text-base">
                    A single operational view helped Northstar coordinate
                    inventory, fulfillment, and decisions across every location.
                  </p>
                </div>

                {/* metrics */}
                <div className="mt-12 grid grid-cols-3 gap-4 border-y border-white/10 py-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <FiBox size={14} />
                      </div>

                      <span className="text-sm font-medium text-white">
                        faster
                      </span>
                    </div>

                    <p className="mt-2 pl-10 text-[10px] text-neutral-500">
                      fulfillment
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                        <FiBarChart2 size={14} />
                      </div>

                      <span className="text-sm font-medium text-white">
                        lower
                      </span>
                    </div>

                    <p className="mt-2 pl-10 text-[10px] text-neutral-500">
                      stockouts
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                        <FiEye size={14} />
                      </div>

                      <span className="text-sm font-medium text-white">
                        better
                      </span>
                    </div>

                    <p className="mt-2 pl-10 text-[10px] text-neutral-500">
                      visibility
                    </p>
                  </div>
                </div>

                <button
                  className="
              mt-8
              flex
              w-fit
              items-center
              gap-2
              text-sm
              font-medium
              text-blue-400
              transition
              hover:text-blue-300
            "
                >
                  Read the story
                  <FiArrowUpRight size={15} />
                </button>
              </div>

              {/* =================================================
            RIGHT DASHBOARD VISUAL
        ================================================= */}

              <div className="relative min-h-[480px] overflow-hidden bg-gradient-to-br from-[#123da0] via-[#102f82] to-[#061326] p-6 sm:p-10">
                {/* grid */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage: `
                linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
              `,
                    backgroundSize: "45px 45px",
                  }}
                />

                {/* glow */}
                <div className="absolute left-1/2 top-1/2 h-[300px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 blur-[100px]" />

                {/* dashboard */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.15,
                    duration: 0.8,
                  }}
                  className="
              relative
              z-10
              mx-auto
              mt-5
              max-w-[560px]
              rounded-xl
              border
              border-white/20
              bg-[#07152f]/95
              p-5
              shadow-2xl
              shadow-black/40
              backdrop-blur-xl
            "
                >
                  {/* dashboard header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                        <FiActivity size={15} />
                      </div>

                      <span className="text-sm font-medium text-white">
                        Operational dashboard
                      </span>
                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-[9px] font-medium text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      Live
                    </div>
                  </div>

                  {/* stats */}
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      ["Fulfillment", "98.4%", "+12%"],
                      ["Locations", "14", "+2"],
                      ["In motion", "2,840", "+18%"],
                    ].map(([label, value, growth]) => (
                      <div
                        key={label}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.055] p-3"
                      >
                        <div className="text-[9px] text-neutral-500">
                          {label}
                        </div>

                        <div className="mt-3 flex items-end justify-between gap-2">
                          <span className="text-lg font-semibold text-white">
                            {value}
                          </span>

                          <span className="text-[8px] text-emerald-400">
                            ↑ {growth.replace("+", "")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* chart */}
                  <div className="mt-4 rounded-lg border border-white/[0.08] bg-white/[0.025] p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-medium text-white">
                          Orders in motion
                        </div>

                        <div className="mt-1 text-[9px] text-neutral-600">
                          Last 30 days
                        </div>
                      </div>

                      <div className="text-[9px] text-neutral-500">View →</div>
                    </div>

                    <div className="mt-8 flex h-32 items-end gap-2">
                      {[32, 48, 40, 62, 55, 76, 68, 88, 72, 96, 82, 100].map(
                        (height, index) => (
                          <motion.div
                            key={index}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.6,
                              delay: 0.2 + index * 0.04,
                            }}
                            className="
                        flex-1
                        rounded-t-sm
                        bg-gradient-to-t
                        from-blue-700
                        to-blue-400
                      "
                          />
                        ),
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* floating card - left */}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="
              absolute
              bottom-20
              left-5
              z-20
              hidden
              rounded-lg
              border
              border-white/15
              bg-[#07152f]/90
              p-3
              shadow-xl
              backdrop-blur-xl
              sm:block
            "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <FiTruck size={15} />
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-white">
                        Orders in motion
                      </div>

                      <div className="mt-1 text-[9px] text-neutral-500">
                        228 shipments
                      </div>
                    </div>

                    <span className="ml-3 h-1.5 w-1.5 rounded-full bg-blue-400" />
                  </div>
                </motion.div>

                {/* floating card - right */}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.65 }}
                  className="
              absolute
              right-5
              top-20
              z-20
              hidden
              rounded-lg
              border
              border-white/15
              bg-[#07152f]/90
              p-3
              shadow-xl
              backdrop-blur-xl
              sm:block
            "
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <FiBox size={15} />
                    </div>

                    <div>
                      <div className="text-[10px] font-medium text-white">
                        Inventory synchronized
                      </div>

                      <div className="mt-1 text-[9px] text-neutral-500">
                        All 14 locations
                      </div>
                    </div>

                    <span className="ml-3 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* =================================================
        SMALL CUSTOMER STORIES
    ================================================= */}

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-4 grid gap-4 md:grid-cols-3"
          >
            {/* ACME */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="
          group
          relative
          min-h-[300px]
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-gradient-to-br
          from-[#0b1220]
          to-[#05070b]
          p-7
        "
            >
              <div className="absolute bottom-[-70px] right-[-50px] h-48 w-48 rounded-full bg-blue-500/10 blur-[70px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                    ACME COMPONENTS
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                    <FiBox size={15} />
                  </div>
                </div>

                <div className="mt-16">
                  <div className="text-4xl font-semibold tracking-tight text-white">
                    31%
                  </div>

                  <div className="mt-1 text-sm text-blue-400">
                    faster processing
                  </div>

                  <p className="mt-4 text-xs leading-6 text-neutral-500">
                    Reduced order processing time with real-time inventory and
                    automated workflows.
                  </p>
                </div>

                <button className="mt-7 flex items-center gap-2 text-xs font-medium text-blue-400 transition group-hover:text-blue-300">
                  Read customer story
                  <FiArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>

            {/* HARBOR */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="
          group
          relative
          min-h-[300px]
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-gradient-to-br
          from-[#0c1020]
          to-[#05070b]
          p-7
        "
            >
              <div className="absolute bottom-[-80px] right-[-50px] h-52 w-52 rounded-full bg-purple-500/10 blur-[80px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                    HARBOR MARKET
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10 text-purple-400">
                    <FiShoppingCart size={15} />
                  </div>
                </div>

                <div className="mt-16">
                  <div className="text-4xl font-semibold tracking-tight text-white">
                    24%
                  </div>

                  <div className="mt-1 text-sm text-purple-400">
                    faster replenishment
                  </div>

                  <p className="mt-4 text-xs leading-6 text-neutral-500">
                    Improved stock accuracy across multiple locations and
                    seasonal demand peaks.
                  </p>
                </div>

                <button className="mt-7 flex items-center gap-2 text-xs font-medium text-purple-400 transition group-hover:text-purple-300">
                  Read customer story
                  <FiArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>

            {/* MERIDIAN */}
            <motion.div
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="
          group
          relative
          min-h-[300px]
          overflow-hidden
          rounded-xl
          border
          border-white/10
          bg-gradient-to-br
          from-[#0b1518]
          to-[#05070b]
          p-7
        "
            >
              <div className="absolute bottom-[-80px] right-[-50px] h-52 w-52 rounded-full bg-emerald-500/10 blur-[80px]" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
                    MERIDIAN OFFICE CO.
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <FiActivity size={15} />
                  </div>
                </div>

                <div className="mt-16">
                  <div className="text-4xl font-semibold tracking-tight text-white">
                    18%
                  </div>

                  <div className="mt-1 text-sm text-emerald-400">
                    fewer exceptions
                  </div>

                  <p className="mt-4 text-xs leading-6 text-neutral-500">
                    Connected orders, invoices, and payments for a smoother
                    customer experience.
                  </p>
                </div>

                <button className="mt-7 flex items-center gap-2 text-xs font-medium text-emerald-400 transition group-hover:text-emerald-300">
                  Read customer story
                  <FiArrowUpRight size={13} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =====================================================
          7. QUOTE + CTA
      ===================================================== */}

      <section id="contact">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="border-y border-white/10 py-20 text-center"
          >
            <div className="mx-auto max-w-4xl text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl lg:text-4xl">
              “We stopped asking which system had the answer. Corestack made the
              answer available to everyone.”
            </div>

            <div className="mt-6 text-xs text-neutral-600">
              Jordan Lee, VP Operations, Northstar Retail Group
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-10 overflow-hidden rounded-xl bg-[#0a1832] p-8 sm:p-10"
          >
            <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
                  Join the operators who move with confidence.
                </h2>

                <p className="mt-3 text-sm text-slate-400">
                  Bring your customer operation into one connected system.
                </p>
              </div>

              <div className="flex shrink-0 gap-3">
                <a
                  href="/auth?mode=signup"
                  className="rounded-md bg-white px-5 py-3 text-sm font-medium text-black hover:bg-neutral-200"
                >
                  Get started
                </a>

                <button className="rounded-md border border-white/30 px-5 py-3 text-sm font-medium text-white hover:bg-white/5">
                  Book a demo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
