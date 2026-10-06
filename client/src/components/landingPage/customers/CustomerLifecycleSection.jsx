import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";

export default function CustomerLifecycleSection() {
  const sectionRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Customer acquisition",
      description:
        "Capture the account, contacts, requirements and commercial context.",
    },
    {
      number: "02",
      title: "Orders & fulfillment",
      description:
        "Connect customer demand directly to inventory and fulfillment.",
    },
    {
      number: "03",
      title: "Payments & invoices",
      description:
        "Track billing, payments and outstanding balances without leaving the account.",
    },
    {
      number: "04",
      title: "Account growth",
      description:
        "Use operational history to identify opportunities and strengthen relationships.",
    },
  ];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const step = Math.min(
      steps.length - 1,
      Math.floor(latest * steps.length)
    );

    setActiveStep(step);
  });

  return (
    <div
      ref={sectionRef}
      className="relative min-h-[300vh]"
    >

      {/* STICKY CONTENT */}
      <div className="sticky top-0 flex min-h-screen items-center">

        <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">

          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div className="relative">

              <div className="lg:sticky lg:top-28">

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >

                  <div className="text-xs uppercase tracking-[0.25em] text-blue-500">
                    ONE CUSTOMER, COMPLETE CONTEXT
                  </div>

                  <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[0.95] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                    From first order
                    <br />
                    to long-term account.
                  </h2>

                  <p className="mt-7 max-w-md text-base leading-7 text-slate-500">
                    Corestack connects the entire customer lifecycle so your
                    teams don't have to reconstruct context every time they
                    interact.
                  </p>

                  {/* Progress indicator */}

                  <div className="mt-12 flex items-center gap-3">

                    {steps.map((step, index) => (
                      <div
                        key={step.number}
                        className="flex items-center gap-2"
                      >
                        <motion.div
                          animate={{
                            width: activeStep === index ? 28 : 8,
                            opacity:
                              activeStep === index ? 1 : 0.25,
                          }}
                          transition={{
                            duration: 0.3,
                          }}
                          className="h-1 rounded-full bg-blue-500"
                        />

                        {index < steps.length - 1 && (
                          <div className="h-px w-3 bg-white/10" />
                        )}
                      </div>
                    ))}

                  </div>

                  {/* Current step */}

                  <div className="mt-5 text-xs text-neutral-600">
                    0{activeStep + 1} / 04
                  </div>

                </motion.div>

              </div>

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="relative h-[70vh]">

              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[#050608]">

                {/* Ambient glow */}

                <motion.div
                  animate={{
                    opacity: [0.15, 0.25, 0.15],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute -right-32 -top-32 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]"
                />

                {/* Cards */}

                {steps.map((step, index) => {

                  const isActive = activeStep === index;

                  return (
                    <motion.div
                      key={step.number}
                      initial={false}
                      animate={{
                        opacity: isActive ? 1 : 0,
                        y: isActive
                          ? 0
                          : index < activeStep
                          ? -80
                          : 80,
                        scale: isActive ? 1 : 0.96,
                      }}
                      transition={{
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute inset-0 flex items-center justify-center p-6 sm:p-10"
                    >

                      <div
                        className={`
                          relative
                          w-full
                          max-w-2xl
                          overflow-hidden
                          rounded-2xl
                          border
                          p-8
                          sm:p-10
                          transition-colors
                          duration-500
                          ${
                            isActive
                              ? "border-blue-500/30 bg-[#0a0d14]"
                              : "border-white/10 bg-[#08090b]"
                          }
                        `}
                      >

                        {/* Number */}

                        <div className="flex items-start gap-7">

                          <motion.div
                            animate={{
                              color: isActive
                                ? "#3b82f6"
                                : "#525252",
                            }}
                            className="text-2xl font-medium"
                          >
                            {step.number}
                          </motion.div>

                          <div className="flex-1">

                            <motion.h3
                              animate={{
                                x: isActive ? 0 : 4,
                              }}
                              className="text-2xl font-medium text-white sm:text-3xl"
                            >
                              {step.title}
                            </motion.h3>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
                              {step.description}
                            </p>

                            {/* Fake operational UI */}

                            <div className="mt-10 overflow-hidden rounded-xl border border-white/10 bg-black/40">

                              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

                                <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-600">
                                  Corestack workflow
                                </span>

                                <span className="flex items-center gap-2 text-[10px] text-emerald-400">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                                  Live
                                </span>

                              </div>

                              <div className="space-y-2 p-4">

                                {[1, 2, 3].map((item) => (
                                  <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{
                                      opacity: isActive ? 1 : 0,
                                      x: isActive ? 0 : -10,
                                    }}
                                    transition={{
                                      delay: isActive
                                        ? item * 0.08
                                        : 0,
                                    }}
                                    className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                                  >
                                    <div className="flex items-center gap-3">

                                      <div className="h-2 w-2 rounded-full bg-blue-500" />

                                      <span className="text-xs text-neutral-400">
                                        {index === 0 &&
                                          [
                                            "New customer created",
                                            "Contact information synced",
                                            "Account context captured",
                                          ][item - 1]}

                                        {index === 1 &&
                                          [
                                            "Order received",
                                            "Inventory allocated",
                                            "Fulfillment started",
                                          ][item - 1]}

                                        {index === 2 &&
                                          [
                                            "Invoice generated",
                                            "Payment received",
                                            "Balance updated",
                                          ][item - 1]}

                                        {index === 3 &&
                                          [
                                            "Customer history analyzed",
                                            "Opportunity detected",
                                            "Account growth triggered",
                                          ][item - 1]}
                                      </span>

                                    </div>

                                    <span className="text-[9px] text-neutral-700">
                                      synced
                                    </span>

                                  </motion.div>
                                ))}

                              </div>

                            </div>

                          </div>

                        </div>

                        {/* Bottom progress */}

                        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">

                          <motion.div
                            animate={{
                              width: isActive ? "100%" : "0%",
                            }}
                            transition={{
                              duration: 0.8,
                            }}
                            className="h-full bg-blue-500"
                          />

                        </div>

                      </div>

                    </motion.div>
                  );
                })}

                {/* Step indicator on right */}

                <div className="absolute bottom-6 right-6 z-20 flex gap-2">

                  {steps.map((step, index) => (
                    <div
                      key={step.number}
                      className={`
                        h-1.5 rounded-full transition-all duration-300
                        ${
                          activeStep === index
                            ? "w-8 bg-blue-500"
                            : "w-2 bg-white/20"
                        }
                      `}
                    />
                  ))}

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}