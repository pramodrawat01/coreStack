import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight, FaChevronRight } from "react-icons/fa";
import PostCover from "./PostCover";
import { POSTS, EXPLORE, CHANGELOG } from "./data";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55 },
};

export default function ResourcesHome() {
  const [featured, ...rest] = POSTS;
  const side = rest.slice(0, 2);
  const latest = rest.slice(2, 8);

  return (
    <div className="space-y-20">

      {/* FEATURED */}
      <motion.section {...fade} className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <Link
          to="/resources/blog"
          className="group overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c] transition-colors hover:border-white/20"
        >
          <PostCover
          image={featured.image}
          icon={featured.icon} tone={featured.tone} big className="aspect-[16/7] border-b border-white/10" />
          <div className="p-6">
            <p className="mb-3 text-[11px] text-white/45">{featured.date} · {featured.category}</p>
            <h2 className="max-w-lg text-2xl font-medium leading-snug text-white">{featured.title}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">{featured.excerpt}</p>
            <p className="mt-4 text-[11px] text-white/40">{featured.author} · {featured.read}</p>
          </div>
        </Link>

        <div className="grid gap-4">
          {side.map((p) => (
            <Link
              key={p.id}
              to="/resources/blog"
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c] transition-colors hover:border-white/20"
            >
              <PostCover image={p.image} icon={p.icon} tone={p.tone} className="h-[150px] border-b border-white/10" />
              <div className="p-5">
                <p className="mb-2 text-[11px] text-white/45">{p.date} · {p.category}</p>
                <h3 className="text-[15px] font-medium leading-snug text-white">{p.title}</h3>
                <p className="mt-2 text-[11px] text-white/40">{p.author} · {p.read}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* EXPLORE */}
      <motion.section {...fade}>
        <h2 className="mb-6 text-2xl font-medium tracking-tight text-white">Explore</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE.map(({ title, desc, to, icon: Icon }) => (
            <Link
              key={title}
              to={to}
              className="group rounded-2xl border border-white/10 bg-[#0b0b0c] p-6 transition-colors hover:border-white/20"
            >
              <span className="mb-8 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                <Icon size={14} />
              </span>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-medium text-white">{title}</h3>
                <FaArrowRight size={11} className="text-white/30 transition-all group-hover:translate-x-1 group-hover:text-white" />
              </div>
              <p className="mt-1.5 text-xs text-white/45">{desc}</p>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* LATEST */}
      <motion.section {...fade}>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-medium tracking-tight text-white">Latest articles</h2>
          <Link to="/resources/blog" className="text-xs text-white/60 hover:text-white">View all →</Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-white/10">
          {latest.map((p) => (
            <Link
              key={p.id}
              to="/resources/blog"
              className="flex items-center justify-between gap-4 border-b border-white/10 bg-[#0b0b0c] px-5 py-4 transition-colors last:border-b-0 hover:bg-white/[0.03]"
            >
              <div>
                <p className="mb-1 text-[11px] text-white/45">{p.category} · {p.date}</p>
                <p className="text-sm text-white">{p.title}</p>
              </div>
              <span className="hidden shrink-0 text-[11px] text-white/40 sm:block">{p.author} · {p.read}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* UPDATES */}
      <motion.section {...fade}>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-medium tracking-tight text-white">Updates</h2>
          <Link to="/resources/changelog" className="text-xs text-white/60 hover:text-white">See what's new →</Link>
        </div>
        <div className="grid overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {CHANGELOG.map((c) => (
            <Link
              key={c.version}
              to="/resources/changelog"
              className="border-b border-r border-white/10 bg-[#0b0b0c] p-5 transition-colors hover:bg-white/[0.03]"
            >
              <p className="text-sm text-white">{c.title}</p>
              <p className="mt-1 text-[11px] text-white/40">{c.date}</p>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* NEWSLETTER */}
      <motion.section
        {...fade}
        className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-transparent p-8 sm:flex-row sm:items-center"
      >
        <div>
          <h2 className="text-xl font-medium text-white">Get the monthly operator briefing</h2>
          <p className="mt-1 text-sm text-white/50">New guides and releases, once a month. No spam.</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()} className="flex w-full gap-2 sm:w-auto">
          <input
            type="email"
            required
            placeholder="you@company.com"
            className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40 sm:w-64"
          />
          <button className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-slate-200">
            Subscribe <FaChevronRight size={9} />
          </button>
        </form>
      </motion.section>
    </div>
  );
}