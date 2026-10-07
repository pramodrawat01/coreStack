

import { FaCheck, FaMinus } from "react-icons/fa";

export default function ComparisonValue({ value, highlight }) {
  return (
    <div
      className={`flex items-center justify-center border-t border-white/[0.06] py-4 ${
        highlight ? "bg-blue-500/[0.07]" : "bg-white/[0.025]"
      }`}
    >
      {value === true && (
        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-blue-500/20 text-blue-300 ring-1 ring-blue-400/30">
          <FaCheck size={8} />
        </span>
      )}

      {value === false && <FaMinus size={8} className="text-slate-700" />}

      {typeof value === "string" && (
        <span className="text-xs text-slate-300">{value}</span>
      )}
    </div>
  );
}