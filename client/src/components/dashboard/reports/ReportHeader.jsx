import { Link } from "react-router-dom";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { PERIODS } from "../../../utils/report.js";
import CustomDropdown from "../../common/CustomDropdown.jsx";
const btn =
  "rounded-md border border-line bg-panel px-3 py-2 text-sm text-white hover:bg-white/5";

export default function ReportHeader({
  title,
  subtitle,
  range,
  period,
  onPeriod,
  onExport,
  exportLabel = "Export report",
  exportDisabled,
  backTo,
}) {
  return (
    <div className="">
      {
        backTo && (
          <p className="text-sm text-faint flex items-center gap-2">
            <Link
              to={backTo}
              className="hover:text-white flex items-center gap-2  "
            >
              <FaArrowLeft size={11} />
              Reports /
            </Link>
          </p>

        )
      }

      <div className="flex flex-wrap items-start justify-between gap-4 pt-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          {range && (
            <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-faint">
              {range}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* {backTo && (
            <Link to={backTo} className={btn}>
              Back to reports
            </Link>
          )} */}
          <CustomDropdown
            value={period}
            onChange={onPeriod}
            options={PERIODS.map(([value, label]) => ({
              value,
              label,
            }))}
            className="w-36"
          />
          <button
            onClick={onExport}
            disabled={exportDisabled}
            className="inline-flex items-center gap-2 rounded-md bg-accent2 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            <FaDownload className="text-xs" /> {exportLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
