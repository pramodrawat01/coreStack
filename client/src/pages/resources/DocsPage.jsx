import { useMemo, useState } from "react";
import { FaSearch, FaChevronRight } from "react-icons/fa";
import { DOC_GROUPS } from "./data";

const SNIPPET = `curl https://api.corestack.com/v1/products \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

export default function DocsPage() {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return DOC_GROUPS;
    return DOC_GROUPS.map((g) => ({
      ...g,
      links: g.links.filter((l) => l.toLowerCase().includes(s) || g.title.toLowerCase().includes(s)),
    })).filter((g) => g.links.length);
  }, [q]);

  return (
    <div className="grid gap-10 lg:grid-cols-[200px_1fr]">

      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 space-y-1">
          <p className="mb-3 text-[11px] uppercase tracking-wider text-white/35">On this page</p>
          {DOC_GROUPS.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="block rounded-md px-2 py-1.5 text-sm text-white/50 hover:bg-white/5 hover:text-white">
              {g.title}
            </a>
          ))}
        </div>
      </aside>

      <div className="space-y-10">

        {/* Search */}
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b0c] px-4 py-3">
          <FaSearch size={13} className="text-white/35" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search documentation…"
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
        </div>

        {/* Quick start */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c]">
          <div className="border-b border-white/10 px-5 py-3 text-xs text-white/50">Quick start · make your first API call</div>
          <pre className="overflow-x-auto p-5 font-mono text-xs leading-6 text-blue-200">{SNIPPET}</pre>
        </div>

        {/* Groups */}
        {groups.length === 0 && <p className="text-sm text-white/45">No results for "{q}".</p>}

        <div className="grid gap-4 md:grid-cols-2">
          {groups.map(({ id, title, desc, icon: Icon, links }) => (
            <section key={id} id={id} className="scroll-mt-28 rounded-2xl border border-white/10 bg-[#0b0b0c] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                  <Icon size={13} />
                </span>
                <div>
                  <h2 className="text-[15px] font-medium text-white">{title}</h2>
                  <p className="text-xs text-white/40">{desc}</p>
                </div>
              </div>
              <ul className="divide-y divide-white/5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="group flex items-center justify-between py-2.5 text-sm text-white/60 hover:text-white">
                      {l}
                      <FaChevronRight size={9} className="text-white/20 group-hover:text-white/60" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}