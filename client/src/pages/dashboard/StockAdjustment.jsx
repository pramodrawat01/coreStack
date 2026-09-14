import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { FaArrowLeft, FaSearch } from 'react-icons/fa'
import { apiFetch } from '../../lib/api.js'
import { fetchProducts } from '../../store/productsSlice.js'
import { fetchProductStock, adjustStock, clearProductStock } from '../../store/inventorySlice.js'
import { notifySuccess, notifyError } from '../../lib/toast.js'
import CustomDropdown from '../../components/common/CustomDropdown.jsx'

const TYPES = [
  { value: 'in', label: 'Stock In' },
  { value: 'out', label: 'Stock Out' },
  { value: 'set', label: 'Set Quantity' },
]

export default function StockAdjustment() {
  const [params] = useSearchParams()
  const preProductId = params.get('productId')
  const preWarehouseId = params.get('warehouseId')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items: products } = useSelector((s) => s.products)
  const { productStock } = useSelector((s) => s.inventory)

  const [productSearch, setProductSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [warehouseId, setWarehouseId] = useState(preWarehouseId || '')
  const [adjustmentType, setAdjustmentType] = useState('in')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // resolve the product that was passed in via ?productId= (e.g. clicked "Adjust" from the list)
  useEffect(() => {
    if (!preProductId) return
    apiFetch(`/api/products/${preProductId}`)
      .then(setSelectedProduct)
      .catch(() => notifyError('Could not load that product'))
  }, [preProductId])

  useEffect(() => {
    if (productSearch.trim().length >= 2) {
      dispatch(fetchProducts({ search: productSearch, page: 1, limit: 8 }))
    }
  }, [dispatch, productSearch])

  useEffect(() => {
    if (selectedProduct) dispatch(fetchProductStock(selectedProduct._id))
    return () => dispatch(clearProductStock())
  }, [dispatch, selectedProduct])

  useEffect(() => {
    if (!warehouseId && productStock.length > 0) {
      setWarehouseId(productStock[0].warehouse._id)
    }
  }, [productStock]) // eslint-disable-line react-hooks/exhaustive-deps

  const currentRow = useMemo(
    () => productStock.find((r) => r.warehouse._id === warehouseId),
    [productStock, warehouseId]
  )
  const available = currentRow?.available ?? 0

  const resultingQuantity = useMemo(() => {
    const q = Number(quantity) || 0
    if (adjustmentType === 'in') return available + q
    if (adjustmentType === 'out') return available - q
    return q
  }, [adjustmentType, quantity, available])

  const belowReorder = selectedProduct && resultingQuantity < (selectedProduct.reorderPoint || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProduct || !warehouseId) return notifyError('Select a product and warehouse first')
    if (quantity === '' || Number(quantity) < 0) return notifyError('Enter a valid quantity')
    if (!reason.trim()) return notifyError('A reason is required')

    setSaving(true)
    try {
      await dispatch(
        adjustStock({
          productId: selectedProduct._id,
          warehouseId,
          adjustmentType,
          quantity: Number(quantity),
          reason,
          notes,
        })
      ).unwrap()
      notifySuccess('Stock adjustment saved')
      navigate('/dashboard/inventory')
    } catch (err) {
      notifyError(err || 'Could not save adjustment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className=''>
      <p className="text-sm text-faint mb-5 flex">
        <Link to="/dashboard/inventory" className="hover:text-white flex gap-2 items-center">
          <FaArrowLeft size={11} /> Inventory /
        </Link>
      </p>
      <h1 className="text-3xl font-semibold">Stock Adjustment</h1>
      <p className="text-sm text-faint mt-1">Update inventory for the selected item</p>

      <div className=' w-full'>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-line bg-panel p-8 mt-6 flex flex-col gap-5 "
        >
          {!selectedProduct ? (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted">Select product</span>
              <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm">
                <FaSearch size={12} className="text-faint" />
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search by product name or SKU"
                  className="bg-transparent outline-none text-white placeholder:text-faint flex-1"
                />
              </div>
              {productSearch.trim().length >= 2 && (
                <div className="rounded-md border border-line bg-surface max-h-52 overflow-y-auto">
                  {products.length === 0 ? (
                    <p className="px-3 py-3 text-xs text-faint">No matches</p>
                  ) : (
                    products.map((p) => (
                      <button
                        type="button"
                        key={p._id}
                        onClick={() => {
                          setSelectedProduct(p)
                          setWarehouseId('')
                        }}
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
          ) : (
            <>
              <div>
                <p className="text-base font-medium text-white">{selectedProduct.name}</p>
                <p className="text-xs text-faint font-mono">SKU: {selectedProduct.sku}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border border-line bg-surface px-4 py-3">
                  <p className="text-xs text-faint">Current warehouse</p>
                  {preWarehouseId ? (
                    <p className="text-sm text-white mt-1">{currentRow?.warehouse.name || '—'}</p>
                  ) : (
                    <CustomDropdown
                      options={productStock.map((r) => ({ value: r.warehouse._id, label: r.warehouse.name }))}
                      value={warehouseId}
                      onChange={setWarehouseId}
                      className="mt-1"
                    />
                  )}
                </div>
                <div className="rounded-md border border-line bg-surface px-4 py-3">
                  <p className="text-xs text-faint">Available quantity</p>
                  <p className="text-sm text-white mt-1">{available} units</p>
                </div>
              </div>

              <div>
                <span className="text-xs font-medium text-muted">Adjustment type</span>
                <div className="flex gap-2 mt-1.5">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setAdjustmentType(t.value)}
                      className={`rounded-md px-3 py-2 text-sm border transition-colors ${
                        adjustmentType === t.value
                          ? 'border-accent2 bg-accent2/10 text-accent2'
                          : 'border-line text-faint hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Quantity</span>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Reason</span>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter a reason for this adjustment"
                  className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Optional notes</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional details"
                  className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2 resize-none"
                />
              </label>

              <div className="flex items-center justify-between rounded-md bg-accent2/10 border border-accent2/30 px-4 py-3">
                <div>
                  <p className="text-xs text-faint">Resulting quantity</p>
                  <p className="text-xs text-faint">Current stock: {available} units</p>
                </div>
                <p className="text-lg font-semibold text-accent2">{resultingQuantity} units</p>
              </div>

              {belowReorder && (
                <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
                  The resulting quantity is below the reorder point of {selectedProduct.reorderPoint} units.
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 pt-2 border-t border-line mt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-md border border-line px-4 py-2.5 text-sm text-white hover:border-white/40 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !selectedProduct}
              className="rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 disabled:opacity-60 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}