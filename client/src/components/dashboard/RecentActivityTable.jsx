import EmptyState from "./EmptyState.jsx";
import { FaHistory } from "react-icons/fa";

const TYPE_LABELS = {
  PURCHASE: "Stock received",
  SALE: "Stock sold",
  RETURN: "Return processed",
  TRANSFER_IN: "Transfer in",
  TRANSFER_OUT: "Transfer out",
  ADJUSTMENT: "Stock adjusted",
};

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Yesterday" : `${days} days ago`;
}

export default function RecentActivityTable({
  activity,
  title = "Recent activity",
  viewAllHref,
}) {
  return (
    <div className="rounded-lg border border-line bg-surface overflow-hidden px-6">
      <div className="flex items-center justify-between  py-4 mt-2  ">
        <p className="text-xl font-medium text-white">{title}</p>
      </div>

    
        <div className=" border border-line rounded-lg overflow-hidden">
          <table className="w-full text-sm ">
            <thead >
              <tr className="bg-[#1d1d1f] text-left text-faint text-sm border-b border-line">
                <th className="px-4 py-4 font-semibold uppercase">Activity</th>
                <th className="px-4 py-4 font-semibold uppercase">Warehouse</th>
                <th className="px-4 py-4 font-semibold uppercase">Performed by</th>
                <th className="px-4 py-4 font-semibold uppercase">Time</th>
                <th className="px-4 py-4 font-semibold uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {!activity?.length? (
                <tr>
                    <td colSpan={5} className="p-0">
                        <div className="flex min-h-[330px] w-full flex-col items-center justify-center text-center">
                        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/[0.06]">
                            <FaHistory size={24} className="text-faint" />
                        </div>

                        <p className="text-sm font-medium text-white">
                            No activity yet
                        </p>

                        <p className="mt-3 max-w-md text-sm text-faint">
                            Stock movements will show up here once inventory transactions
                            start happening.
                        </p>
                        </div>
                    </td>
                </tr>
              ) : (
                activity?.map((tx) => (
                  <tr
                    key={tx._id}
                    className="border-b border-line last:border-0"
                  >
                    <td className="px-5 py-3">
                      <p className="text-white font-medium">
                        {TYPE_LABELS[tx.type] || tx.type}
                      </p>
                      <p className="text-xs text-faint">
                        {tx.product?.name}
                        {tx.reference ? ` · ${tx.reference}` : ""}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {tx.warehouse?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-muted">
                      {tx.performedBy?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-faint">
                      {timeAgo(tx.createdAt)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          tx.quantity >= 0 ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        {tx.quantity >= 0 ? "+" : ""}
                        {tx.quantity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
         
          {viewAllHref && (
            <div className="px-5 py-3 border-t border-line text-right">
              <a
                href={viewAllHref}
                className="text-xs text-accent2 hover:underline"
              >
                View all activity
              </a>
            </div>
          )}
        </div>
      
    </div>
  );
}
