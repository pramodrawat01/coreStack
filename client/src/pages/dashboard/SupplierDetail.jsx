import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaEdit, FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa'
import { fetchSupplierById } from '../../store/suppliersSlice.js'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'
import { usePermission } from '../../hooks/usePermission.js'
import { SkeletonText } from '../../components/dashboard/skeleton/Skeleton.jsx'

export default function SupplierDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const canWrite = usePermission('suppliers', 'write')
  const { currentSupplier: supplier } = useSelector((state) => state.suppliers)

  useEffect(() => {
    dispatch(fetchSupplierById(id))
  }, [dispatch, id])

  if (!supplier) {
    return <SkeletonText />
  }

  const initials = supplier.companyName
    ? supplier.companyName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'SU'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{supplier.companyName}</h1>
          <p className="text-sm text-muted">
            Supplier account since{' '}
            {new Date(supplier.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard/suppliers')}
            className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface"
          >
            Back to suppliers
          </button>
          {canWrite && (
            <button
              onClick={() => navigate(`/dashboard/suppliers/${id}/edit`)}
              className="flex items-center gap-2 rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
            >
              <FaEdit size={12} /> Edit supplier
            </button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/20 text-base font-bold text-accent2">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{supplier.companyName}</h2>
              <p className="text-sm text-muted">
                {supplier.primaryContact?.firstName} {supplier.primaryContact?.lastName}
                {supplier.primaryContact?.role && ` - ${supplier.primaryContact.role}`}
              </p>
              <p className="text-xs text-accent2">{supplier.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-faint">{supplier.supplierType}</span>
            <StatusBadge status={supplier.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-6 text-sm text-muted pt-2 border-t border-line/50">
          {supplier.phone && (
            <div className="flex items-center gap-2">
              <FaPhone size={12} /> {supplier.phone}
            </div>
          )}
          {supplier.address?.city && (
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt size={12} /> {supplier.address.city}, {supplier.address.state}
            </div>
          )}
          <div className="flex items-center gap-2">
            <FaEnvelope size={12} /> {supplier.email}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Total purchased</p>
          <p className="mt-2 text-2xl font-bold text-white">${(supplier.totalPurchased || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Open purchase orders</p>
          <p className="mt-2 text-2xl font-bold text-white">{supplier.openPurchaseOrders || 0}</p>
        </div>
        <div className="rounded-xl border border-line bg-surface p-4">
          <p className="text-xs font-mono text-muted uppercase">Average lead time</p>
          <p className="mt-2 text-2xl font-bold text-white">{supplier.averageLeadTime || 0} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">Supplier information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted">Supplier ID</p>
              <p className="text-white font-medium">{supplier.supplierId || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Category</p>
              <p className="text-white font-medium">{supplier.category || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Primary contact</p>
              <p className="text-white">
                {supplier.primaryContact?.firstName} {supplier.primaryContact?.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Contact role</p>
              <p className="text-white">{supplier.primaryContact?.role || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Payment terms</p>
              <p className="text-white">{supplier.paymentTerms}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Preferred contact</p>
              <p className="text-white">{supplier.preferredContact}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
          <h3 className="text-base font-semibold text-white">Shipping and billing</h3>
          <div className="text-sm text-white space-y-1">
            <p className="font-medium">{supplier.companyName}</p>
            <p>{supplier.address?.addressLine1 || '—'}</p>
            {supplier.address?.addressLine2 && <p>{supplier.address.addressLine2}</p>}
            <p>{[supplier.address?.city, supplier.address?.state, supplier.address?.postalCode].filter(Boolean).join(', ')}</p>
            <p>{supplier.address?.country}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
        <h3 className="text-base font-semibold text-white">Recent purchase orders</h3>
        <p className="text-sm text-faint">No purchase orders yet — this fills in once the Purchase Orders module is built.</p>
      </div>
    </div>
  )
}