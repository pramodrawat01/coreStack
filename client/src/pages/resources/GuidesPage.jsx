import { useState } from "react";
import { motion } from "framer-motion";
import { GUIDES, GUIDE_CATEGORIES } from "./data";

const LEVEL = {
  Beginner: "bg-emerald-500/15 text-emerald-300",
  Intermediate: "bg-amber-500/15 text-amber-300",
  Advanced: "bg-rose-500/15 text-rose-300",
};

export default function GuidesPage() {
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? GUIDES : GUIDES.filter((g) => g.category === cat);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {GUIDE_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
              cat === c ? "border-white bg-white text-black" : "border-white/15 text-white/55 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map(({ title, category, level, time, icon: Icon }, i) => (
          <motion.a
            href="#"
            key={title}
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group flex min-h-[210px] flex-col justify-between rounded-2xl border border-white/10 bg-[#0b0b0c] p-6 transition-colors hover:border-white/20"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                <Icon size={14} />
              </span>
              <span className={`rounded-md px-2 py-0.5 text-[10px] ${LEVEL[level]}`}>{level}</span>
            </div>
            <div>
              <p className="mb-2 text-[11px] text-white/40">{category} · {time}</p>
              <h3 className="text-[15px] font-medium leading-snug text-white group-hover:text-blue-300">{title}</h3>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}