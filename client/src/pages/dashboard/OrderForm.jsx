import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import { createOrder } from '../../store/ordersSlice';

export default function OrderForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    customerName: 'Northstar Retail Group',
    contactName: 'Jordan Lee',
    contactEmail: 'jordan.lee@northstarretail.com',
    items: [
      { name: 'Northstar Pro Dock', sku: 'NPD-440', quantity: 24, unitPrice: 320, totalPrice: 7680 },
      { name: 'USB-C Power Hub', sku: 'UCP-210', quantity: 18, unitPrice: 180, totalPrice: 3240 }
    ],
    subtotal: 10920,
    shippingFee: 240,
    tax: 5460,
    totalAmount: 16620,
    paymentStatus: 'Paid',
    deliveryMethod: 'Standard delivery',
    shippingAddress: {
      addressLine1: '455 W Kinzie Street',
      addressLine2: 'Suite 620',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60654'
    },
    notes: 'Priority enterprise shipment — coordinate with Jordan Lee'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createOrder(formData));
    navigate('/dashboard/orders');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Create order</h1>
          <p className="text-sm text-muted">Create a customer order and reserve inventory</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/dashboard/orders')} className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface">
            Cancel
          </button>
          <button type="submit" form="create-order-form" className="rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
            Create order
          </button>
        </div>
      </div>

      <form id="create-order-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Selection */}
          <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Customer</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Company</label>
                <select className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white">
                  <option>Northstar Retail Group</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Primary contact</label>
                <select className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white">
                  <option>Jordan Lee</option>
                </select>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-white">Order items</h2>
              <button type="button" className="flex items-center gap-1 text-xs text-accent2">
                <FaPlus size={10} /> Add item
              </button>
            </div>
            <table className="w-full text-left text-sm text-white">
              <thead className="text-xs text-muted border-b border-line">
                <tr>
                  <th className="pb-2">Item</th>
                  <th className="pb-2">SKU</th>
                  <th className="pb-2">Quantity</th>
                  <th className="pb-2">Unit</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/30">
                {formData.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium">{item.name}</td>
                    <td className="py-2.5 text-xs text-muted">{item.sku}</td>
                    <td className="py-2.5">{item.quantity}</td>
                    <td className="py-2.5">${item.unitPrice.toFixed(2)}</td>
                    <td className="py-2.5 text-right font-semibold">${item.totalPrice.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
            <h2 className="text-sm font-semibold text-white">Shipping address</h2>
            <div className="rounded-lg border border-line bg-panel p-3 text-xs text-muted space-y-1">
              <p className="text-white font-medium">{formData.shippingAddress.addressLine1}</p>
              <p>{formData.shippingAddress.addressLine2}</p>
              <p>{formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.postalCode}</p>
            </div>
          </div>

          {/* Payment and Delivery */}
          <div className="rounded-xl border border-line bg-surface p-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Payment</label>
              <select className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white">
                <option>Paid</option>
                <option>Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Delivery</label>
              <select className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white">
                <option>Standard delivery</option>
                <option>Express delivery</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Panel: Summary & Notes */}
        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
            <h2 className="text-sm font-semibold text-white">Order summary</h2>
            <div className="flex justify-between text-xs text-muted">
              <span>Subtotal</span>
              <span className="text-white">${formData.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Shipping</span>
              <span className="text-white">${formData.shippingFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs text-muted">
              <span>Tax</span>
              <span className="text-white">${formData.tax.toLocaleString()}</span>
            </div>
            <hr className="border-line" />
            <div className="flex justify-between text-sm font-bold text-white">
              <span>Total</span>
              <span>${formData.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
            <h2 className="text-sm font-semibold text-white">Note</h2>
            <textarea
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full rounded-lg border border-line bg-panel p-3 text-xs text-white focus:outline-none resize-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}