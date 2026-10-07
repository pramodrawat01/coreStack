import { motion } from "framer-motion";
import { CHANGELOG } from "./data";

const TAG = {
  New: "bg-blue-500/15 text-blue-300",
  Improved: "bg-emerald-500/15 text-emerald-300",
  Fixed: "bg-amber-500/15 text-amber-300",
};

export default function ChangelogPage() {
  return (
    <div className="space-y-10">
      {CHANGELOG.map((c, i) => (
        <motion.article
          key={c.version}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: i * 0.04 }}
          className="grid gap-4 md:grid-cols-[160px_1fr]"
        >
          <div className="md:pt-5">
            <p className="text-sm text-white">{c.date}</p>
            <p className="mt-1 font-mono text-[11px] text-white/40">v{c.version}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-6">
            <span className={`rounded-md px-2 py-0.5 text-[10px] ${TAG[c.tag]}`}>{c.tag}</span>
            <h2 className="mt-3 text-lg font-medium text-white">{c.title}</h2>
            <ul className="mt-4 space-y-2">
              {c.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/55">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.article>
      ))}
    </div>
  );
}