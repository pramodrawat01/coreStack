// import { motion } from "framer-motion";
// import { FaCheck, FaArrowRight } from "react-icons/fa";
// import { useState } from "react";

// export default function PricingCard({
//   tier,
//   billing,
//   index,
//   variants,
// }) {
//   const [addonEnabled, setAddonEnabled] = useState(false);

//   const price =
//     billing === "monthly"
//       ? tier.monthly
//       : tier.yearly;

//   const isFree = tier.name === "Free";
//   const isEnterprise = tier.name === "Enterprise";

//   return (
//     <motion.div
//       variants={variants}
//       transition={{
//         duration: 0.6,
//         delay: index * 0.08,
//         ease: [0.22, 1, 0.36, 1],
//       }}
//       className={`
//         relative
//         flex
//         h-full
//         min-h-[650px]
//         flex-col
//         rounded-[20px]
//         p-[5px]

//         ${
//           tier.highlight
//             ? `
//               bg-gradient-to-b
//               from-blue-500
//               via-blue-400
//               to-blue-500
//             `
//             : "bg-transparent"
//         }
//       `}
//     >

//       {/* ==================================================
//           CARD
//       ================================================== */}

//       <div
//         className={`
//           relative
//           flex
//           h-full
//           flex-col
//           overflow-hidden
//           rounded-[16px]
//           border
//           p-6
//           sm:p-7

//           ${
//             tier.highlight
//               ? `
//                 border-transparent
//                 bg-[#07101f]
//               `
//               : `
//                 border-white/10
//                 bg-white/[0.025]
//               `
//           }
//         `}
//       >

//         {/* ==================================================
//             POPULAR PLAN
//         ================================================== */}

//         {tier.highlight && (
//           <div
//             className="
//               absolute
//               left-0
//               right-0
//               top-0
//               flex
//               h-8
//               items-center
//               justify-center
//               bg-blue-500
//               text-[10px]
//               font-semibold
//               uppercase
//               tracking-[0.16em]
//               text-white
//             "
//           >
//             Popular plan
//           </div>
//         )}

//         {/* ==================================================
//             TOP CONTENT
//         ================================================== */}

//         <div className={tier.highlight ? "pt-7" : ""}>

//           {/* Plan name */}
//           <h3
//             className="
//               text-2xl
//               font-semibold
//               tracking-tight
//               text-white
//             "
//           >
//             {tier.name}
//           </h3>

//           {/* Addon toggle */}
//           {tier.addon && (
//             <div className="mt-3 flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() =>
//                   setAddonEnabled((prev) => !prev)
//                 }
//                 className={`
//                   relative
//                   h-4
//                   w-7
//                   shrink-0
//                   rounded-full
//                   transition-colors
//                   duration-200

//                   ${
//                     addonEnabled
//                       ? "bg-blue-500"
//                       : "bg-white/20"
//                   }
//                 `}
//               >
//                 <span
//                   className={`
//                     absolute
//                     top-0.5
//                     h-3
//                     w-3
//                     rounded-full
//                     bg-white
//                     shadow
//                     transition-transform
//                     duration-200

//                     ${
//                       addonEnabled
//                         ? "translate-x-3.5"
//                         : "translate-x-0.5"
//                     }
//                   `}
//                 />
//               </button>

//               <span className="text-xs text-blue-400">
//                 {tier.addonLabel}
//               </span>
//             </div>
//           )}

//           {/* Description */}
//           <p
//             className="
//               mt-4
//               min-h-[58px]
//               text-sm
//               leading-6
//               text-slate-500
//             "
//           >
//             {tier.description}
//           </p>

//         </div>

//         {/* ==================================================
//             PRICE
//         ================================================== */}

//         <div className="mt-8 min-h-[72px]">

//           {/* FREE */}
//           {isFree && (
//             <div className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
//               Always free
//             </div>
//           )}

//           {/* ENTERPRISE */}
//           {isEnterprise && (
//             <div className="flex items-end gap-1">
//               <span className="mb-1 text-xs text-slate-500">
//                 {tier.enterprisePrefix}
//               </span>

//               <span className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
//                 {tier.enterprisePrice}
//               </span>

//               <span className="mb-1 text-xs text-slate-500">
//                 {tier.enterprisePeriod}
//               </span>
//             </div>
//           )}

//           {/* PAID */}
//           {!isFree && !isEnterprise && (
//             <div className="flex items-end">

//               <span
//                 className="
//                   text-5xl
//                   font-semibold
//                   tracking-[-0.05em]
//                   text-white
//                 "
//               >
//                 ${price}
//               </span>

//               <span
//                 className="
//                   mb-2
//                   ml-1
//                   text-xs
//                   text-slate-500
//                 "
//               >
//                 /mo
//               </span>

//             </div>
//           )}

//         </div>

//         {/* Yearly label */}
//         {billing === "yearly" &&
//           !isFree &&
//           !isEnterprise && (
//             <div className="mt-1 text-xs text-blue-400">
//               Billed yearly · Save 20%
//             </div>
//           )}

//         {/* ==================================================
//             CTA
//         ================================================== */}

//         <button
//           type="button"
//           className={`
//             group
//             mt-7
//             flex
//             w-full
//             items-center
//             justify-between
//             rounded-lg
//             border
//             px-4
//             py-3
//             text-sm
//             font-medium
//             transition-all
//             duration-300

//             ${
//               tier.highlight
//                 ? `
//                   border-transparent
//                   bg-white
//                   text-black
//                   hover:bg-neutral-200
//                 `
//                 : `
//                   border-white/20
//                   bg-white/[0.03]
//                   text-white
//                   hover:border-white/30
//                   hover:bg-white/[0.07]
//                 `
//             }
//           `}
//         >
//           <span>{tier.cta}</span>

//           <FaArrowRight
//             size={12}
//             className="
//               transition-transform
//               duration-300
//               group-hover:translate-x-1
//             "
//           />
//         </button>

//         {/* ==================================================
//             DIVIDER
//         ================================================== */}

//         <div className="my-7 h-px bg-white/10" />

//         {/* ==================================================
//             FEATURES
//         ================================================== */}

//         <div className="flex-1">

//           <p
//             className="
//               mb-5
//               text-[10px]
//               font-medium
//               uppercase
//               tracking-[0.18em]
//               text-slate-600
//             "
//           >
//             Includes
//           </p>

//           <ul className="space-y-3.5">

//             {tier.features.map((feature) => (
//               <li
//                 key={feature}
//                 className="
//                   flex
//                   items-start
//                   gap-3
//                   text-xs
//                   leading-5
//                   text-slate-400
//                 "
//               >
//                 <span
//                   className="
//                     mt-0.5
//                     flex
//                     h-4
//                     w-4
//                     shrink-0
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-blue-500/10
//                   "
//                 >
//                   <FaCheck
//                     size={7}
//                     className="text-blue-400"
//                   />
//                 </span>

//                 <span>{feature}</span>
//               </li>
//             ))}

//           </ul>
//         </div>

//         {/* ==================================================
//             SUBTLE HOVER GLOW
//         ================================================== */}

//         <div
//           className={`
//             pointer-events-none
//             absolute
//             -bottom-24
//             left-1/2
//             h-40
//             w-40
//             -translate-x-1/2
//             rounded-full
//             bg-blue-500/10
//             blur-[70px]
//             transition-opacity
//             duration-500

//             ${
//               tier.highlight
//                 ? "opacity-100"
//                 : "opacity-0 group-hover:opacity-100"
//             }
//           `}
//         />

//       </div>
//     </motion.div>
//   );
// }

















import { motion } from "framer-motion";
import { FaCheck, FaArrowRight } from "react-icons/fa";
import { useState } from "react";

const TONES = {
//   blue: "bg-blue-100 text-blue-600",
//   teal: "bg-teal-100 text-teal-600",
//   violet: "bg-violet-100 text-violet-600",
//   lime: "bg-lime-100 text-lime-700",
blue: "bg-blue-500/15 text-blue-300",
  teal: "bg-teal-500/15 text-teal-300",
  violet: "bg-violet-500/15 text-violet-300",
  lime: "bg-lime-500/15 text-lime-300",
};

export default function PricingCard({ tier, billing, index, variants }) {
  const [addonEnabled, setAddonEnabled] = useState(false);

  const isFree = tier.name === "Free";
  const isEnterprise = tier.name === "Enterprise";
  const yearly = billing === "yearly";
  const price = yearly ? tier.yearly : tier.monthly;
  const savePct = tier.monthly
    ? Math.round((1 - tier.yearly / tier.monthly) * 100)
    : 0;

  return (
    <motion.div
      variants={variants}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        relative flex h-full min-h-[650px] flex-col
        rounded-[26px] px-[5px] pb-[5px] pt-11
        ${
          tier.highlight
            ? "bg-[linear-gradient(180deg,#2f5fb8_0%,#4fb3a8_35%,#f09a8c_70%,#c4a8f5_100%)]"
            : ""
        }
      `}
    >
      {/* POPULAR LABEL */}
      {tier.highlight && (
        <span className="absolute left-5 top-0 flex h-11     items-center text-[12px] font-semibold uppercase tracking-[0.12em] text-white">
          Popular plan
        </span>
      )}

      {/* OUTER PANEL */}
      <div className="flex h-full flex-col rounded-[22px] bg-[#0e1420] p-1.5 ring-1 ring-white/10">

        {/* ======== TOP WHITE CARD ======== */}
        <div className="rounded-2xl bg-gradient-to-b from-[#1b2740] to-[#141d30] p-6 ring-1 ring-white/10">

          <h3 className=" font-serif text-[28px] leading-none tracking-tight text-white">
            {tier.name}
          </h3>

          {/* Addon toggle (placeholder keeps rows aligned) */}
          <div className="mt-3 flex h-5 items-center gap-2">
            {tier.addon && (
              <>
                <button
                  type="button"
                  onClick={() => setAddonEnabled((p) => !p)}
                  className={`relative h-4 w-7 shrink-0 rounded-full transition-colors duration-200 ${
                    addonEnabled ? "bg-blue-500" : "bg-white/20"
                  }`}
                >
                  <span
                  className={`absolute left-0 top-0.5 h-3 w-3 rounded-full bg-white shadow transition-all duration-200 ${
                      addonEnabled ? "translate-x-3.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
                <span className="text-xs text-blue-300">
                  {tier.addonLabel}
                </span>
              </>
            )}
          </div>

          {/* PRICE */}
          <div className="mt-6 flex min-h-[64px] items-end">
            {isFree && (
              <div className="font-serif text-[32px] leading-none text-white">
                Always free
              </div>
            )}

            {isEnterprise && (
              <div className="flex items-end gap-1">
                <span className="mb-1.5 text-xs text-slate-500">
                  {tier.enterprisePrefix}
                </span>
                <span className="font-serif text-[40px] leading-none text-white">
                  {tier.enterprisePrice}
                </span>
                <span className="mb-1.5 text-xs text-slate-500">
                  {tier.enterprisePeriod}
                </span>
              </div>
            )}

            {!isFree && !isEnterprise && (
              <div className="flex items-end gap-1.5">
                <span className="font-serif text-[40px] leading-none text-white">
                  ${price}
                </span>
                <span className="mb-1.5 text-[11px] text-slate-500 underline decoration-dotted underline-offset-2">
                  /mo
                </span>
                {yearly && (
                  <span className="mb-1.5 ml-1 rounded bg-blue-500/15 px-1.5 py-0.5 text-[10px] text-blue-300">
                    Save {savePct}%
                  </span>
                )}
              </div>
            )}
          </div>

          {/* CTA */}
          <button
            type="button"
            className={`group mt-5 flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition-colors duration-300 ${
              tier.highlight
                ? "border-transparent bg-white text-[#0b1220] hover:bg-slate-200"
                : "border-white/20 bg-white/[0.04] text-white hover:bg-white/10"
            }`}
          >
            <span>{tier.cta}</span>
            <FaArrowRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* ======== FEATURES ======== */}
        <div className="flex-1 px-3 pb-4 pt-5">
          <p className="mb-4 text-[11px] text-slate-500">
            {tier.includesLabel}
          </p>

          {tier.groups.map((group, i) => {
            const locked = group.disabled || (group.addon && !addonEnabled);
            const Icon = group.icon;

            return (
              <div
                key={group.title}
                className={`${
                  i > 0 ? "mt-4 border-t border-white/10 pt-4" : ""
                } ${locked ? "opacity-40" : ""}`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-md ${TONES[group.tone]}`}
                  >
                    <Icon size={10} />
                  </span>
                  <span className="text-[13px] font-semibold text-white">
                    {group.title}
                  </span>
                  {locked && (
                    <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-400">
                      Not included
                    </span>
                  )}
                </div>

                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs leading-5 text-slate-300"
                    >
                      <FaCheck size={9} className="mt-1.5 shrink-0 text-blue-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}