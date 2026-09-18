import React from 'react';

const ARTICLES = [
  { category: 'Case Study', title: 'How Meridian Foods scaled to 10k orders/mo', time: '5 min read' },
  { category: 'Guide', title: 'The CFO’s Guide to Operational Efficiency', time: '8 min read' },
  { category: 'Product Update', title: 'Introducing Corestack 2.0: AI Forecasting', time: '3 min read' },
  { category: 'Webinar', title: 'Scaling Inventory Management for D2C Brands', time: '45 min watch' },
  { category: 'Case Study', title: 'Blue Harbor reduces OpEx by 30%', time: '6 min read' },
  { category: 'Guide', title: 'Migrating from Spreadsheets to an ERP', time: '10 min read' },
];

export default function ResourcesPage() {
  return (
    <div className="pt-32 pb-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Resources</h1>
          <p className="text-xl text-gray-400 max-w-2xl">Insights, case studies, and guides to help you run a more efficient business.</p>
        </div>

        {/* Featured Article */}
        <div className="mb-16 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-blue-900/20 to-black flex flex-col md:flex-row relative">
            <div className="p-12 md:w-3/5 flex flex-col justify-center">
                <span className="text-blue-400 font-mono text-xs mb-4 uppercase tracking-wider">Featured Report</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">The State of Operational Efficiency in 2024</h2>
                <p className="text-gray-400 mb-8">We surveyed 500 operations leaders to understand the biggest bottlenecks facing modern businesses.</p>
                <button className="self-start px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
                    Download Report
                </button>
            </div>
            <div className="md:w-2/5 bg-[#0a0a0a] border-t md:border-t-0 md:border-l border-white/10 flex items-center justify-center p-12 min-h-[300px]">
                 <div className="text-gray-600 font-mono text-sm border border-dashed border-gray-700 p-8 rounded-xl text-center">
                   [Report Cover Graphic]
                 </div>
            </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ARTICLES.map((article, idx) => (
                <div key={idx} className="group cursor-pointer">
                    <div className="h-48 rounded-2xl bg-white/[0.02] border border-white/5 mb-6 flex items-center justify-center group-hover:border-white/20 transition-colors">
                        <span className="text-gray-700 font-mono text-sm">[Image]</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-mono text-blue-400 mb-3">
                        <span className="uppercase tracking-wider">{article.category}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500">{article.time}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                        {article.title}
                    </h3>
                    <p className="text-gray-500 text-sm">Read article &rarr;</p>
                </div>
            ))}
        </div>

      </div>
    </div>
  );
}