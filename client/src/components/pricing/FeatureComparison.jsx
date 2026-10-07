


import { motion } from "framer-motion";
import { FaBoxes, FaChartLine, FaBolt, FaHeadset } from "react-icons/fa";
import ComparisonValue from "./ComparisonValue";
import MobileComparisonSection from "./MobileComparisonSection";

const PLANS = [
  { name: "Free", cta: "Get started" },
  { name: "Standard", cta: "Get started" },
  { name: "Teams", cta: "Get started", highlight: true },
  { name: "Enterprise", cta: "Talk to sales" },
];

// Row = [label, free, standard, teams, enterprise]
// true = check, false = dash, string = shown as text
const COMPARISON = [
  {
    category: "Operations",
    icon: FaBoxes,
    features: [
      ["Orders per month", "100", "1,000", "10,000", "Unlimited"],
      ["Warehouses", "1", "3", "10", "Unlimited"],
      ["Inventory management", "Basic", true, true, true],
      ["Order management & fulfillment", false, true, true, true],
      ["Customer management", false, true, true, true],
      ["Supplier management", false, false, true, true],
    ],
  },
  {
    category: "Analytics",
    icon: FaChartLine,
    features: [
      ["Basic analytics", true, true, true, true],
      ["Advanced analytics", false, "Add-on", true, true],
      ["Business insights", false, false, true, true],
      ["Custom reports", false, false, false, true],
    ],
  },
  {
    category: "Automation",
    icon: FaBolt,
    features: [
      ["Automated notifications", false, true, true, true],
      ["Workflow automation", false, false, true, true],
      ["API access", false, false, true, true],
      ["Custom workflows", false, false, false, true],
      ["Custom integrations", false, false, false, true],
    ],
  },
  {
    category: "Support",
    icon: FaHeadset,
    features: [
      ["Help center", true, true, true, true],
      ["Email support", false, true, true, true],
      ["Priority support", false, false, true, true],
      ["Advanced permissions", false, false, true, true],
      ["Dedicated account manager", false, false, false, true],
      ["Custom onboarding", false, false, false, true],
      ["SLA guarantee", false, false, false, true],
    ],
  },
];

const GRID = "grid grid-cols-[1.6fr_repeat(4,1fr)] gap-x-1.5";

export default function FeatureComparison() {
  return (
    <section className="border-b border-white/10 ">
      <div className="mx-auto max-w-[1200px] px-6 py-24 lg:px-10 ">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-500">
            COMPARE PLANS
          </p>
          <h2 className="mt-5 font-serif text-4xl tracking-tight text-white sm:text-5xl">
            Compare features
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-500">
            A detailed breakdown of what's included across Corestack plans.
          </p>
        </motion.div>

        {/* Desktop */}
        <div className="hidden md:block">
          {COMPARISON.map((section, i) => {
            const Icon = section.icon;

            return (
              <div key={section.category} className={i > 0 ? "mt-14" : ""}>

                {/* Category header (plan names + CTAs only on the first one) */}
                <div className={`${GRID} items-end pb-4`}>
                  <div className="flex items-center gap-2.5 pb-1.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                      <Icon size={13} />
                    </span>
                    <h3 className="text-lg font-semibold text-white">
                      {section.category}
                    </h3>
                  </div>

                  {i === 0 &&
                    PLANS.map((plan) => (
                      <div key={plan.name} className="text-center">
                        <p className="mb-3 text-sm font-medium text-white">
                          {plan.name}
                        </p>
                        <button
                          type="button"
                          className={`w-full rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                            plan.highlight
                              ? "border-transparent bg-white text-[#0b1220] hover:bg-slate-200"
                              : "border-white/20 bg-white/[0.03] text-white hover:bg-white/10"
                          }`}
                        >
                          {plan.cta}
                        </button>
                      </div>
                    ))}
                </div>

                {/* Rows */}
                {section.features.map(([label, ...values]) => (
                  <div key={label} className={GRID}>
                    <div className="flex items-center border-t border-white/[0.06] py-4 pr-4 text-xs text-slate-300">
                      <span className="underline decoration-white/25 decoration-dotted underline-offset-4">
                        {label}
                      </span>
                    </div>

                    {values.map((value, idx) => (
                      <ComparisonValue
                        key={idx}
                        value={value}
                        highlight={PLANS[idx].highlight}
                      />
                    ))}
                  </div>
                ))}

                <div className="border-t border-white/[0.06]" />
              </div>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="space-y-3 md:hidden">
          {COMPARISON.map((section) => (
            <MobileComparisonSection
              key={section.category}
              section={section}
              plans={PLANS}
            />
          ))}
        </div>
      </div>
    </section>
  );
}