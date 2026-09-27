import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaSearch, FaTimes } from 'react-icons/fa'
import { fetchSuppliers } from '../../store/suppliersSlice.js'
import { fetchWarehouses } from '../../store/warehousesSlice.js'
import { fetchProducts } from '../../store/productsSlice.js'
import { createPurchaseOrder } from '../../store/purchaseOrdersSlice.js'
import { notifySuccess, notifyError } from '../../lib/toast.js'
import CustomDropdown from '../../components/common/CustomDropdown.jsx'

const PAYMENT_TERMS_OPTIONS = ['Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt']

export default function PurchaseOrderForm() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { items: suppliers } = useSelector((s) => s.suppliers)
  const { items: warehouses } = useSelector((s) => s.warehouses)
  const { items: products } = useSelector((s) => s.products)

  const [supplierId, setSupplierId] = useState('')
  const [warehouseId, setWarehouseId] = useState('')
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('')
  const [paymentTerms, setPaymentTerms] = useState('Net 30')
  const [items, setItems] = useState([])
  const [productSearch, setProductSearch] = useState('')
  const [shippingCost, setShippingCost] = useState('0')
  const [tax, setTax] = useState('0')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchSuppliers())
    dispatch(fetchWarehouses())
  }, [dispatch])

  useEffect(() => {
    if (productSearch.trim().length >= 2) {
      dispatch(fetchProducts({ search: productSearch, page: 1, limit: 8 }))
    }
  }, [dispatch, productSearch])

  const selectedSupplier = suppliers.find((s) => s._id === supplierId)

  useEffect(() => {
    if (selectedSupplier?.paymentTerms) setPaymentTerms(selectedSupplier.paymentTerms)
  }, [selectedSupplier])

  const addItem = (product) => {
    if (items.some((i) => i.productId === product._id)) return
    setItems((prev) => [
      ...prev,
      { productId: product._id, name: product.name, sku: product.sku, quantity: 1, unitCost: product.cost || 0 },
    ])
    setProductSearch('')
  }

  const updateItem = (index, field, value) => {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)))
  }
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index))

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.quantity || 0) * Number(i.unitCost || 0), 0),
    [items]
  )
  const total = subtotal + (Number(shippingCost) || 0) + (Number(tax) || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supplierId) return notifyError('Select a supplier')
    if (!warehouseId) return notifyError('Select a delivery warehouse')
    if (items.length === 0) return notifyError('Add at least one item')
    if (items.some((i) => Number(i.quantity) <= 0)) return notifyError('Every item needs a quantity greater than 0')

    setSaving(true)
    try {
      const created = await dispatch(
        createPurchaseOrder({
          supplierId,
          warehouseId,
          expectedDeliveryDate: expectedDeliveryDate || undefined,
          paymentTerms,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            sku: i.sku,
            quantity: Number(i.quantity),
            unitCost: Number(i.unitCost),
          })),
          shippingCost: Number(shippingCost) || 0,
          tax: Number(tax) || 0,
          notes,
        })
      ).unwrap()
      notifySuccess('Purchase order created')
      navigate(`/dashboard/purchase-orders/${created._id}`)
    } catch (err) {
      notifyError(err || 'Could not create purchase order')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Create purchase order</h1>
          <p className="text-sm text-muted">Create a supplier order and reserve incoming inventory</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/purchase-orders')}
            className="rounded-lg border border-line bg-panel px-4 py-2 text-sm font-medium text-white hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-po-form"
            disabled={saving}
            className="rounded-lg bg-accent2 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
          >
            {saving ? 'Creating…' : 'Create purchase order'}
          </button>
        </div>
      </div>

      <form id="create-po-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Supplier</h2>
            <p className="text-xs text-faint -mt-2">Select the supplier and contact for this purchase order.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Supplier</label>
                <CustomDropdown
                  options={suppliers.map((s) => ({ value: s._id, label: s.companyName }))}
                  value={supplierId}
                  onChange={setSupplierId}
                  placeholder="Select supplier"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Contact</label>
                <input
                  disabled
                  value={
                    selectedSupplier
                      ? [selectedSupplier.primaryContact?.firstName, selectedSupplier.primaryContact?.lastName]
                          .filter(Boolean)
                          .join(' ') || '—'
                      : ''
                  }
                  className="w-full rounded-lg border border-line bg-panel/50 p-2 text-sm text-faint"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white">Delivery</h2>
            <p className="text-xs text-faint -mt-2">Choose where and when the inventory should arrive.</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted mb-1">Warehouse</label>
                <CustomDropdown
                  options={warehouses.map((w) => ({ value: w._id, label: w.name }))}
                  value={warehouseId}
                  onChange={setWarehouseId}
                  placeholder="Select warehouse"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Expected delivery</label>
                <input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="w-full rounded-lg border border-line bg-panel p-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Payment terms</label>
                <CustomDropdown
                  options={PAYMENT_TERMS_OPTIONS.map((t) => ({ value: t, label: t }))}
                  value={paymentTerms}
                  onChange={setPaymentTerms}
                  className="w-full"
                />
              </div>
            </div>
          </div>

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
                    <th className="pb-2">Unit price</th>
                    <th className="pb-2 text-right">Line total</th>
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
                            value={item.unitCost}
                            onChange={(e) => updateItem(idx, 'unitCost', e.target.value)}
                            className="w-full bg-transparent px-1 py-1 text-sm text-white outline-none"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-semibold">
                        ${(Number(item.quantity || 0) * Number(item.unitCost || 0)).toFixed(2)}
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
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-surface p-6 space-y-3">
            <h2 className="text-sm font-semibold text-white">Summary</h2>
            <div className="flex justify-between text-xs text-muted">
              <span>Subtotal</span>
              <span className="text-white">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-muted">
              <span>Shipping</span>
              <input
                type="number"
                min="0"
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
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
            <h2 className="text-sm font-semibold text-white">Notes</h2>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Strategic replenishment for Q3 enterprise orders."
              className="w-full rounded-lg border border-line bg-panel p-3 text-xs text-white focus:outline-none resize-none"
            />
          </div>
        </div>
      </form>
    </div>
  )
}