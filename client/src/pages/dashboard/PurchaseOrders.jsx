import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa'
import { fetchPurchaseOrders } from '../../store/purchaseOrdersSlice.js'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'
import EmptyState from '../../components/dashboard/EmptyState.jsx'
import { usePermission } from '../../hooks/usePermission.js'
import CustomDropdown from '../../components/common/CustomDropdown.jsx'

const STATUS_LABELS = {
  Draft: 'Draft',
  Submitted: 'Pending approval',
  Approved: 'Approved',
  'In transit': 'In transit',
  Received: 'Received',
  Cancelled: 'Cancelled',
}

export default function PurchaseOrders() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canWrite = usePermission('purchases', 'write')
  const { items: purchaseOrders, stats , loading } = useSelector((s) => s.purchaseOrders)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All statuses')

  useEffect(() => {
    dispatch(fetchPurchaseOrders({ search, status: statusFilter }))
  }, [dispatch, search, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Purchase Orders</h1>
          <p className="text-sm text-faint mt-1">Create and track supplier purchasing commitments</p>
        </div>
        {canWrite && (
          <button
            onClick={() => navigate('/dashboard/purchase-orders/new')}
            className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
          >
            <FaPlus size={11} /> Create purchase order
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Open POs</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.openPOs}</p>
          <span className="text-xs font-medium text-amber-400">${stats.openCommitted?.toLocaleString()} committed</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Awaiting approval</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.awaitingApproval}</p>
          <span className="text-xs font-medium text-faint">${stats.awaitingApprovalValue?.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">In transit</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.inTransit}</p>
          <span className="text-xs font-medium text-faint">${stats.inTransitValue?.toLocaleString()}</span>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Received this month</p>
          <p className="mt-2 text-2xl font-bold text-white">${stats.receivedThisMonth?.toLocaleString()}</p>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              type="text"
              placeholder="Search PO number or supplier"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-line bg-panel pl-9 pr-4 py-2 text-sm text-white placeholder-faint focus:border-accent2 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <CustomDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'All statuses', label: 'All statuses' },
                { value: 'Draft', label: 'Draft' },
                { value: 'Submitted', label: 'Pending approval' },
                { value: 'Approved', label: 'Approved' },
                { value: 'In transit', label: 'In transit' },
                { value: 'Received', label: 'Received' },
                { value: 'Cancelled', label: 'Cancelled' },
              ]}
              className="w-44"
            />
            <button className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm text-muted hover:text-white">
              <FaFilter size={12} /> Filter
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-faint">Loading…</div>
        ) : purchaseOrders.length === 0 ? (
          <EmptyState
            title="No purchase orders found"
            description="Get started by creating your first purchase order."
            actionLabel={canWrite ? 'Create purchase order' : null}
            onAction={() => navigate('/dashboard/purchase-orders/new')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted">
              <thead className="border-b border-line text-xs font-mono uppercase text-faint">
                <tr>
                  <th className="pb-3 pt-2 font-medium">PO number</th>
                  <th className="pb-3 pt-2 font-medium">Supplier</th>
                  <th className="pb-3 pt-2 font-medium">Created</th>
                  <th className="pb-3 pt-2 font-medium">Expected</th>
                  <th className="pb-3 pt-2 font-medium">Items</th>
                  <th className="pb-3 pt-2 font-medium">Total</th>
                  <th className="pb-3 pt-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/50">
                {purchaseOrders.map((po) => (
                  <tr
                    key={po._id}
                    onClick={() => navigate(`/dashboard/purchase-orders/${po._id}`)}
                    className="hover:bg-panel/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-medium text-accent2">#{po.poNumber}</td>
                    <td className="py-3 text-white">{po.supplierName}</td>
                    <td className="py-3">{new Date(po.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      {po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : '—'}
                    </td>
                    <td className="py-3">{po.items?.length || 0}</td>
                    <td className="py-3 font-semibold text-white">${po.totalCost.toLocaleString()}</td>
                    <td className="py-3">
                      <StatusBadge status={STATUS_LABELS[po.status] || po.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}