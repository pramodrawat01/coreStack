import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { FaPen, FaTrash, FaMapMarkerAlt } from 'react-icons/fa'
import { fetchWarehouse, deleteWarehouse, clearCurrentWarehouse } from '../../store/warehousesSlice.js'
import { usePermission } from '../../hooks/usePermission.js'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'
import { notifySuccess, notifyError } from '../../lib/toast.js'

export default function WarehouseDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canWrite = usePermission('warehouses', 'write')
  const { current: warehouse } = useSelector((s) => s.warehouses)

  useEffect(() => {
    dispatch(fetchWarehouse(id))
    return () => dispatch(clearCurrentWarehouse())
  }, [dispatch, id])

  const handleDelete = async () => {
    if (!confirm(`Delete "${warehouse.name}"? This can't be undone.`)) return
    try {
      await dispatch(deleteWarehouse(id)).unwrap()
      notifySuccess('Warehouse deleted')
      navigate('/dashboard/warehouses')
    } catch (err) {
      notifyError(err || 'Could not delete this warehouse')
    }
  }

  if (!warehouse) return null

  return (
    <div>
      <div className="flex items-start justify-between">
        <p className="text-sm text-faint">
          <Link to="/dashboard/warehouses" className="hover:text-white">Warehouses</Link> / <span className="text-white">{warehouse.name}</span>
        </p>
        {canWrite && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/dashboard/warehouses/${id}/edit`)}
              className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-white hover:border-white/40 transition-colors"
            >
              <FaPen size={11} /> Edit Warehouse
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/15 transition-colors"
            >
              <FaTrash size={11} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <span className="h-10 w-10 rounded-md bg-white/[0.06] flex items-center justify-center">
          <FaMapMarkerAlt size={16} className="text-faint" />
        </span>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">{warehouse.name}</h1>
            <StatusBadge status={warehouse.status} />
          </div>
          <p className="text-xs text-faint mt-0.5">Code: <span className="font-mono text-muted">{warehouse.code || '—'}</span></p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-6">
        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm font-medium mb-4">Facility details</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-faint">Manager</p>
              <p className="text-sm font-medium mt-0.5">{warehouse.manager || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-faint">Storage capacity</p>
              <p className="text-sm font-medium mt-0.5">{warehouse.storageCapacity.toLocaleString()} sq ft</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-faint">Address</p>
              <p className="text-sm font-medium mt-0.5">
                {warehouse.address ? `${warehouse.address}, ${warehouse.city}, ${warehouse.state} ${warehouse.zipCode}` : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <p className="text-sm font-medium mb-4">Storage capacity</p>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-faint">{warehouse.percentFull}% full</span>
            <span className="text-xs text-faint">{warehouse.onHandUnits.toLocaleString()} / {warehouse.storageCapacity.toLocaleString()} units</span>
          </div>
          <div className="h-2 rounded-full bg-line overflow-hidden mb-5">
            <div
              className={`h-full ${warehouse.percentFull >= 90 ? 'bg-amber-400' : 'bg-accent2'}`}
              style={{ width: `${warehouse.percentFull}%` }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-4 border-t border-line">
            <div>
              <p className="text-sm font-semibold">{warehouse.skusHeld}</p>
              <p className="text-[10px] text-faint">SKUs held</p>
            </div>
            <div>
              <p className="text-sm font-semibold">{warehouse.onHandUnits}</p>
              <p className="text-[10px] text-faint">On-hand units</p>
            </div>
            <div>
              <p className="text-sm font-semibold">{warehouse.pendingShipments}</p>
              <p className="text-[10px] text-faint">Pending shipments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}