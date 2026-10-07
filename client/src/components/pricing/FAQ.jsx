import { FaCheck, FaMinus, FaPlus } from "react-icons/fa";
import {motion} from 'framer-motion'
import { useState } from "react";
// ======================================================
// FAQ DATA
// ======================================================

const FAQS = [
  {
    question: "What happens at the end of my trial?",
    answer:
      "Your workspace remains available during the trial. You can choose a plan before the trial ends and continue using Corestack without losing your operational data.",
  },
  {
    question: "Which plan is best for my business?",
    answer:
      "Standard is designed for smaller teams, while Growth is intended for businesses managing multiple warehouses and larger operational volumes. Enterprise is designed around custom requirements.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes. You can move between plans as your operational requirements change.",
  },
  {
    question: "Do you support multiple warehouses?",
    answer:
      "Yes. Warehouse support depends on the plan you choose, with higher tiers supporting larger and more complex operations.",
  },
  {
    question: "Is there an annual billing option?",
    answer:
      "Yes. Choose yearly billing above to see the annual pricing.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="border-b border-white/10">
      <div className="mx-auto max-w-5xl px-6 py-24 lg:py-32">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-500">
            FAQ
          </p>

          <h2 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {FAQS.map((faq, index) => {
            const isOpen = open === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
              >
                <button
                  onClick={() =>
                    setOpen(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-sm font-medium text-white sm:text-base">
                    {faq.question}
                  </span>

                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                    {isOpen ? (
                      <FaMinus size={9} />
                    ) : (
                      <FaPlus size={9} />
                    )}
                  </span>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-6 pr-10 text-sm leading-6 text-slate-500">
                    {faq.answer}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}