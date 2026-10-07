export default function BillingToggle({ billing, setBilling }) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] p-1">
      <button
        onClick={() => setBilling("monthly")}
        className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
          billing === "monthly"
            ? "bg-white text-black shadow-lg"
            : "text-slate-500 hover:text-white"
        }`}
      >
        Monthly
      </button>

      <button
        onClick={() => setBilling("yearly")}
        className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
          billing === "yearly"
            ? "bg-white text-black shadow-lg"
            : "text-slate-500 hover:text-white"
        }`}
      >
        Yearly

        <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
          SAVE 20%
        </span>
      </button>
    </div>
  );
}