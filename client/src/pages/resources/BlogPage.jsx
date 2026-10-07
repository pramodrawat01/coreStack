import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { POSTS, POST_CATEGORIES } from "./data";

export default function BlogPage() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(6);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return POSTS.filter(
      (p) => (cat === "All" || p.category === cat) && (!s || p.title.toLowerCase().includes(s))
    );
  }, [cat, q]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4 text-xs">
          {POST_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCat(c); setVisible(6); }}
              className={cat === c ? "text-white" : "text-white/45 hover:text-white/80"}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0b0b0c] px-3 py-2 sm:w-64">
          <FaSearch size={11} className="text-white/35" />
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setVisible(6); }}
            placeholder="Search articles…"
            className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c]">
        {list.slice(0, visible).map((p) => (
          <a
            key={p.id}
            href="#"
            className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 transition-colors hover:bg-white/[0.03]"
          >
            <div>
              <p className="mb-1 text-[11px] text-white/45">{p.category} · {p.date}</p>
              <p className="text-sm text-white">{p.title}</p>
            </div>
            <span className="hidden shrink-0 text-[11px] text-white/40 sm:block">{p.author} · {p.read}</span>
          </a>
        ))}

        {list.length === 0 && <p className="px-5 py-8 text-sm text-white/45">No articles found.</p>}

        {visible < list.length && (
          <button
            onClick={() => setVisible((v) => v + 4)}
            className="w-full py-4 text-xs font-medium text-white hover:bg-white/[0.03]"
          >
            Load more articles
          </button>
        )}
      </div>
    </div>
  );
}