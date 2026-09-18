import React from 'react';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- BACKGROUND GRID EFFECT --- */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.15]" 
           style={{
             backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
             backgroundSize: '40px 40px'
           }}>
      </div>

      <main className="relative z-10">

        {/* --- 1. HERO SECTION --- */}
        <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
          
          {/* Live Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]"></span>
            </span>
            Corestack 2.0 is Live now : Track Operations & Update
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
            <span className="text-blue-500">Consolidate</span> your chaos.<br />
            Accelerate your <span className="text-blue-500">growth</span>.
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed">
            Get real-time visibility into your inventory, cash flow, and customers—all from a single dashboard designed for speed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-3 rounded-md bg-white text-black font-semibold hover:bg-gray-200 transition-colors duration-200">
              Get Started
            </button>
            <button className="px-8 py-3 rounded-md bg-transparent border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors duration-200">
              Book a Demo
            </button>
          </div>
        </section>

        {/* --- 2. TRUSTED BY LOGOS --- */}
        <section className="border-y border-white/10 bg-white/[0.02] py-10">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-6">Powering operations for modern teams</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
              {/* Placeholder Logos */}
              <div className="text-xl font-bold font-mono">Acme Corp</div>
              <div className="text-xl font-bold font-serif">GlobalTech</div>
              <div className="text-xl font-bold tracking-widest">NEXUS</div>
              <div className="text-xl font-bold">Vortex</div>
            </div>
          </div>
        </section>

        {/* --- 3. CORE SOLUTION PILLARS (BENTO GRID) --- */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The All-In-One Platform To Run Your Operations.</h2>
            <p className="text-gray-400 text-lg">Stop paying for five different tools. Consolidate your tech stack.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full group-hover:bg-blue-500/20 transition-all duration-500"></div>
              <h3 className="text-2xl font-semibold mb-3">Real-Time Inventory Sync</h3>
              <p className="text-gray-400 max-w-md">Never oversell or stockout again. Corestack syncs your warehouse data across all sales channels instantly.</p>
              <div className="mt-8 h-32 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center">
                {/* Visual Placeholder */}
                <span className="text-gray-600 font-mono text-sm">Inventory Graph Placeholder</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden group">
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-all duration-500"></div>
              <h3 className="text-xl font-semibold mb-3">Automated Cash Flow</h3>
              <p className="text-gray-400 text-sm">Connect invoices to payments automatically. Get a live view of your runway.</p>
              <div className="mt-8 h-32 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center">
                <span className="text-gray-600 font-mono text-sm">Cash Flow UI</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden group">
              <h3 className="text-xl font-semibold mb-3">Unified CRM</h3>
              <p className="text-gray-400 text-sm">Every order tied to a customer profile. Know exactly who your best buyers are.</p>
            </div>

            {/* Feature 4 */}
            <div className="md:col-span-2 p-8 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-500"></div>
              <h3 className="text-2xl font-semibold mb-3">Enterprise-Grade Security</h3>
              <p className="text-gray-400 max-w-md">SOC2 Type II compliant. Granular role-based access control. Your data is encrypted at rest and in transit.</p>
            </div>
          </div>
        </section>

        {/* --- 4. DETAILED WORKFLOW SECTION --- */}
        <section className="py-24 border-t border-white/5 bg-black/50 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">From purchase order to final payment, Corestack streamlines every step of your operational workflow.</p>
            </div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 p-8">
                  <div className="text-blue-500 font-mono text-sm mb-2">01 — INGEST</div>
                  <h3 className="text-2xl font-bold mb-4">Connect your data sources</h3>
                  <p className="text-gray-400">Integrate seamlessly with Shopify, Amazon, QuickBooks, and your existing WMS. Data flows in automatically without manual CSV uploads.</p>
                </div>
                <div className="w-full md:w-1/2 h-64 rounded-xl border border-white/10 bg-[#0a0a0a] flex items-center justify-center">
                   <span className="text-gray-600 font-mono">Integration UI Placeholder</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
                <div className="w-full md:w-1/2 p-8">
                  <div className="text-blue-500 font-mono text-sm mb-2">02 — PROCESS</div>
                  <h3 className="text-2xl font-bold mb-4">Automate the busywork</h3>
                  <p className="text-gray-400">Set custom rules for reordering, invoicing, and customer notifications. Corestack acts as your operational autopilot.</p>
                </div>
                <div className="w-full md:w-1/2 h-64 rounded-xl border border-white/10 bg-[#0a0a0a] flex items-center justify-center">
                   <span className="text-gray-600 font-mono">Automation Rules UI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 5. METRICS / SOCIAL PROOF --- */}
        <section className="py-20 border-t border-white/10 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Uptime SLA</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">10M+</div>
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Orders Processed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">30%</div>
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Avg. OpEx Reduction</div>
            </div>
          </div>
        </section>

        {/* --- 6. FINAL CTA --- */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-gradient-to-b from-blue-900/20 to-black border border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-500/20 blur-[100px]"></div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">Ready to consolidate your stack?</h2>
            <p className="text-gray-400 mb-10 text-lg relative z-10">Join the modern businesses running their entire operation on Corestack.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <button className="px-8 py-3 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors duration-200 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                Get Started for Free
              </button>
              <button className="px-8 py-3 rounded-md bg-transparent border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors duration-200">
                Talk to Sales
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}