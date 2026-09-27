// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { FaPlus } from 'react-icons/fa';
// import { createOrder } from '../../store/ordersSlice';

// export default function OrderForm() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const [formData, setFormData] = useState({
//     customerName: 'Northstar Retail Group',
//     contactName: 'Jordan Lee',
//     contactEmail: 'jordan.lee@northstarretail.com',
//     items: [
//       { name: 'Northstar Pro Dock', sku: 'NPD-440', quantity: 24, unitPrice: 320, totalPrice: 7680 },
//       { name: 'USB-C Power Hub', sku: 'UCP-210', quantity: 18, unitPrice: 180, totalPrice: 3240 }
//     ],
//     subtotal: 10920,
//     shippingFee: 240,
//     tax: 5460,
//     totalAmount: 16620,
//     paymentStatus: 'Paid',
//     deliveryMethod: 'Standard delivery',
//     shippingAddress: {
//       addressLine1: '455 W Kinzie Street',
//       addressLine2: 'Suite 620',
//       city: 'Chicago',
//       state: 'IL',
//       postalCode: '60654'
//     },
//     notes: 'Priority enterprise shipment — coordinate with Jordan Lee'
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await dispatch(createOrder(formData));
//     navigate('/dashboard/orders');
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-white">Create order</h1>
//           <p className="text-sm text-muted">Create a customer order and reserve inventory</p>
//         </div>
//         <div className="flex gap-3">
//           <button type="button" onClick={() => navigate('/dashboard/orders')} className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface">
//             Cancel
//           </button>
//           <button type="submit" form="create-order-form" className="rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
//             Create order
//           </button>
//         </div>
//       </div>

//       <form id="create-order-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Customer Selection */}
//           <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
//             <h2 className="text-sm font-semibold text-white">Customer</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-xs text-muted mb-1">Company</label>
//                 <select className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white">
//                   <option>Northstar Retail Group</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs text-muted mb-1">Primary contact</label>
//                 <select className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white">
//                   <option>Jordan Lee</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Order Items Table */}
//           <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-sm font-semibold text-white">Order items</h2>
//               <button type="button" className="flex items-center gap-1 text-xs text-accent2">
//                 <FaPlus size={10} /> Add item
//               </button>
//             </div>
//             <table className="w-full text-left text-sm text-white">
//               <thead className="text-xs text-muted border-b border-line">
//                 <tr>
//                   <th className="pb-2">Item</th>
//                   <th className="pb-2">SKU</th>
//                   <th className="pb-2">Quantity</th>
//                   <th className="pb-2">Unit</th>
//                   <th className="pb-2 text-right">Total</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-line/30">
//                 {formData.items.map((item, idx) => (
//                   <tr key={idx}>
//                     <td className="py-2.5 font-medium">{item.name}</td>
//                     <td className="py-2.5 text-xs text-muted">{item.sku}</td>
//                     <td className="py-2.5">{item.quantity}</td>
//                     <td className="py-2.5">${item.unitPrice.toFixed(2)}</td>
//                     <td className="py-2.5 text-right font-semibold">${item.totalPrice.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {/* Shipping Address */}
//           <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
//             <h2 className="text-sm font-semibold text-white">Shipping address</h2>
//             <div className="rounded-lg border border-line bg-panel p-3 text-xs text-muted space-y-1">
//               <p className="text-white font-medium">{formData.shippingAddress.addressLine1}</p>
//               <p>{formData.shippingAddress.addressLine2}</p>
//               <p>{formData.shippingAddress.city}, {formData.shippingAddress.state} {formData.shippingAddress.postalCode}</p>
//             </div>
//           </div>

//           {/* Payment and Delivery */}
//           <div className="rounded-xl border border-line bg-surface p-6 grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs text-muted mb-1">Payment</label>
//               <select className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white">
//                 <option>Paid</option>
//                 <option>Pending</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-xs text-muted mb-1">Delivery</label>
//               <select className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white">
//                 <option>Standard delivery</option>
//                 <option>Express delivery</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Right Panel: Summary & Notes */}
//         <div className="space-y-6">
//           <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
//             <h2 className="text-sm font-semibold text-white">Order summary</h2>
//             <div className="flex justify-between text-xs text-muted">
//               <span>Subtotal</span>
//               <span className="text-white">${formData.subtotal.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-xs text-muted">
//               <span>Shipping</span>
//               <span className="text-white">${formData.shippingFee.toLocaleString()}</span>
//             </div>
//             <div className="flex justify-between text-xs text-muted">
//               <span>Tax</span>
//               <span className="text-white">${formData.tax.toLocaleString()}</span>
//             </div>
//             <hr className="border-line" />
//             <div className="flex justify-between text-sm font-bold text-white">
//               <span>Total</span>
//               <span>${formData.totalAmount.toLocaleString()}</span>
//             </div>
//           </div>

//           <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
//             <h2 className="text-sm font-semibold text-white">Note</h2>
//             <textarea
//               rows={4}
//               value={formData.notes}
//               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//               className="w-full rounded-lg border border-line bg-panel p-3 text-xs text-white focus:outline-none resize-none"
//             />
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }



import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { fetchCustomers } from '../../store/customersSlice.js'
import { fetchProducts } from '../../store/productsSlice.js'
import { createOrder } from '../../store/ordersSlice.js'
import { notifySuccess, notifyError } from '../../lib/toast.js'
import CustomDropdown from '../../components/common/CustomDropdown.jsx'

export default function OrderForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { items: customers } = useSelector((s) => s.customers)
  const { items: products } = useSelector((s) => s.products)

  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([])
  const [productSearch, setProductSearch] = useState('')
  const [shippingFee, setShippingFee] = useState('0')
  const [tax, setTax] = useState('0')
  const [paymentStatus, setPaymentStatus] = useState('Paid')
  const [deliveryMethod, setDeliveryMethod] = useState('Standard delivery')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  useEffect(() => {
    if (productSearch.trim().length >= 2) {
      dispatch(fetchProducts({ search: productSearch, page: 1, limit: 8 }))
    }
  }, [dispatch, productSearch])

  const selectedCustomer = customers.find((c) => c._id === customerId)

  const addItem = (product) => {
    if (items.some((i) => i.productId === product._id)) return
    setItems((prev) => [
      ...prev,
      { productId: product._id, name: product.name, sku: product.sku, quantity: 1, unitPrice: product.price || 0 },
    ])
    setProductSearch('')
  }

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)))
  }
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index))

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unitPrice || 0), 0),
    [items]
  )
  const total = subtotal + (Number(shippingFee) || 0) + (Number(tax) || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customerId) return notifyError('Select a customer')
    if (items.length === 0) return notifyError('Add at least one item')
    if (items.some((i) => Number(i.quantity) <= 0)) return notifyError('Every item needs a quantity greater than 0')

    setSaving(true)
    try {
      const created = await dispatch(
        createOrder({
          customerId,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
            unitPrice: Number(i.unitPrice),
          })),
          shippingFee: Number(shippingFee) || 0,
          tax: Number(tax) || 0,
          paymentStatus,
          deliveryMethod,
          notes,
        })
      ).unwrap()
      notifySuccess('Order created')
      navigate(`/dashboard/orders/${created._id}`)
    } catch (err) {
      notifyError(err || 'Could not create order')
    } finally {
      setSaving(false)
    }
  }

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
          <button type="submit" form="create-order-form" disabled={saving} className="rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60">
            {saving ? 'Creating…' : 'Create order'}
          </button>
        </div>
      </div>

      <form id="create-order-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer */}
          <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Customer</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Company</label>
                <CustomDropdown
                  options={customers.map((c) => ({ value: c._id, label: c.companyName }))}
                  value={customerId}
                  onChange={setCustomerId}
                  placeholder="Select customer"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Primary contact</label>
                <input
                  disabled
                  value={
                    selectedCustomer
                      ? [selectedCustomer.primaryContact?.firstName, selectedCustomer.primaryContact?.lastName]
                          .filter(Boolean)
                          .join(' ') || '—'
                      : ''
                  }
                  className="w-full rounded-lg border border-line bg-panel/50 p-2 text-sm text-faint"
                />
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-white">Order items</h2>
              <p className="text-xs text-faint">Products and quantities included in this order.</p>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 text-sm">
                <FaSearch size={12} className="text-faint" />
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products to add…"
                  className="bg-transparent outline-none text-white placeholder:text-faint flex-1"
                />
              </div>
              {productSearch.trim().length >= 2 && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-line bg-surface max-h-52 overflow-y-auto shadow-lg">
                  {products.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-faint">No matches</p>
                  ) : (
                    products.map((p) => (
                      <button
                        type="button"
                        key={p._id}
                        onClick={() => addItem(p)}
                        className="w-full text-left px-3 py-2.5 text-sm hover:bg-white/[0.05] transition-colors"
                      >
                        <span className="text-white">{p.name}</span>
                        <span className="text-faint font-mono ml-2 text-xs">{p.sku}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <table className="w-full text-left text-sm text-white">
                <thead className="text-xs text-muted border-b border-line">
                  <tr>
                    <th className="pb-2">Item</th>
                    <th className="pb-2">SKU</th>
                    <th className="pb-2">Quantity</th>
                    <th className="pb-2">Unit</th>
                    <th className="pb-2 text-right">Total</th>
                    <th className="pb-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/30">
                  {items.map((item, idx) => (
                    <tr key={item.productId}>
                      <td className="py-2.5 font-medium">{item.name}</td>
                      <td className="py-2.5 text-xs text-muted">{item.sku}</td>
                      <td className="py-2.5">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                          className="w-20 rounded-md border border-line bg-panel px-2 py-1 text-sm text-white"
                        />
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center rounded-md border border-line bg-panel px-2 w-24">
                          <span className="text-faint text-xs">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(idx, 'unitPrice', e.target.value)}
                            className="w-full bg-transparent px-1 py-1 text-sm text-white outline-none"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-semibold">
                        ${(Number(item.quantity || 0) * Number(item.unitPrice || 0)).toFixed(2)}
                      </td>
                      <td className="py-2.5 text-right">
                        <button type="button" onClick={() => removeItem(idx)} className="text-faint hover:text-red-400">
                          <FaTimes size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Shipping address — from the selected customer, display only, matching the reference */}
          {selectedCustomer?.address && (
            <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
              <h2 className="text-sm font-semibold text-white">Shipping address</h2>
              <div className="rounded-lg border border-line bg-panel p-3 text-xs text-muted space-y-1">
                <p className="text-white font-medium">{selectedCustomer.address.addressLine1}</p>
                {selectedCustomer.address.addressLine2 && <p>{selectedCustomer.address.addressLine2}</p>}
                <p>
                  {selectedCustomer.address.city}, {selectedCustomer.address.state} {selectedCustomer.address.postalCode}
                </p>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-line bg-surface p-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted mb-1">Payment</label>
              <CustomDropdown
                options={[
                  { value: 'Paid', label: 'Paid' },
                  { value: 'Pending', label: 'Pending' },
                ]}
                value={paymentStatus}
                onChange={setPaymentStatus}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-muted mb-1">Delivery</label>
              <CustomDropdown
                options={[
                  { value: 'Standard delivery', label: 'Standard delivery' },
                  { value: 'Express delivery', label: 'Express delivery' },
                ]}
                value={deliveryMethod}
                onChange={setDeliveryMethod}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Right panel: Summary & Note */}
        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
            <h2 className="text-sm font-semibold text-white">Order summary</h2>
            <div className="flex justify-between text-xs text-muted">
              <span>Subtotal</span>
              <span className="text-white">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted">
              <span>Shipping</span>
              <input
                type="number"
                min="0"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                className="w-24 rounded-md border border-line bg-panel px-2 py-1 text-right text-white"
              />
            </div>
            <div className="flex justify-between items-center text-xs text-muted">
              <span>Tax</span>
              <input
                type="number"
                min="0"
                value={tax}
                onChange={(e) => setTax(e.target.value)}
                className="w-24 rounded-md border border-line bg-panel px-2 py-1 text-right text-white"
              />
            </div>
            <hr className="border-line" />
            <div className="flex justify-between text-sm font-bold text-white">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 space-y-2">
            <h2 className="text-sm font-semibold text-white">Note</h2>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Priority enterprise shipment — coordinate with the customer's contact."
              className="w-full rounded-lg border border-line bg-panel p-3 text-xs text-white focus:outline-none resize-none"
            />
          </div>
        </div>
      </form>
    </div>
  )
}