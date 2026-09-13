// import { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { FaPlus, FaMapMarkerAlt } from 'react-icons/fa'
// import { fetchWarehouses, fetchWarehouseSummary } from '../../store/warehousesSlice.js'
// import { usePermission } from '../../hooks/usePermission.js'
// import StatusBadge from '../../components/dashboard/StatusBadge.jsx'

// import EmptyState from '../../components/dashboard/EmptyState.jsx'
// import WarehouseCardSkeleton from '../../components/dashboard/WarehouseCardSkeleton.jsx'
// import StatCardSkeleton from '../../components/dashboard/StatCardSkeleton.jsx'

// export default function Warehouses() {
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const canWrite = usePermission('warehouses', 'write')
//   const { items, summary, loading } = useSelector((s) => s.warehouses)

//   useEffect(() => {
//     dispatch(fetchWarehouses())
//     dispatch(fetchWarehouseSummary())
//   }, [dispatch])

//   return (
//     <div>
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-xl font-semibold">Warehouses</h1>
//           <p className="text-sm text-faint mt-1">Manage facilities, stock locations, and storage capacity</p>
//         </div>
//         {canWrite && (
//           <button
//             onClick={() => navigate('/dashboard/warehouses/new')}
//             className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
//           >
//             <FaPlus size={11} /> Add Warehouse
//           </button>
//         )}
//       </div>

//         {/* Stat cards — skeleton while loading, real once summary arrives */}
//        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
//         {loading || !summary ? (
//           Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
//         ) : (
//           <>
//             <div className="rounded-lg border border-line bg-surface px-4 py-3">
//               <p className="text-xs text-faint">Active Facilities</p>
//               <p className="text-2xl font-semibold mt-1">{summary.activeFacilities}</p>
//             </div>
//             <div className="rounded-lg border border-line bg-surface px-4 py-3">
//               <p className="text-xs text-faint">Total Capacity</p>
//               <p className="text-2xl font-semibold mt-1">{summary.totalCapacity.toLocaleString()} sq ft</p>
//               <p className="text-xs text-faint mt-0.5">{summary.utilizationPct}% utilized</p>
//             </div>
//             <div className="rounded-lg border border-line bg-surface px-4 py-3">
//               <p className="text-xs text-faint">Stock Value Held</p>
//               <p className="text-2xl font-semibold mt-1">${summary.stockValueHeld.toLocaleString()}</p>
//             </div>
//             <div className="rounded-lg border border-line bg-surface px-4 py-3">
//               <p className="text-xs text-faint">Pending Transfers</p>
//               <p className="text-2xl font-semibold mt-1">{summary.pendingTransfers}</p>
//             </div>
//           </>
//         )}
//       </div>

//       <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//         {items.length === 0 ? (
//           <p className="text-sm text-faint col-span-full text-center py-12">No warehouses yet.</p>
//         ) : (
//           items.map((w) => (
//             <div
//               key={w._id}
//               onClick={() => navigate(`/dashboard/warehouses/${w._id}`)}
//               className="rounded-lg border border-line bg-surface p-4 cursor-pointer hover:border-white/20 transition-colors"
//             >
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-2">
//                   <span className="h-8 w-8 rounded-md bg-white/[0.06] flex items-center justify-center shrink-0">
//                     <FaMapMarkerAlt size={12} className="text-faint" />
//                   </span>
//                   <p className="text-sm font-medium text-white">{w.name}</p>
//                 </div>
//                 <StatusBadge status={w.status} />
//               </div>

//               <p className="text-xs text-faint mt-3">Code: <span className="font-mono text-muted">{w.code || '—'}</span></p>
//               <p className="text-xs text-faint">Manager: <span className="text-muted">{w.manager || '—'}</span></p>

//               <div className="flex items-center justify-between mt-3 mb-1">
//                 <span className="text-xs text-faint">Storage capacity</span>
//                 <span className="text-xs text-muted">{w.percentFull}% full</span>
//               </div>
//               <div className="h-1.5 rounded-full bg-line overflow-hidden">
//                 <div
//                   className={`h-full ${w.percentFull >= 90 ? 'bg-amber-400' : 'bg-accent2'}`}
//                   style={{ width: `${w.percentFull}%` }}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-line text-center">
//                 <div>
//                   <p className="text-sm font-semibold">{w.skusHeld}</p>
//                   <p className="text-[10px] text-faint">SKUs held</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-semibold">{w.onHandUnits}</p>
//                   <p className="text-[10px] text-faint">On-hand units</p>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

import { useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMapMarkerAlt, FaWarehouse } from "react-icons/fa";
import {
  fetchWarehouses,
  fetchWarehouseSummary,
} from "../../store/warehousesSlice.js";
import { usePermission } from "../../hooks/usePermission.js";
import StatusBadge from "../../components/dashboard/StatusBadge.jsx";
import EmptyState from "../../components/dashboard/EmptyState.jsx";
import WarehouseCardSkeleton from "../../components/dashboard/skeleton/WarehouseCardSkeleton.jsx";
import StatCardSkeleton from "../../components/dashboard/skeleton/StatCardSkeleton.jsx";
import { fetchRecentActivity } from "../../store/warehousesSlice.js";
import RecentActivityTable from "../../components/dashboard/RecentActivityTable.jsx";
import CustomDropdown from "../../components/common/CustomDropdown.jsx";
import { FiDownload } from "react-icons/fi";

export default function Warehouses() {
  const { activity } = useSelector((s) => s.warehouses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canWrite = usePermission("warehouses", "write");
  const { items, summary, loading } = useSelector((s) => s.warehouses);

  useEffect(() => {
    dispatch(fetchWarehouses());
    dispatch(fetchWarehouseSummary());
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  const regions = useMemo(
    () => [...new Set(items.map((w) => w.state).filter(Boolean))],
    [items],
  );

  const filteredItems = useMemo(() => {
    return items.filter((w) => {
      const matchesSearch =
        !search.trim() ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        (w.code || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || w.status === statusFilter;
      const matchesRegion = regionFilter === "All" || w.state === regionFilter;
      return matchesSearch && matchesStatus && matchesRegion;
    });
  }, [items, search, statusFilter, regionFilter]);

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Warehouses</h1>
          <p className="text-sm text-faint mt-1">
            Manage facilities, stock locations, and storage capacity
          </p>
        </div>
        {canWrite && (
          <button
            onClick={() => navigate("/dashboard/warehouses/new")}
            className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
          >
            <FaPlus size={11} /> Add Warehouse
          </button>
        )}
      </div>
      {/* Stat cards — skeleton while loading, real once summary arrives */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {loading || !summary ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs text-faint">Active Facilities</p>
              <p className="text-2xl font-semibold mt-1">
                {summary.activeFacilities}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs text-faint">Total Capacity</p>
              <p className="text-2xl font-semibold mt-1">
                {summary.totalCapacity.toLocaleString()} sq ft
              </p>
              <p className="text-xs text-faint mt-0.5">
                {summary.utilizationPct}% utilized
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs text-faint">Stock Value Held</p>
              <p className="text-2xl font-semibold mt-1">
                ${summary.stockValueHeld.toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs text-faint">Pending Transfers</p>
              <p className="text-2xl font-semibold mt-1">
                {summary.pendingTransfers}
              </p>
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center gap-3 mt-6">
        <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm flex-1">
          <FaSearch size={12} className="text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search warehouses by name or code"
            className="bg-transparent outline-none text-white placeholder:text-faint flex-1"
          />
        </div>
        <CustomDropdown
          options={[
            { value: "All", label: "All statuses" },
            { value: "Active", label: "Active" },
            { value: "Review", label: "Review" },
            { value: "Inactive", label: "Inactive" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-40"
        />
        
        <CustomDropdown
          options={[
            { value: "All", label: "All regions" },
            ...regions.map((r) => ({
              value: r,
              label: r,
            })),
          ]}
          value={regionFilter}
          onChange={setRegionFilter}
          className="w-40"
        />
        <div className="flex items-center gap-2">
  <button
    type="button"
    className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm text-white hover:bg-white/[0.04] transition-colors"
  >
    <FiDownload size={14} />
    Export
  </button>

  <button
    type="button"
    className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-white hover:bg-white/[0.04] transition-colors"
  >
    CardsTable
  </button>
</div>
      </div>

      {/* Card grid — skeleton while loading, empty state once we KNOW there's nothing, real cards otherwise */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <WarehouseCardSkeleton key={i} />
          ))
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={FaWarehouse}
              title="No warehouses yet"
              description="Add your first facility to start tracking stock locations and storage capacity."
              actionLabel={canWrite ? "Add Warehouse" : undefined}
              onAction={
                canWrite
                  ? () => navigate("/dashboard/warehouses/new")
                  : undefined
              }
            />
          </div>
        ) : (
          filteredItems.map((w) => (
            <div
              key={w._id}
              onClick={() => navigate(`/dashboard/warehouses/${w._id}`)}
              className="rounded-lg border border-line bg-surface p-4 cursor-pointer hover:border-white/20 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-md bg-white/[0.06] flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt size={12} className="text-faint" />
                  </span>
                  <p className="text-xl font-medium text-white">{w.name}</p>
                </div>
                <StatusBadge status={w.status} />
              </div>

              <p className="text-xs text-faint mt-4">
                Code:{" "}
                <span className="font-mono text-muted under">
                  {w.code || "—"}
                </span>
              </p>
              <p className="text-xs text-faint mt-1">
                Manager: <span className="text-muted">{w.manager || "—"}</span>
              </p>

              <div className="flex items-center justify-between mt-4 ">
                <span className="text-sm text-faint">Storage capacity</span>
                <span className="text-xs text-muted">
                  {w.percentFull}% full
                </span>
              </div>
              <div className="h-1.5 mt-3 rounded-full bg-line overflow-hidden">
                <div
                  className={`h-full ${w.percentFull >= 90 ? "bg-amber-400" : "bg-accent2"}`}
                  style={{ width: `${w.percentFull}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-line text-center">
                <div>
                  <p className="text-sm font-semibold">{w.skusHeld}</p>
                  <p className="text-[10px] text-faint">SKUs held</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{w.onHandUnits}</p>
                  <p className="text-[10px] text-faint">On-hand units</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {w?.pendingTransfers || 0}
                  </p>
                  <p className="text-[10px] text-faint">Pending Shipment</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

<div className="mt-6">
  <RecentActivityTable activity={activity} title="Recent warehouse activity" />
</div>
    </div>
  );
}
