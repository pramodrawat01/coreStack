import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa'
import { fetchSuppliers } from '../../store/suppliersSlice.js'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'
import EmptyState from '../../components/dashboard/EmptyState.jsx'
import { usePermission } from '../../hooks/usePermission.js'
import CustomDropdown from '../../components/common/CustomDropdown.jsx'

export default function Suppliers() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canWrite = usePermission('suppliers', 'write')
  const { items: suppliers, stats, loading } = useSelector((state) => state.suppliers)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  useEffect(() => {
    dispatch(fetchSuppliers({ search, status: statusFilter }))
  }, [dispatch, search, statusFilter])

  const getInitials = (name) => {
    if (!name) return 'SU'
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">Suppliers</h1>
          <p className="text-sm text-faint mt-1">Manage supplier relationships, purchasing terms, and account performance.</p>
        </div>
        {canWrite && (
          <button
            onClick={() => navigate('/dashboard/suppliers/new')}
            className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
          >
            <FaPlus size={11} /> Add supplier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Total suppliers</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.totalSuppliers.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Active suppliers</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.activeSuppliers.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Open purchase orders</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.openPurchaseOrders.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Average lead time</p>
          <p className="mt-2 text-2xl font-bold text-white">{stats.averageLeadTime.toFixed(1)} days</p>
        </div>
      </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              type="text"
              placeholder="Search suppliers, contacts..."
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
                { value: 'All', label: 'All statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'Inactive', label: 'Inactive' },
                { value: 'Pending review', label: 'Pending review' },
              ]}
              className="w-44"
            />
            <button className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm text-muted hover:text-white">
              <FaFilter size={12} /> Filter
            </button>
          </div>
        </div>
     <div className="overflow-x-auto border-t border-line rounded-t-lg">
      <table className="w-full text-sm mb-4">
        <thead>
          <tr className="bg-[#1d1d1f] text-left text-faint text-sm border-b border-line uppercase">
            <th className="px-4 py-4 font-semibold">Supplier</th>
            <th className="px-4 py-4 font-semibold">Primary contact</th>
            <th className="px-4 py-4 font-semibold">Category</th>
            <th className="px-4 py-4 font-semibold">Open POs</th>
            <th className="px-4 py-4 font-semibold">Total purchased</th>
            <th className="px-4 py-4 font-semibold">Last delivery</th>
            <th className="px-4 py-4 font-semibold">Status</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="px-4 py-10 text-center text-faint">
                Loading…
              </td>
            </tr>
          ) : suppliers.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-0">
                <EmptyState
                  title="No suppliers found"
                  description="Get started by creating your first supplier profile."
                  actionLabel={canWrite ? 'Add supplier' : null}
                  onAction={() => navigate('/dashboard/suppliers/new')}
                />
              </td>
            </tr>
          ) : (
            suppliers.map((s) => (
              <tr
                key={s._id}
                onClick={() => navigate(`/dashboard/suppliers/${s._id}`)}
                className="border-b border-line last:border-0 hover:bg-panel/50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-xs font-bold text-accent2">
                      {getInitials(s.companyName)}
                    </div>
                    <span className="font-medium text-white">
                      {s.companyName}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {[s.primaryContact?.firstName, s.primaryContact?.lastName]
                    .filter(Boolean)
                    .join(' ') || '—'}
                </td>

                <td className="px-4 py-3">
                  {s.category || '—'}
                </td>

                <td className="px-4 py-3 font-semibold text-white">
                  {s.openPurchaseOrders || 0}
                </td>

                <td className="px-4 py-3 font-semibold text-white">
                  ${(s.totalPurchased || 0).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  {s.lastDeliveryDate
                    ? new Date(s.lastDeliveryDate).toLocaleDateString()
                    : '—'}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={s.status} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  )
}