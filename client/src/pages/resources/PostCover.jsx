const TONES = {
  blue: "from-blue-500/30",
  teal: "from-teal-500/30",
  violet: "from-violet-500/30",
  amber: "from-amber-500/25",
};

// export default function PostCover({ icon: Icon, tone = "blue", big = false, className = "" }) {
//   return (
//     <div className={`relative flex items-center justify-center overflow-hidden bg-[#08080a] ${className}`}>
//       <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,var(--tw-gradient-from),transparent_60%)] ${TONES[tone]}`} />
      
//       <div
//         className={`relative flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-white/80 shadow-[0_0_60px_-10px_rgba(59,130,246,0.5)] ${
//           big ? "h-24 w-24" : "h-14 w-14"
//         }`}
//       >
//         <Icon size={big ? 34 : 20} />
//       </div>
//     </div>
//   );
// }


export default function PostCover({
  image,
  icon: Icon,
  tone = "blue",
  big = false,
  className = "",
}) {
  return (
    <div
      className={`relative overflow-hidden bg-[#08080a] ${className}`}
    >
      {image ? (
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="flex justify-center">
          <div
            className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_55%,var(--tw-gradient-from),transparent_60%)] ${TONES[tone]}`}
          />

          <div
            className={`relative flex items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-white/80 ${
              big ? "h-24 w-24" : "h-14 w-14"
            }`}
          >
            {Icon && <Icon size={big ? 34 : 20} />}
          </div>
        </div>
      )}
    </div>
  );
}