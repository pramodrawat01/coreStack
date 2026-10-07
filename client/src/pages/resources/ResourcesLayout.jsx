import { NavLink, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { SECTIONS } from "./data";

export default function ResourcesLayout() {
  return (
    <div className="relative z-10 pb-24 pt-28">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-medium leading-[1.05] tracking-tight text-white sm:text-6xl">
            Resources
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-6 text-white/50">
            Docs, guides, stories and updates to help you run a more efficient business.
          </p>
        </motion.header>

        <nav className="mt-10 flex gap-1 overflow-x-auto border-b border-white/10">
          {SECTIONS.map((s) => (
            <NavLink
              key={s.to}
              to={s.to}
              end={s.end}
              className={({ isActive }) =>
                `relative shrink-0 px-3 py-3 text-sm transition-colors ${
                  isActive ? "text-white" : "text-white/45 hover:text-white/80"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {s.label}
                  {isActive && (
                    <motion.span
                      layoutId="resources-tab"
                      className="absolute inset-x-3 -bottom-px h-px bg-white"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="pt-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}