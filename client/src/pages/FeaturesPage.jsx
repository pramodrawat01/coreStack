import React from 'react';
import { FaBox, FaChartLine, FaUsers, FaFileInvoiceDollar, FaCog, FaShieldAlt } from 'react-icons/fa';

const FEATURES = [
  { icon: <FaBox />, title: 'Inventory Management', desc: 'Real-time tracking across multiple warehouses. Automated reorder points and batch tracking.' },
  { icon: <FaChartLine />, title: 'Advanced Analytics', desc: 'Custom dashboards, cohort analysis, and predictive forecasting for revenue and demand.' },
  { icon: <FaUsers />, title: 'Unified CRM', desc: '360-degree customer views. Order history, communication logs, and LTV tracking.' },
  { icon: <FaFileInvoiceDollar />, title: 'Automated Invoicing', desc: 'Generate, send, and reconcile invoices. Connect directly with major accounting software.' },
  { icon: <FaCog />, title: 'Workflow Automation', desc: 'Build custom rules to trigger emails, update statuses, and route orders automatically.' },
  { icon: <FaShieldAlt />, title: 'Enterprise Security', desc: 'SOC2 Type II, granular role-based access, and comprehensive audit logs.' },
];

export default function FeaturesPage() {
  return (
    <div className="pt-32 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Everything you need. <br />
            <span className="text-blue-500">Nothing you don't.</span>
          </h1>
          <p className="text-xl text-gray-400">
            Corestack replaces your fragmented tech stack with a single, powerful operations engine designed for scale.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {FEATURES.map((feature, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] transition-colors group">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <div className="rounded-3xl border border-white/10 bg-black/50 overflow-hidden flex flex-col lg:flex-row">
          <div className="p-12 lg:w-1/2 flex flex-col justify-center">
            <div className="text-blue-500 font-mono text-sm mb-4">DEEP DIVE</div>
            <h2 className="text-3xl font-bold mb-6">Real-time Inventory Sync</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Stop overselling. Our bi-directional sync ensures your warehouse, Shopify, Amazon, and retail POS systems are always aligned down to the second.
            </p>
            <ul className="space-y-4 mb-8">
              {['Multi-warehouse routing', 'Low stock alerts', 'Barcode scanning integration'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:w-1/2 bg-[#0a0a0a] border-t lg:border-t-0 lg:border-l border-white/10 p-12 flex items-center justify-center min-h-[400px]">
             {/* Placeholder for actual UI graphic */}
             <div className="text-gray-600 font-mono text-sm border border-dashed border-gray-700 p-8 rounded-xl">
               [Inventory Sync UI Graphic]
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}