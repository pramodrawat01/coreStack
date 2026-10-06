import { motion } from "framer-motion";
import { useState } from "react";

export default function LogoMarquee({
  items = [],
  speed = 35,
  direction = "left",
  itemWidth = "220px",
  pauseOnHover = true,
  showBorders = true,
  className = "",
}) {
  const [paused, setPaused] = useState(false);

  if (!items.length) return null;

  const isRight = direction === "right";

  const content = [...items, ...items];

  return (
    <div
      className={`
        relative
        w-full
        overflow-hidden
        border-y
        border-white/10
        
        ${className}
      `}
      onMouseEnter={() => {
        if (pauseOnHover) setPaused(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover) setPaused(false);
      }}
    >
      {/* Edge fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />

      <motion.div
        className="flex w-max"
        initial={{
          x: isRight ? "-50%" : "0%",
        }}
        animate={{
          x: isRight ? "0%" : "-50%",
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        }}
          style={{
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {content.map((item, index) => {
          const isObject = typeof item === "object";

          const label = isObject ? item.label : item;
          const logo = isObject ? item.logo : null;

          return (
            <div
              key={`${label}-${index}`}
              style={{ width: itemWidth }}
              className={`
                flex
                h-20
                shrink-0
                items-center
                justify-center
                px-6
                text-sm
                font-medium
                tracking-tight
                text-neutral-500
                transition-colors
                hover:text-white
                ${
                  showBorders
                    ? "border-r border-white/10"
                    : ""
                }
              `}
            >
              {logo ? (
                <img
                  src={logo}
                  alt={label}
                  className="
                    max-h-8
                    max-w-[150px]
                    object-contain
                    opacity-40
                    grayscale
                    transition-all
                    duration-300
                    hover:opacity-100
                    hover:grayscale-0
                  "
                />
              ) : (
                label
              )}
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}