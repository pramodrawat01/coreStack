import { useState } from "react";
import { motion } from "framer-motion";
import BillingToggle from "./BillingToggle";
import PricingCard from "./PricingCard";
import { FaBoxes, FaUsers, FaChartLine, FaHeadset, FaPlug } from "react-icons/fa";

// ======================================================
// PRICING DATA
// ======================================================

// const TIERS = [
//   {
//     name: "Free",

//     description:
//       "Perfect for individuals and small teams getting started with Corestack.",

//     monthly: 0,
//     yearly: 0,

//     priceLabel: "Always free",

//     features: [
//       "Up to 100 orders / month",
//       "1 warehouse",
//       "Basic inventory management",
//       "Basic analytics",
//       "Community support",
//     ],

//     cta: "Get started",

//     highlight: false,

//     addon: false,
//   },

//   {
//     name: "Standard",

//     description:
//       "For growing businesses that need more control over their operations.",

//     monthly: 49,
//     yearly: 39,

//     features: [
//       "Up to 1,000 orders / month",
//       "3 warehouses",
//       "Inventory management",
//       "Orders & fulfillment",
//       "Customer management",
//       "Standard support",
//     ],

//     cta: "Get started",

//     highlight: false,

//     addon: true,

//     addonLabel: "Add advanced analytics",
//   },

//   {
//     name: "Teams",

//     description:
//       "For scaling businesses that need automation and deeper operational insights.",

//     monthly: 99,
//     yearly: 79,

//     features: [
//       "Up to 10,000 orders / month",
//       "10 warehouses",
//       "Advanced analytics",
//       "Automation workflows",
//       "API access",
//       "Priority support",
//       "Advanced permissions",
//     ],

//     cta: "Get started",

//     highlight: true,

//     addon: true,

//     addonLabel: "Add advanced analytics",
//   },

//   {
//     name: "Enterprise",

//     description:
//       "Custom infrastructure and dedicated support for large-scale operations.",

//     monthly: null,
//     yearly: null,

//     priceLabel: "Custom",

//     enterprisePrefix: "Starts at",

//     enterprisePrice: "$15k",

//     enterprisePeriod: "/yr",

//     features: [
//       "Unlimited orders",
//       "Unlimited warehouses",
//       "Custom integrations",
//       "Advanced permissions",
//       "Dedicated account manager",
//       "Custom onboarding",
//       "SLA guarantee",
//     ],

//     cta: "Talk to sales",

//     highlight: false,

//     addon: false,
//   },
// ];
const TIERS = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    cta: "Get started",
    highlight: false,
    addon: false,
    includesLabel: "Includes:",
    groups: [
      {
        title: "Operations",
        icon: FaBoxes,
        tone: "blue",
        items: [
          "Up to 100 orders / month",
          "1 warehouse",
          "Basic inventory management",
          "Basic analytics",
          "Community support",
        ],
      },
    ],
  },
  {
    name: "Standard",
    monthly: 49,
    yearly: 39,
    cta: "Get started",
    highlight: false,
    addon: true,
    addonLabel: "Add advanced analytics",
    includesLabel: "Everything in Free, and:",
    groups: [
      {
        title: "Operations",
        icon: FaBoxes,
        tone: "blue",
        items: [
          "Up to 1,000 orders / month",
          "3 warehouses",
          "Inventory management",
          "Orders & fulfillment",
        ],
      },
      {
        title: "Customers",
        icon: FaUsers,
        tone: "teal",
        items: ["Customer management", "Standard support"],
      },
      {
        title: "Analytics",
        icon: FaChartLine,
        tone: "violet",
        addon: true,
        items: ["Advanced analytics"],
      },
    ],
  },
  {
    name: "Teams",
    monthly: 99,
    yearly: 79,
    cta: "Get started",
    highlight: true,
    addon: true,
    addonLabel : "Add Analytics and Callie" ,
    includesLabel: "Everything in Standard, and:",
    groups: [
      {
        title: "Operations",
        icon: FaBoxes,
        tone: "blue",
        items: [
          "Up to 10,000 orders / month",
          "10 warehouses",
          "Automation workflows",
          "API access",
        ],
      },
      {
        title: "Analytics",
        icon: FaChartLine,
        tone: "violet",
        items: ["Advanced analytics"],
      },
      {
        title: "Support & security",
        icon: FaHeadset,
        tone: "teal",
        items: ["Priority support", "Advanced permissions"],
      },
      {
        title: "Custom setup",
        icon: FaPlug,
        tone: "lime",
        disabled: true,
        items: ["Custom integrations", "SLA guarantee"],
      },
    ],
  },
  {
    name: "Enterprise",
    monthly: null,
    yearly: null,
    enterprisePrefix: "Starts at",
    enterprisePrice: "$15k",
    enterprisePeriod: "/yr",
    cta: "Talk to sales",
    highlight: false,
    addon: false,
    includesLabel: "Everything in Teams, and:",
    groups: [
      {
        title: "Operations",
        icon: FaBoxes,
        tone: "blue",
        items: ["Unlimited orders", "Unlimited warehouses", "Custom integrations"],
      },
      {
        title: "Support & onboarding",
        icon: FaHeadset,
        tone: "teal",
        items: ["Dedicated account manager", "Custom onboarding", "SLA guarantee"],
      },
    ],
  },
];

// ======================================================
// ANIMATION
// ======================================================

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
  },
};

// ======================================================
// COMPONENT
// ======================================================

export default function PricingCards({ stagger, fadeUp }) {
  const [billing, setBilling] = useState("monthly");

  return (
     <section className="relative border-b border-white/10">
    {/* </section> <section className="relative border-b border-black/5 bg-[#f1f0ec]"> */}

      
      {/* ==================================================
          CARDS CONTAINER
      ================================================== */}

      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-12">
        
         {/* ==================================================
          BILLING TOGGLE
      ================================================== */}
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{
            duration: 0.6,
            delay: 0.15,
            }}
            className="flex justify-start pb-3"
        >
            <BillingToggle
            billing={billing}
            setBilling={setBilling}
            />
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.12,
          }}
          className="
            grid
            grid-cols-1
            gap-4
            sm:gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {TIERS.map((tier, index) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              billing={billing}
              index={index}
              variants={cardVariants}
            />
          ))}
        </motion.div>

        {/* Bottom note */}
        <motion.p
          initial={{
            opacity: 0,
            y: 8,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            delay: 0.15,
          }}
          className="
            mt-6
            text-center
            text-xs
            text-slate-600
          "
        >
          All plans include secure cloud infrastructure and regular product
          updates.
        </motion.p>
      </div>
    </section>
  );
}