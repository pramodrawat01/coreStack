import { motion } from "framer-motion";
import { FaQuoteLeft, FaArrowRight } from "react-icons/fa";
import { STORIES } from "./data";

const GLOW = {
  blue: "from-blue-500/15",
  teal: "from-teal-500/15",
  violet: "from-violet-500/15",
  amber: "from-amber-500/15",
};

export default function CustomerStoriesPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {STORIES.map((s, i) => (
        <motion.a
          href="#"
          key={s.company}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c] p-7 transition-colors hover:border-white/20"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${GLOW[s.tone]} to-transparent opacity-70`} />

          <div className="relative">
            <p className="text-[11px] text-white/45">{s.industry}</p>
            <h3 className="mt-1 text-xl font-medium text-white">{s.company}</h3>

            <p className="mt-8 text-5xl font-medium tracking-tight text-white">{s.metric}</p>
            <p className="mt-1 text-xs text-white/50">{s.metricLabel}</p>

            <FaQuoteLeft size={12} className="mt-8 text-white/25" />
            <p className="mt-3 text-sm leading-6 text-white/70">{s.quote}</p>
            <p className="mt-2 text-[11px] text-white/40">{s.person}</p>

            <span className="mt-6 inline-flex items-center gap-2 text-xs text-white/60 group-hover:text-white">
              Read the story <FaArrowRight size={10} className="transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}