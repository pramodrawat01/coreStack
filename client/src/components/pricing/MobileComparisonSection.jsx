


import { FaCheck, FaMinus } from "react-icons/fa";

export default function MobileComparisonSection({ section, plans }) {
  const Icon = section.icon;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
      <div className="flex items-center gap-2.5 border-b border-white/10 px-5 py-4">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/15 text-blue-300">
          <Icon size={11} />
        </span>
        <span className="text-sm font-semibold text-white">
          {section.category}
        </span>
      </div>

      {section.features.map(([feature, ...values]) => (
        <div
          key={feature}
          className="border-b border-white/10 p-5 last:border-b-0"
        >
          <p className="mb-4 text-sm text-slate-300">{feature}</p>

          <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            {plans.map((plan, i) => (
              <MobileValue
                key={plan.name}
                label={plan.name}
                value={values[i]}
                highlight={plan.highlight}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileValue({ label, value, highlight }) {
  return (
    <div
      className={`rounded-lg border px-2 py-3 ${
        highlight
          ? "border-blue-400/20 bg-blue-500/[0.07]"
          : "border-white/10 bg-white/[0.025]"
      }`}
    >
      <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      {value === true && <FaCheck size={10} className="mx-auto text-blue-300" />}
      {value === false && <FaMinus size={10} className="mx-auto text-slate-700" />}
      {typeof value === "string" && (
        <span className="text-xs text-slate-300">{value}</span>
      )}
    </div>
  );
}