import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBoxes,
  FaTruck,
  FaFileInvoiceDollar,
  FaWarehouse,
  FaChartLine,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

// ======================================================
// SLIDES
// label = two words shown in the floating pill
// image (optional) = path to a PNG with transparent background,
// e.g. "/showcase/inventory.png"
// ======================================================

const SLIDES = [
  {
    label: ["Inventory", "Synced"],
    icon: FaBoxes,
    image: "/showcase/inventory.png",
  },
  {
    label: ["Order", "Fulfilled"],
    icon: FaTruck,
    image: "/showcase/orders.png",
  },
  {
    label: ["Invoice", "Paid"],
    icon: FaFileInvoiceDollar,
    image: "/showcase/invoice.png",
  },
  {
    label: ["Stock", "Replenished"],
    icon: FaWarehouse,
    image: "/showcase/stock.png",
  },
  {
    label: ["Report", "Generated"],
    icon: FaChartLine,
    image: "/showcase/reports.png",
  },
];
const GAP = 32;

// ======================================================
// Slide width by screen size
// ======================================================

function useSlideWidth() {
  const [width, setWidth] = useState(520);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setWidth(w < 640 ? 280 : w < 1024 ? 400 : 520);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return width;
}

// ======================================================
// COMPONENT
// ======================================================

export default function ShowcaseCarousel() {
  const [index, setIndex] = useState(2);
  const W = useSlideWidth();
  const H = Math.round(W * 0.66);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(SLIDES.length - 1, i + 1));

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-ink py-20 sm:py-24">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="mb-12 px-6 text-center"
      >
        <h2 className="font-serif text-3xl tracking-tight text-white sm:text-4xl">
          Everything in motion, in one place
        </h2>
      </motion.div>

      {/* Carousel viewport */}
     <div className="relative h-[300px] w-full sm:h-[400px] lg:h-[460px]">
        {/* Sliding track: centered on the active slide */}
        <motion.div
          animate={{ x: -(index * (W + GAP) + W / 2) }}
          transition={{ type: "spring", stiffness: 140, damping: 22 }}
          style={{ gap: GAP }}
          className="absolute left-1/2 top-0 flex h-full items-center"
        >
          {SLIDES.map((slide, i) => {
            const active = i === index;
            const Icon = slide.icon;

            return (
              <motion.div
  key={slide.label.join("-")}
  onClick={() => setIndex(i)}
  animate={{
    scale: active ? 1 : 0.8,
    opacity: active ? 1 : 0.45,
  }}
  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  style={{ width: W, height: H }}
  className="relative shrink-0 cursor-pointer"
>
  {/* Image */}
  <div className="h-full w-full overflow-hidden rounded-[28px] ring-1 ring-white/10 shadow-[0_24px_60px_-24px_rgba(59,130,246,0.35)]">
    <img
      src={slide.image}
      alt={slide.label.join(" ")}
      draggable={false}
      className="h-full w-full object-cover"
    />
  </div>

  {/* Label pill: straddles the bottom edge, only on the active slide */}
  <motion.div
    animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
    transition={{ duration: 0.4 }}
    className="pointer-events-none absolute inset-x-0 -bottom-5 z-10 flex justify-center"
  >
    <div className="flex items-center gap-2.5 rounded-2xl bg-[#0b1220]/90 py-1.5 pl-1.5 pr-4 ring-1 ring-white/15 backdrop-blur sm:py-2 sm:pl-2 sm:pr-5">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-white sm:h-9 sm:w-9">
        <Icon size={15} />
      </span>
      <span className="font-serif text-sm text-white sm:text-lg">
        {slide.label.join(" ")}
      </span>
    </div>
  </motion.div>
</motion.div>
            );
          })}
        </motion.div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-ink via-ink/70 to-transparent sm:w-[14%]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-ink via-ink/70 to-transparent sm:w-[14%]" />
        {/* Arrows */}
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition hover:bg-white/10 disabled:opacity-30 sm:left-6"
        >
          <FaChevronLeft size={12} />
        </button>

        <button
          type="button"
          onClick={next}
          disabled={index === SLIDES.length - 1}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition hover:bg-white/10 disabled:opacity-30 sm:right-6"
        >
          <FaChevronRight size={12} />
        </button>
      </div>
    </section>
  );
}