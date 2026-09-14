import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaSearch, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa'
import { fetchInventory, fetchInventorySummary } from '../../store/inventorySlice.js'
import { fetchWarehouses, fetchRecentActivity } from '../../store/warehousesSlice.js'
import { usePermission } from '../../hooks/usePermission.js'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'
import EmptyState from '../../components/dashboard/EmptyState.jsx'
import StatCardSkeleton from '../../components/dashboard/skeleton/StatCardSkeleton.jsx'
import RecentActivityTable from '../../components/dashboard/RecentActivityTable.jsx'
import CustomDropdown from '../../components/common/CustomDropdown.jsx'

export default function Inventory() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canWrite = usePermission('inventory', 'write')

  const { items, summary, loading } = useSelector((s) => s.inventory)
  const { items: warehouses, activity } = useSelector((s) => s.warehouses)

  const [search, setSearch] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    dispatch(fetchWarehouses())
    dispatch(fetchInventorySummary())
    dispatch(fetchRecentActivity())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchInventory({ search, warehouse: warehouseFilter, status: statusFilter, page: 1, limit: 100 }))
  }, [dispatch, search, warehouseFilter, statusFilter])

  const lowStockCount = summary?.lowStockItems || 0

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Inventory</h1>
          <p className="text-sm text-faint mt-1">Track stock levels across warehouses</p>
        </div>
        {canWrite && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/dashboard/inventory/adjust')}
              className="rounded-md border border-line bg-surface px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.04] transition-colors"
            >
              Stock Adjustment
            </button>
            <button
              onClick={() => navigate('/dashboard/inventory/transfer')}
              className="rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
            >
              Transfer Stock
            </button>
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        {loading || !summary ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs text-faint">Total SKUs</p>
              <p className="text-2xl font-semibold mt-1">{summary.totalSKUs}</p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs text-faint">Total Stock Value</p>
              <p className="text-2xl font-semibold mt-1">${summary.totalStockValue.toLocaleString()}</p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs text-faint">Low Stock Items</p>
              <p className="text-2xl font-semibold mt-1 text-amber-400">{summary.lowStockItems}</p>
            </div>
            <div className="rounded-lg border border-line bg-surface px-4 py-3">
              <p className="text-xs text-faint">Out of Stock</p>
              <p className="text-2xl font-semibold mt-1 text-red-400">{summary.outOfStock}</p>
            </div>
          </>
        )}
      </div>

      {/* Warehouse tabs */}
      <div className="flex items-center gap-1 mt-6 border-b border-line pb-px overflow-x-auto">
        {['All', ...warehouses.map((w) => w._id)].map((id) => {
          const label = id === 'All' ? 'All Warehouses' : warehouses.find((w) => w._id === id)?.name
          const active = warehouseFilter === id
          return (
            <button
              key={id}
              onClick={() => setWarehouseFilter(id)}
              className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                active ? 'border-accent2 text-white' : 'border-transparent text-faint hover:text-white'
              }`}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* Low stock banner */}
      {lowStockCount > 0 && (
        <div className="flex items-center justify-between mt-4 rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3">
          <p className="flex items-center gap-2 text-sm text-amber-300">
            <FaExclamationTriangle size={12} />
            {lowStockCount} product{lowStockCount > 1 ? 's are' : ' is'} below their reorder point
          </p>
          <button onClick={() => setStatusFilter('Low Stock')} className="text-xs text-amber-300 hover:underline">
            View all
          </button>
        </div>
      )}

      {/* Search + status filter */}
      <div className="flex items-center gap-3 mt-6">
        <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm flex-1">
          <FaSearch size={12} className="text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name or SKU"
            className="bg-transparent outline-none text-white placeholder:text-faint flex-1"
          />
        </div>
        <CustomDropdown
          options={[
            { value: 'All', label: 'All statuses' },
            { value: 'In Stock', label: 'In Stock' },
            { value: 'Low Stock', label: 'Low Stock' },
            { value: 'Out of Stock', label: 'Out of Stock' },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-44"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-line bg-surface overflow-hidden mt-4 px-6 ">
        <div className=" py-4">
          <p className="text-xl font-medium text-white">Inventory Stock Levels</p>
        </div>
        <div className="overflow-x-auto border-t border-line rounded-t-lg">
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="bg-[#1d1d1f] text-left text-faint text-sm border-b border-line uppercase ">
                <th className="px-4 py-4 font-semibold">Product</th>
                <th className="px-4 py-4 font-semibold">Warehouse</th>
                <th className="px-4 py-4 font-semibold">On Hand</th>
                <th className="px-4 py-4 font-semibold">Reserved</th>
                <th className="px-4 py-4 font-semibold">Available</th>
                <th className="px-4 py-4 font-semibold">Reorder Point</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-faint">Loading…</td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-0">
                    <EmptyState
                      classname={'rounded-t-0 border-t-0'}
                      icon={FaBoxOpen}
                      title="No stock records yet"
                      description="Products assigned to a warehouse will show up here."
                    />
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={`${row.product._id}_${row.warehouse._id}`} className="border-b border-line last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-white font-medium">{row.product.name}</p>
                      <p className="text-xs text-faint font-mono">{row.product.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-muted">{row.warehouse.name}</td>
                    <td className="px-4 py-3 text-white">{row.quantity}</td>
                    <td className="px-4 py-3 text-muted">{row.reserved}</td>
                    <td className="px-4 py-3 text-muted">{row.available}</td>
                    <td className="px-4 py-3 text-muted">{row.product.reorderPoint}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {canWrite && (
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/inventory/adjust?productId=${row.product._id}&warehouseId=${row.warehouse._id}`
                            )
                          }
                          className="text-xs text-accent2 hover:underline"
                        >
                          Adjust
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <RecentActivityTable activity={activity} title="Recent Inventory Transactions" />
      </div>
    </div>
  )
}