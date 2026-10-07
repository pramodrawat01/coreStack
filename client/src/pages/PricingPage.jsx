// import React from 'react';
// import { FaCheck } from 'react-icons/fa';

// const TIERS = [
//   {
//     name: 'Standard',
//     price: '$49',
//     period: '/mo',
//     desc: 'Perfect for early-stage startups getting off spreadsheets.',
//     features: ['Up to 1,000 orders/mo', '1 Warehouse', 'Standard Support', 'Basic Analytics'],
//     cta: 'Start Free Trial',
//     highlight: false,
//   },
//   {
//     name: 'Growth',
//     price: '$199',
//     period: '/mo',
//     desc: 'For scaling businesses that need automation and deeper insights.',
//     features: ['Up to 10,000 orders/mo', '5 Warehouses', 'Priority Support', 'Advanced Analytics', 'API Access'],
//     cta: 'Get Started',
//     highlight: true,
//   },
//   {
//     name: 'Enterprise',
//     price: 'Custom',
//     period: '',
//     desc: 'Custom infrastructure and dedicated support for large operations.',
//     features: ['Unlimited orders', 'Unlimited Warehouses', 'Dedicated Account Manager', 'Custom Integrations', 'SLA Guarantee'],
//     cta: 'Contact Sales',
//     highlight: false,
//   }
// ];

// export default function PricingPage() {
//   return (
//     <div className="pt-32 pb-24 relative z-10">
//       <div className="max-w-7xl mx-auto px-6">
        
//         {/* Header */}
//         <div className="text-center max-w-2xl mx-auto mb-20">
//           <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Simple, transparent pricing</h1>
//           <p className="text-xl text-gray-400">Scale your operations without unpredictable costs. No hidden fees.</p>
//         </div>

//         {/* Pricing Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
//           {TIERS.map((tier, idx) => (
//             <div 
//               key={idx} 
//               className={`p-8 rounded-3xl border flex flex-col relative ${
//                 tier.highlight 
//                   ? 'bg-blue-900/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]' 
//                   : 'bg-white/[0.02] border-white/10'
//               }`}
//             >
//               {tier.highlight && (
//                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
//                   Most Popular
//                 </div>
//               )}
              
//               <h3 className="text-2xl font-semibold mb-2">{tier.name}</h3>
//               <p className="text-gray-400 text-sm mb-6 h-10">{tier.desc}</p>
              
//               <div className="mb-8">
//                 <span className="text-5xl font-bold">{tier.price}</span>
//                 <span className="text-gray-400">{tier.period}</span>
//               </div>

//               <ul className="space-y-4 mb-8 flex-grow">
//                 {tier.features.map((feature, i) => (
//                   <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
//                     <FaCheck className="text-blue-500 mt-1 shrink-0" size={12} />
//                     <span>{feature}</span>
//                   </li>
//                 ))}
//               </ul>

//               <button className={`w-full py-3 rounded-lg font-semibold transition-colors ${
//                 tier.highlight 
//                   ? 'bg-blue-600 hover:bg-blue-500 text-white' 
//                   : 'bg-white/10 hover:bg-white/20 text-white'
//               }`}>
//                 {tier.cta}
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* Feature Comparison Table Placeholder */}
//         <div className="border border-white/10 rounded-2xl bg-white/[0.02] p-12 text-center">
//             <h3 className="text-2xl font-semibold mb-4">Compare all features</h3>
//             <p className="text-gray-400 mb-8">Detailed breakdown of capabilities across plans.</p>
//             <div className="h-64 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-gray-600 font-mono text-sm">
//                 [Detailed Feature Comparison Table Component]
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// }







import { useState } from "react";
import { motion } from "framer-motion";
import PricingCards from "../components/pricing/PricingCards.jsx";
import FeatureComparison from "../components/pricing/FeatureComparison.jsx";
import FAQ from "../components/pricing/FAQ.jsx";
import PricingCTA from "../components/pricing/PricingCTA.jsx";
import BillingToggle from "../components/pricing/BillingToggle.jsx";
import ShowcaseCarousel from "../components/pricing/ShowcaseCarousel.jsx";

// ======================================================
// ANIMATION
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

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};




// ======================================================
// MAIN PAGE
// ======================================================

export default function PricingPage() {

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative border-b border-white/10">
        {/* Background glow */}
        <div className="pointer-events-none absolute left-1/2 top-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[140px]" />

        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 75%)",
          }}
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative mx-auto max-w-6xl px-6 pb-16 pt-12 text-center lg:pb-20 lg:pt-20"
        >
          {/* Eyebrow */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.5 }}
            className="mb-6 text-xs font-medium uppercase tracking-[0.28em] text-blue-500"
          >
            SIMPLE, TRANSPARENT PRICING
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mx-auto max-w-4xl text-5xl font-semibold leading-[1] tracking-[-0.055em] sm:text-6xl lg:text-7xl"
          >
            Simple pricing.
            <br />
            <span className="text-blue-500">Serious operations.</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg"
          >
            Scale your operations without unpredictable costs. Choose the plan
            that fits the way your business runs.
          </motion.p>

          
        </motion.div>
      </section>

      {/* ==================================================
          PRICING CARDS
      ================================================== */}

      <PricingCards stagger={stagger} fadeUp={fadeUp} />

      {/* ==================================================
          FEATURE COMPARISON
      ================================================== */}
      
      <FeatureComparison />
      

      {/* ==================================================
          FAQ
      ================================================== */}

      <FAQ />

      {/* ==================================================
          FINAL CTA
      ================================================== */}

      <PricingCTA />

      <ShowcaseCarousel/>
    </main>
  );
}