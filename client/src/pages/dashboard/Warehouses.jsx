import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaMapMarkerAlt } from 'react-icons/fa'
import { fetchWarehouses, fetchWarehouseSummary } from '../../store/warehousesSlice.js'
import { usePermission } from '../../hooks/usePermission.js'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'

export default function Warehouses() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canWrite = usePermission('warehouses', 'write')
  const { items, summary } = useSelector((s) => s.warehouses)

  useEffect(() => {
    dispatch(fetchWarehouses())
    dispatch(fetchWarehouseSummary())
  }, [dispatch])

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Warehouses</h1>
          <p className="text-sm text-faint mt-1">Manage facilities, stock locations, and storage capacity</p>
        </div>
        {canWrite && (
          <button
            onClick={() => navigate('/dashboard/warehouses/new')}
            className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
          >
            <FaPlus size={11} /> Add Warehouse
          </button>
        )}
      </div>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="rounded-lg border border-line bg-surface px-4 py-3">
            <p className="text-xs text-faint">Active Facilities</p>
            <p className="text-2xl font-semibold mt-1">{summary.activeFacilities}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface px-4 py-3">
            <p className="text-xs text-faint">Total Capacity</p>
            <p className="text-2xl font-semibold mt-1">{summary.totalCapacity.toLocaleString()} sq ft</p>
            <p className="text-xs text-faint mt-0.5">{summary.utilizationPct}% utilized</p>
          </div>
          <div className="rounded-lg border border-line bg-surface px-4 py-3">
            <p className="text-xs text-faint">Stock Value Held</p>
            <p className="text-2xl font-semibold mt-1">${summary.stockValueHeld.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-line bg-surface px-4 py-3">
            <p className="text-xs text-faint">Pending Transfers</p>
            <p className="text-2xl font-semibold mt-1">{summary.pendingTransfers}</p>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.length === 0 ? (
          <p className="text-sm text-faint col-span-full text-center py-12">No warehouses yet.</p>
        ) : (
          items.map((w) => (
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
                  <p className="text-sm font-medium text-white">{w.name}</p>
                </div>
                <StatusBadge status={w.status} />
              </div>

              <p className="text-xs text-faint mt-3">Code: <span className="font-mono text-muted">{w.code || '—'}</span></p>
              <p className="text-xs text-faint">Manager: <span className="text-muted">{w.manager || '—'}</span></p>

              <div className="flex items-center justify-between mt-3 mb-1">
                <span className="text-xs text-faint">Storage capacity</span>
                <span className="text-xs text-muted">{w.percentFull}% full</span>
              </div>
              <div className="h-1.5 rounded-full bg-line overflow-hidden">
                <div
                  className={`h-full ${w.percentFull >= 90 ? 'bg-amber-400' : 'bg-accent2'}`}
                  style={{ width: `${w.percentFull}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-line text-center">
                <div>
                  <p className="text-sm font-semibold">{w.skusHeld}</p>
                  <p className="text-[10px] text-faint">SKUs held</p>
                </div>
                <div>
                  <p className="text-sm font-semibold">{w.onHandUnits}</p>
                  <p className="text-[10px] text-faint">On-hand units</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}