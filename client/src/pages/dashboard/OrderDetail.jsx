import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaArrowLeft, FaPrint, FaEdit, FaCheck } from 'react-icons/fa';
import { fetchOrderById } from '../../store/ordersSlice';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (!order) return <div className="text-white p-6">Loading order details...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{order.orderNumber}</h1>
          <p className="text-sm text-muted">Placed {new Date(order.createdAt).toLocaleDateString()} by {order.customerName}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard/orders')} className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-xs text-white">
            <FaArrowLeft size={10} /> Back to orders
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-line bg-panel px-3 py-2 text-xs text-white">
            <FaPrint size={10} /> Print
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-accent2 px-4 py-2 text-xs font-medium text-white hover:bg-blue-600">
            <FaEdit size={10} /> Edit order
          </button>
        </div>
      </div>

      {/* Tracker Timeline */}
      <div className="rounded-xl border border-line bg-surface p-6">
        <div className="grid grid-cols-4 gap-4">
          {order.timeline?.map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs ${step.completedAt ? 'bg-accent2 text-white' : 'border border-line text-muted'}`}>
                {step.completedAt ? <FaCheck size={10} /> : idx + 1}
              </div>
              <div>
                <p className="text-xs font-semibold text-white">{step.label}</p>
                <p className="text-[10px] text-muted">{step.completedAt ? new Date(step.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Items */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-line bg-surface p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Order items</h3>
            <table className="w-full text-left text-sm text-white">
              <thead className="text-xs text-muted border-b border-line">
                <tr>
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/30">
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 text-muted">x{item.quantity}</td>
                    <td className="py-3 text-right font-semibold">${item.totalPrice?.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
            <h3 className="text-sm font-semibold text-white">Customer</h3>
            <p className="text-sm font-medium text-white">{order.customerName}</p>
            <p className="text-xs text-muted">{order.contactName}</p>
            <p className="text-xs text-accent2">{order.contactEmail}</p>
            <p className="text-xs text-muted">{order.contactPhone}</p>
          </div>
        </div>

        {/* Right Column: Summary & Shipping */}
        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
            <h3 className="text-sm font-semibold text-white">Order summary</h3>
            <div className="flex justify-between text-xs text-muted">
              <span>Subtotal</span>
              <span className="text-white">${order.subtotal?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Shipping</span>
              <span className="text-white">${order.shippingFee?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Tax</span>
              <span className="text-white">${order.tax?.toLocaleString()}</span>
            </div>
            <hr className="border-line" />
            <div className="flex justify-between text-sm font-bold text-white">
              <span>Total</span>
              <span>${order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
            <h3 className="text-sm font-semibold text-white">Shipping</h3>
            <p className="text-xs text-muted">{order.shippingAddress?.addressLine1}</p>
            <p className="text-xs text-muted">{order.shippingAddress?.addressLine2}</p>
            <p className="text-xs text-muted">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
            <p className="text-xs text-muted">{order.shippingAddress?.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}