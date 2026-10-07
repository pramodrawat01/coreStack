
// import React from 'react';
// import { FaBox, FaChartLine, FaUsers, FaFileInvoiceDollar, FaCog, FaShieldAlt } from 'react-icons/fa';

// const FEATURES = [
//   { icon: <FaBox />, title: 'Inventory Management', desc: 'Real-time tracking across multiple warehouses. Automated reorder points and batch tracking.' },
//   { icon: <FaChartLine />, title: 'Advanced Analytics', desc: 'Custom dashboards, cohort analysis, and predictive forecasting for revenue and demand.' },
//   { icon: <FaUsers />, title: 'Unified CRM', desc: '360-degree customer views. Order history, communication logs, and LTV tracking.' },
//   { icon: <FaFileInvoiceDollar />, title: 'Automated Invoicing', desc: 'Generate, send, and reconcile invoices. Connect directly with major accounting software.' },
//   { icon: <FaCog />, title: 'Workflow Automation', desc: 'Build custom rules to trigger emails, update statuses, and route orders automatically.' },
//   { icon: <FaShieldAlt />, title: 'Enterprise Security', desc: 'SOC2 Type II, granular role-based access, and comprehensive audit logs.' },
// ];

// export default function FeaturesPage() {
//   return (
//     <div className="pt-32 pb-24 relative z-10">
//       <div className="max-w-7xl mx-auto px-6">
        
//         {/* Header */}
//         <div className="text-center max-w-3xl mx-auto mb-20">
//           <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
//             Everything you need. <br />
//             <span className="text-blue-500">Nothing you don't.</span>
//           </h1>
//           <p className="text-xl text-gray-400">
//             Corestack replaces your fragmented tech stack with a single, powerful operations engine designed for scale.
//           </p>
//         </div>

//         {/* Feature Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
//           {FEATURES.map((feature, idx) => (
//             <div key={idx} className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors group">
//               <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
//                 {feature.icon}
//               </div>
//               <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
//               <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
//             </div>
//           ))}
//         </div>

//         {/* Deep Dive Section */}
//         <div className="rounded-3xl border border-white/10 bg-black/50 overflow-hidden flex flex-col lg:flex-row">
//           <div className="p-12 lg:w-1/2 flex flex-col justify-center">
//             <div className="text-blue-500 font-mono text-sm mb-4">DEEP DIVE</div>
//             <h2 className="text-3xl font-bold mb-6">Real-time Inventory Sync</h2>
//             <p className="text-gray-400 mb-8 leading-relaxed">
//               Stop overselling. Our bi-directional sync ensures your warehouse, Shopify, Amazon, and retail POS systems are always aligned down to the second.
//             </p>
//             <ul className="space-y-4 mb-8">
//               {['Multi-warehouse routing', 'Low stock alerts', 'Barcode scanning integration'].map((item, i) => (
//                 <li key={i} className="flex items-center gap-3 text-gray-300">
//                   <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> {item}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="lg:w-1/2 bg-[#0a0a0a] border-t lg:border-t-0 lg:border-l border-white/10 p-12 flex items-center justify-center min-h-[400px]">
//              {/* Placeholder for actual UI graphic */}
//              <div className="text-gray-600 font-mono text-sm border border-dashed border-gray-700 p-8 rounded-xl">
//                [Inventory Sync UI Graphic]
//              </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }






import { motion } from "framer-motion";
import {
  FaBox,
  FaChartLine,
  FaUsers,
  FaFileInvoiceDollar,
  FaCog,
  FaShieldAlt,
  FaWarehouse,
  FaTruck,
  FaBolt,
  FaPlug,
  FaBell,
  FaTags,
  FaBarcode,
  FaClipboardList,
  FaSyncAlt,
  FaStore,
  FaMapMarkedAlt,
  FaCreditCard,
  FaCubes,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

// ======================================================
// HELPERS
// ======================================================

const rand = (i) => {
  const x = Math.sin(i * 999.13) * 10000;
  return x - Math.floor(x);
};

const MATRIX = Array.from({ length: 18 }, (_, r) =>
  Array.from({ length: 64 }, (_, c) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789/+*=<>|";
    return chars[Math.floor(rand(r * 64 + c) * chars.length)];
  }).join("")
).join("\n");

const maskRadial = (w, h) => ({
  WebkitMaskImage: `radial-gradient(ellipse ${w}% ${h}% at 50% 50%, black 25%, transparent 80%)`,
  maskImage: `radial-gradient(ellipse ${w}% ${h}% at 50% 50%, black 25%, transparent 80%)`,
});

// ======================================================
// HERO TILES
// ======================================================

const TILE_ROWS = [
  [FaTags, FaBarcode, FaBell, FaBox, FaCog, FaMapMarkedAlt, FaPlug],
  [FaSyncAlt, FaClipboardList, FaTruck, FaBolt, FaStore, FaCreditCard, FaWarehouse, FaChartLine],
  [FaUsers, FaBox, FaFileInvoiceDollar, FaShieldAlt, FaTags, FaBell, FaCog, FaBarcode],
  [FaMapMarkedAlt, FaPlug, FaClipboardList, FaSyncAlt, FaTruck, FaStore, FaBolt],
];

function HeroTiles() {
  return (
    <div className="relative mx-auto h-[330px] w-full max-w-[900px] overflow-hidden ">
      <div
        className="absolute inset-0 flex flex-col items-center gap-3 border border-3"
        style={maskRadial(55, 75)}
      >
        {TILE_ROWS.map((row, r) => (
          <div
            key={r}
            className="flex gap-6"
            style={{ marginLeft: r % 2 ? 40 : 0 }}
          >
            {row.map((Icon, i) => (
              <div
                key={i}
                className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.04] text-white/25"
              >
                <Icon size={22} />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Corestack logo tile */}
      <div className="absolute left-1/2 top-[104px] z-10 flex h-[88px] w-[88px] -translate-x-1/2 items-center justify-center rounded-[24px] border border-white/10 bg-[#0a0a0b] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.9),0_0_60px_-10px_rgba(59,130,246,0.35)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#0a0a0b]">
          <FaCubes size={24} />
        </span>
      </div>
    </div>
  );
}

// ======================================================
// CARD
// ======================================================

function Card({ tag, dot, title, heightClass = "h-[300px]", children }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c] transition-colors hover:border-white/20 ${heightClass}`}
    >
      {/* Visual */}
      <div className="absolute inset-0">{children}</div>

      {/* Bottom fade so text stays readable */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-1/2 bg-gradient-to-t from-[#0b0b0c] via-[#0b0b0c]/90 to-transparent" />

      {/* Text */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5 pr-16">
        <div className="mb-1.5 flex items-center gap-2 text-[11px] text-white/50">
          {dot && <span className={`h-1.5 w-3 rounded-full ${dot}`} />}
          {tag}
        </div>
        <h3 className="max-w-[320px] text-[15px] font-medium leading-snug text-white">
          {title}
        </h3>
      </div>

      {/* Chevron button */}
      <Link to="/resources/blog">
        <span className="absolute  bottom-5 right-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors group-hover:border-white/30 group-hover:text-white">
          <FaChevronRight size={10} />
        </span>
      </Link>
    </motion.article>
  );
}

// ======================================================
// VISUALS
// ======================================================

function ArcVisual() {
  const cx = 350;
  const cy = 520;
  const ticks = [];

  for (let a = -44; a <= 44; a += 2) {
    const rad = (a * Math.PI) / 180;
    const major = a % 12 === 0;
    const r1 = major ? 290 : 395;
    const r2 = major ? 425 : 415;
    ticks.push(
      <line
        key={a}
        x1={cx + r1 * Math.sin(rad)}
        y1={cy - r1 * Math.cos(rad)}
        x2={cx + r2 * Math.sin(rad)}
        y2={cy - r2 * Math.cos(rad)}
        stroke={major ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)"}
        strokeWidth={major ? 1.2 : 1}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 700 230"
      preserveAspectRatio="xMidYMin slice"
      className="absolute inset-0 h-full w-full"
    >
      <circle
        cx={cx}
        cy={cy}
        r="440"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="1.5"
        strokeDasharray="1 7"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="432" fill="none" stroke="rgba(255,255,255,0.1)" />
      {ticks}
      <circle cx={cx} cy="80" r="2.5" fill="#22c55e" />
    </svg>
  );
}

function ChartVisual() {
  return (
    <svg
      viewBox="0 0 500 240"
      preserveAspectRatio="none"
      className="absolute right-0 top-0 h-full w-[68%]"
    >
      <defs>
        <linearGradient id="yellowArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eab308" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d="M0 130 C60 105 120 95 190 98 S 260 90 300 70 S 400 40 440 30"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="2"
      />
      <path
        d="M0 170 C60 168 120 170 180 168 S 260 125 300 112 S 380 92 440 86 L440 240 L0 240 Z"
        fill="url(#yellowArea)"
      />
      <path
        d="M0 170 C60 168 120 170 180 168 S 260 125 300 112 S 380 92 440 86"
        fill="none"
        stroke="#eab308"
        strokeWidth="2.5"
      />
      <circle cx="440" cy="30" r="5" fill="#5b5b5f" />
      <circle cx="440" cy="86" r="5" fill="#eab308" />
    </svg>
  );
}

function AutomationVisual() {
  return (
    <div className="absolute inset-x-6 top-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-[11px] text-white/55">
      <div className="mb-3 flex items-center gap-2 text-white/80">
        <FaBolt size={11} /> Smart suggestions
      </div>

      <div className="mb-2.5 flex items-center gap-2">
        <span className="w-20 shrink-0 text-white/40">Suggestions</span>
        <span className="rounded-md border border-white/10 px-2 py-0.5">Reorder</span>
        <span className="rounded-md border border-white/10 px-2 py-0.5 text-blue-300">
          Widget A · 12 left
        </span>
      </div>

      <div className="mb-2 flex items-center gap-2">
        <span className="w-20 shrink-0 text-white/40">Triggered by</span>
        <span className="h-2.5 w-2.5 rounded-full border border-white/40" />
        <span className="text-white/35">STK-1299</span>
        <span className="truncate">Stock below reorder point</span>
      </div>

      <div className="mb-2 flex items-center gap-2 pl-[88px]">
        <span className="h-2.5 w-2.5 rounded-full border border-dashed border-white/30" />
        <span className="text-white/35">PO-1420</span>
        <span className="truncate">Draft purchase order created</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="w-20 shrink-0 text-white/40">Notify</span>
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="text-white/35">OPS-8331</span>
        <span className="truncate">Warehouse team alerted</span>
      </div>
    </div>
  );
}

function InsightsVisual() {
  const colors = ["#5b5b66", "#5b5b66", "#5b5b66", "#6366f1", "#eab308", "#22c55e"];
  const dots = Array.from({ length: 170 }, (_, i) => {
    const x = 10 + rand(i + 1) * 380;
    const spread = 140 - (x / 400) * 90;
    const y = 220 - rand(i + 500) * spread - rand(i + 900) * 20;
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={1.6}
        fill={colors[Math.floor(rand(i + 77) * colors.length)]}
      />
    );
  });

  return (
    <div
      className="absolute inset-x-0 top-4 flex justify-center"
      style={{
        transform: "perspective(500px) rotateX(38deg)",
        transformOrigin: "50% 100%",
      }}
    >
      <svg viewBox="0 0 400 240" className="h-[240px] w-[92%]">
        {[40, 90, 140, 190].map((y) => (
          <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
        ))}
        {dots}
      </svg>
    </div>
  );
}

function MobileVisual() {
  const rows = [
    ["Low stock: Widget A", "Warehouse 2"],
    ["Order #4821 shipped", "Tracking sent"],
    ["Invoice paid", "$1,240.00"],
    ["Transfer received", "Warehouse 1"],
  ];

  return (
    <div className="absolute left-[12%] top-8 h-[380px] w-[200px] rotate-[16deg] rounded-[34px] border border-white/15 bg-[#0a0a0b] p-3 shadow-[0_0_50px_-15px_rgba(59,130,246,0.3)]">
      <div className="mx-auto mb-3 h-4 w-16 rounded-full bg-white/10" />
      <p className="mb-3 px-1 text-sm font-semibold text-white/80">Inbox</p>

      <div className="space-y-2">
        {rows.map(([a, b], i) => (
          <div
            key={a}
            className={`flex items-center gap-2 rounded-xl p-2 ${
              i === 0 ? "bg-white/10" : "bg-white/[0.03]"
            }`}
          >
            <span className="h-6 w-6 shrink-0 rounded-full bg-white/15" />
            <div className="min-w-0">
              <p className="truncate text-[10px] text-white/80">{a}</p>
              <p className="truncate text-[9px] text-white/40">{b}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomersVisual() {
  return (
    <div className="absolute inset-x-6 top-7 space-y-3 text-[11px]">
      <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-white/70">
        <p className="mb-1 font-mono text-[10px] text-white/40">
          portal · zoe@acme.inc
        </p>
        Can we split this order across two warehouses?
      </div>

      <div className="flex items-center gap-2 pl-4 text-white/60">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5">
          <FaUsers size={11} />
        </span>
        <span className="font-mono text-[10px]">ACME Inc</span>
        <span className="font-mono text-[10px] text-white/35">New order</span>
      </div>

      <div className="ml-4 rounded-lg border border-white/5 bg-white/[0.025] p-3 text-white/45">
        <span className="font-mono text-[10px] text-white/30">ORD-860</span>
        <span className="ml-2">Multi-warehouse shipment</span>
      </div>
    </div>
  );
}

function IntegrationsVisual() {
  const items = [FaStore, FaPlug, FaTruck];

  return (
    <div className="absolute inset-x-0 top-10 flex justify-center">
      <div className="flex -space-x-5">
        {items.map((Icon, i) => (
          <div
            key={i}
            className="flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.02] text-white/40 shadow-xl"
            style={{ transform: `rotate(${(i - 1) * 8}deg) translateY(${i === 1 ? -8 : 0}px)` }}
          >
            <Icon size={30} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="absolute inset-0">
      <pre
        className="absolute inset-0 overflow-hidden whitespace-pre text-center font-mono text-[9px] leading-[12px] tracking-[0.2em] text-white/25"
        style={maskRadial(55, 80)}
      >
        {MATRIX}
      </pre>

      <div className="absolute left-1/2 top-[82px] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#0a0a0b]">
        <FaCubes size={24} />
      </div>
    </div>
  );
}

// ======================================================
// EXTRA SECTIONS DATA
// ======================================================

const STATS = [
  ["99.9%", "Uptime target"],
  ["< 1s", "Inventory sync"],
  ["10+", "Integrations"],
  ["24/7", "Support"],
];

const STEPS = [
  {
    n: "01",
    title: "Connect your channels",
    desc: "Link your stores, marketplaces and POS so stock and orders flow into one place.",
  },
  {
    n: "02",
    title: "Import your catalog",
    desc: "Bring in products, warehouses and customers from a spreadsheet or your current tools.",
  },
  {
    n: "03",
    title: "Automate and scale",
    desc: "Turn on reorder rules, invoicing and workflows, then watch the dashboard.",
  },
];

// ======================================================
// PAGE
// ======================================================

export default function FeaturesPage() {
  return (
    <div className="relative z-10 pb-24 pt-28 ">

      {/* ================= HERO ================= */}
      <section className="px-6">
        <HeroTiles />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto mt-8  text-center"
        >
          <h1 className="text-4xl font-medium leading-[1.08] tracking-tight text-white sm:text-6xl">
            The system for modern business operations
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/50 sm:text-[15px]">
            Corestack streamlines work across the entire operations cycle, from
            purchasing to delivery.
          </p>
        </motion.div>
      </section>

      {/* ================= FEATURE CARDS ================= */}
      <section className="mx-auto mt-24 max-w-[1100px] space-y-4 px-6">

        <Card
          tag="Planning"
          dot="bg-green-500"
          title="Plan stock and purchasing with real-time inventory"
          heightClass="h-[250px]"
        >
          <ArcVisual />
        </Card>

        <Card
          tag="Fulfillment"
          dot="bg-yellow-500"
          title="Make progress with order tracking and fulfillment cycles"
          heightClass="h-[250px]"
        >
          <ChartVisual />
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card
            tag="Automation"
            title="Streamline operations with smart rules and workflows"
          >
            <AutomationVisual />
          </Card>

          <Card tag="Insights" title="Instant analytics for any stream of business">
            <InsightsVisual />
          </Card>

          <Card tag="Mobile" title="Run your warehouse from anywhere">
            <MobileVisual />
          </Card>

          <Card tag="Customers" title="Keep every customer order in view">
            <CustomersVisual />
          </Card>

          <Card
            tag="Integrations"
            title="Connect your stores, marketplaces and POS in minutes"
          >
            <IntegrationsVisual />
          </Card>

          <Card
            tag="Security"
            title="Best-in-class security keeps your data safe and secure"
          >
            <SecurityVisual />
          </Card>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="mx-auto mt-24 max-w-[1100px] px-6">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10 md:grid-cols-4">
          {STATS.map(([value, label], i) => (
            <div
              key={label}
              className={`bg-white/[0.02] px-6 py-8 text-center ${
                i > 0 ? "md:border-l md:border-white/10" : ""
              } ${i % 2 === 1 ? "border-l border-white/10 md:border-l" : ""} ${
                i > 1 ? "border-t border-white/10 md:border-t-0" : ""
              }`}
            >
              <p className="text-3xl font-medium tracking-tight text-white">
                {value}
              </p>
              <p className="mt-1.5 text-xs text-white/45">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="mx-auto mt-24 max-w-[1100px] px-6">
        <h2 className="mb-8 text-2xl font-medium tracking-tight text-white sm:text-3xl">
          Up and running in three steps
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-6 transition-colors hover:border-white/20"
            >
              <p className="mb-8 font-mono text-xs text-blue-400">{step.n}</p>
              <h3 className="mb-2 text-[15px] font-medium text-white">
                {step.title}
              </h3>
              <p className="text-xs leading-5 text-white/45">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="mx-auto mt-28 max-w-[1100px] px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Run today. Scale tomorrow.
          </h2>

          <div className="flex gap-2">
            <button
              type="button"
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              Book a demo
            </button>

<Link
to="/auth?mode=signup"
>
            <button 
            type="button"
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-slate-200">

            
              Get started
            </button>
</Link>
          </div>
        </div>
      </section>
    </div>
  );
}