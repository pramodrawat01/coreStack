import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaSearch, FaPlus, FaEnvelope } from "react-icons/fa";
import { FAQS, HELP_CATEGORIES } from "./data";

export default function HelpPage() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(0);

  const faqs = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? FAQS.filter((f) => f.q.toLowerCase().includes(s) || f.a.toLowerCase().includes(s)) : FAQS;
  }, [q]);

  return (
    <div className="space-y-16">

      {/* Search */}
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mb-5 text-2xl font-medium text-white">How can we help?</h2>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b0c] px-4 py-3">
          <FaSearch size={13} className="text-white/35" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setOpen(0); }}
            placeholder="Search for answers…"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HELP_CATEGORIES.map(({ title, desc, icon: Icon }) => (
          <a key={title} href="#" className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-6 transition-colors hover:border-white/20">
            <span className="mb-6 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
              <Icon size={14} />
            </span>
            <h3 className="text-[15px] font-medium text-white">{title}</h3>
            <p className="mt-1 text-xs text-white/45">{desc}</p>
          </a>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="mb-6 text-2xl font-medium tracking-tight text-white">Frequently asked</h2>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c]">
          {faqs.length === 0 && <p className="px-5 py-8 text-sm text-white/45">No matching answers. Try the contact form below.</p>}

          {faqs.map((f, i) => (
            <div key={f.q} className="border-b border-white/10 last:border-b-0">
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm text-white"
              >
                {f.q}
                <FaPlus size={10} className={`shrink-0 text-white/40 transition-transform ${open === i ? "rotate-45" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-6 text-white/55">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="grid gap-8 rounded-2xl border border-white/10 bg-[#0b0b0c] p-8 md:grid-cols-2">
        <div>
          <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
            <FaEnvelope size={13} />
          </span>
          <h2 className="text-xl font-medium text-white">Still need help?</h2>
          <p className="mt-2 text-sm leading-6 text-white/50">
            Send us a message and we will get back to you by email. Teams and Enterprise get priority responses.
          </p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <input required placeholder="Your email" type="email"
            className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40" />
          <textarea required rows={4} placeholder="How can we help?"
            className="w-full resize-none rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40" />
          <button className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-slate-200">
            Send message
          </button>
        </form>
      </div>
    </div>
  );
}