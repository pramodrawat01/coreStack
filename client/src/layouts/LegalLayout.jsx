import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

export default function LegalLayout({
  eyebrow,
  title,
  description,
  updated,
  children,
}) {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 90%)",
          }}
        />

        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[140px]" />

        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-4 lg:px-10 lg:pb-24 lg:pt-4">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

                <Link
                to="/"
                className="inline-flex items-center  gap-3 mb-4 text-sm text-neutral-500 transition-colors hover:text-white"
                >
                <FaArrowLeft size={11} />
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-400 opacity-80 transition-opacity duration-300 hover:opacity-100 ">
                {eyebrow}
                </p>
                </Link>

            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              {title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-400 sm:text-lg">
              {description}
            </p>

            {updated && (
              <p className="mt-6 text-xs text-neutral-600">
                Last updated: {updated}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* CONTENT */}
      <section>
        <div className="mx-auto flex max-w-7xl gap-16 px-6 py-20 lg:px-10 lg:py-28">

          {/* Sidebar */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <div className="sticky top-28">
              <p className="mb-4 text-xs font-medium uppercase tracking-wider text-neutral-600">
                On this page
              </p>

              <nav className="flex flex-col gap-2">
                <a
                  href="#overview"
                  className="text-sm text-neutral-500 transition-colors hover:text-white"
                >
                  Overview
                </a>

                <a
                  href="#information"
                  className="text-sm text-neutral-500 transition-colors hover:text-white"
                >
                  Information
                </a>

                <a
                  href="#usage"
                  className="text-sm text-neutral-500 transition-colors hover:text-white"
                >
                  Usage
                </a>

                <a
                  href="#contact"
                  className="text-sm text-neutral-500 transition-colors hover:text-white"
                >
                  Contact
                </a>
              </nav>
            </div>
          </aside>

          {/* Article */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl min-w-0"
          >
            {children}
          </motion.article>

        </div>
      </section>
    </main>
  );
}