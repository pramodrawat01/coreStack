import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaArrowLeft, FaPrint, FaCheck, FaClock, FaPen } from 'react-icons/fa'
import {
  fetchPurchaseOrderById,
  approvePurchaseOrder,
  markPurchaseOrderInTransit,
  receivePurchaseOrder,
  updatePurchaseOrder,
  clearCurrentPO,
} from '../../store/purchaseOrdersSlice.js'
import { notifySuccess, notifyError } from '../../lib/toast.js'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'
import { usePermission } from '../../hooks/usePermission.js'
import { SkeletonText } from '../../components/dashboard/skeleton/Skeleton.jsx'

const STATUS_LABELS = {
  Draft: 'Draft',
  Submitted: 'Pending approval',
  Approved: 'Approved',
  'In transit': 'In transit',
  Received: 'Received',
  Cancelled: 'Cancelled',
}

export default function PurchaseOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const canWrite = usePermission('purchases', 'write')
  const { currentPO: po } = useSelector((s) => s.purchaseOrders)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchPurchaseOrderById(id))
    return () => dispatch(clearCurrentPO())
  }, [dispatch, id])

  if (!po) return <SkeletonText />

  const runAction = async (thunk, successMsg) => {
    setActionLoading(true)
    try {
      await dispatch(thunk(id)).unwrap()
      notifySuccess(successMsg)
    } catch (err) {
      notifyError(err || 'Something went wrong')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    setActionLoading(true)
    try {
      await dispatch(updatePurchaseOrder({ id, status: 'Cancelled' })).unwrap()
      notifySuccess('Purchase order cancelled')
    } catch (err) {
      notifyError(err || 'Could not cancel')
    } finally {
      setActionLoading(false)
    }
  }

  const canCancel = canWrite && !['Received', 'Cancelled'].includes(po.status)

  return (
    <div className="space-y-6">
      <div className='flex  justify-between'>
        <p className="text-sm text-faint flex items-center gap-2">
            <Link to="/dashboard/purchase-orders" className="hover:text-white flex items-center gap-2  "> 
            <FaArrowLeft size={11}/>  
            <span>Purchase Orders /</span></Link>
          </p>
          <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard/purchase-orders')}
            className="flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface"
          >
            <FaPen size={11} /> Edit purchase orders
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface"
          >
            <FaPrint size={12} /> Print
          </button>
        </div>
      </div>
     
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">#{po.poNumber}</h1>
            <StatusBadge status={STATUS_LABELS[po.status] || po.status} />
          </div>
          <p className="text-sm text-muted">
            Created {new Date(po.createdAt).toLocaleDateString()}
          </p>
        </div>
        {/* <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard/purchase-orders')}
            className="flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface"
          >
            <FaArrowLeft size={11} /> Back to purchase orders
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface"
          >
            <FaPrint size={12} /> Print
          </button>
        </div> */}
      </div>

      <div className="rounded-xl border border-line bg-surface p-6">
        <h3 className="text-sm font-semibold text-white mb-5">Status</h3>
        <div className="flex items-center">
          {po.timeline.map((stage, i) => {
            const done = Boolean(stage.completedAt)
            const isLast = i === po.timeline.length - 1
            return (
              <React.Fragment key={stage.status}>
                <div className="flex flex-col items-center text-center w-24">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                      done ? 'bg-accent2 border-accent2 text-white' : 'border-line text-faint'
                    }`}
                  >
                    {done ? <FaCheck size={10} /> : <FaClock size={10} />}
                  </div>
                  <p className={`text-xs mt-2 font-medium ${done ? 'text-white' : 'text-faint'}`}>{stage.label}</p>
                  <p className="text-[10px] text-faint mt-0.5">
                    {stage.completedAt ? new Date(stage.completedAt).toLocaleString() : 'Pending'}
                  </p>
                </div>
                {!isLast && <div className={`flex-1 h-0.5 ${done ? 'bg-accent2' : 'bg-line'}`} />}
              </React.Fragment>
            )
          })}
        </div>

        {po.status === 'Cancelled' && (
          <p className="text-xs text-red-400 mt-4">This purchase order was cancelled.</p>
        )}

        {canWrite && po.status !== 'Cancelled' && po.status !== 'Received' && (
          <div className="flex gap-2 mt-6 pt-4 border-t border-line">
            {po.status === 'Submitted' && (
              <button
                disabled={actionLoading}
                onClick={() => runAction(approvePurchaseOrder, 'Purchase order approved')}
                className="rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
              >
                Approve
              </button>
            )}
            {po.status === 'Approved' && (
              <button
                disabled={actionLoading}
                onClick={() => runAction(markPurchaseOrderInTransit, 'Marked as in transit')}
                className="rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
              >
                Mark in transit
              </button>
            )}
            {['Approved', 'In transit'].includes(po.status) && (
              <button
                disabled={actionLoading}
                onClick={() => runAction(receivePurchaseOrder, 'Purchase order received — inventory updated')}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                Mark received
              </button>
            )}
            {canCancel && (
              <button
                disabled={actionLoading}
                onClick={handleCancel}
                className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-white hover:border-red-400/50 hover:text-red-400"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
        <h3 className="text-sm font-semibold text-white">Supplier</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-white font-medium">{po.supplier?.companyName || po.supplierName}</p>
            <p className="text-muted mt-1">
              {po.supplier?.primaryContact?.firstName} {po.supplier?.primaryContact?.lastName}
            </p>
            {po.supplier?.email && <p className="text-accent2 mt-1">{po.supplier.email}</p>}
            {po.supplier?.phone && <p className="text-muted mt-1">{po.supplier.phone}</p>}
          </div>
          {po.supplier?.address && (
            <div className="text-muted">
              <p>{po.supplier.address.addressLine1}</p>
              {po.supplier.address.addressLine2 && <p>{po.supplier.address.addressLine2}</p>}
              <p>
                {[po.supplier.address.city, po.supplier.address.state, po.supplier.address.postalCode]
                  .filter(Boolean)
                  .join(', ')}
              </p>
              <p>{po.supplier.address.country}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Items</h3>
        <table className="w-full text-left text-sm text-white">
          <thead className="text-xs text-muted border-b border-line">
            <tr>
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 font-medium">SKU</th>
              <th className="pb-2 font-medium">Quantity</th>
              <th className="pb-2 font-medium">Unit</th>
              <th className="pb-2 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/30">
            {po.items.map((item, idx) => (
              <tr key={idx}>
                <td className="py-2.5 font-medium">{item.name}</td>
                <td className="py-2.5 text-xs text-muted">{item.sku}</td>
                <td className="py-2.5">{item.quantity}</td>
                <td className="py-2.5">${item.unitCost.toFixed(2)}</td>
                <td className="py-2.5 text-right font-semibold">${item.totalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
          <h3 className="text-sm font-semibold text-white">Delivery</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Warehouse</span>
            <span className="text-white font-medium">{po.warehouse?.name || '—'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Expected</span>
            <span className="text-white font-medium">
              {po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate).toLocaleDateString() : '—'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted">Payment terms</span>
            <span className="text-white font-medium">{po.paymentTerms}</span>
          </div>
        </div>

        {po.notes && (
          <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
            <h3 className="text-sm font-semibold text-white">Notes</h3>
            <p className="text-sm text-muted">{po.notes}</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-line bg-surface p-6 space-y-3 max-w-sm ml-auto">
        <h3 className="text-sm font-semibold text-white">Summary</h3>
        <div className="flex justify-between text-xs text-muted">
          <span>Subtotal</span>
          <span className="text-white">${po.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Shipping</span>
          <span className="text-white">${po.shippingCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs text-muted">
          <span>Tax</span>
          <span className="text-white">${po.tax.toLocaleString()}</span>
        </div>
        <hr className="border-line" />
        <div className="flex justify-between text-sm font-bold text-white">
          <span>Total</span>
          <span>${po.totalCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}