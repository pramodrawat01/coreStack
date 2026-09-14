import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { FaArrowLeft, FaSearch, FaExchangeAlt } from 'react-icons/fa'
import { fetchProducts } from '../../store/productsSlice.js'
import { fetchWarehouses } from '../../store/warehousesSlice.js'
import { fetchProductStock, transferStock, clearProductStock } from '../../store/inventorySlice.js'
import { notifySuccess, notifyError } from '../../lib/toast.js'
import CustomDropdown from '../../components/common/CustomDropdown.jsx'

export default function TransferStock() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items: products } = useSelector((s) => s.products)
  const { items: warehouses } = useSelector((s) => s.warehouses)
  const { productStock } = useSelector((s) => s.inventory)

  const [productSearch, setProductSearch] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [fromWarehouseId, setFromWarehouseId] = useState('')
  const [toWarehouseId, setToWarehouseId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchWarehouses())
  }, [dispatch])

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
    if (!fromWarehouseId && productStock.length > 0) {
      setFromWarehouseId(productStock[0].warehouse._id)
    }
  }, [productStock]) // eslint-disable-line react-hooks/exhaustive-deps

  const fromRow = useMemo(
    () => productStock.find((r) => r.warehouse._id === fromWarehouseId),
    [productStock, fromWarehouseId]
  )
  const available = fromRow?.available ?? 0
  const exceedsAvailable = quantity !== '' && Number(quantity) > available

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProduct || !fromWarehouseId || !toWarehouseId) return notifyError('Fill in product and both warehouses')
    if (!quantity || Number(quantity) <= 0) return notifyError('Enter a valid quantity')
    if (exceedsAvailable) return notifyError('The transfer quantity cannot exceed the available quantity')
    if (!reason.trim()) return notifyError('A reason is required')

    setSaving(true)
    try {
      await dispatch(
        transferStock({
          productId: selectedProduct._id,
          fromWarehouseId,
          toWarehouseId,
          quantity: Number(quantity),
          reason,
          notes,
        })
      ).unwrap()
      notifySuccess('Stock transferred')
      navigate('/dashboard/inventory')
    } catch (err) {
      notifyError(err || 'Could not complete transfer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <p className="text-sm text-faint mb-5 flex">
        <Link to="/dashboard/inventory" className="hover:text-white flex gap-2 items-center">
          <FaArrowLeft size={11} /> Inventory /
        </Link>
      </p>
      <h1 className="text-3xl font-semibold">Transfer Stock</h1>
      <p className="text-sm text-faint mt-1">Move inventory between warehouses</p>
      <div className='w-full'>

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
                        onClick={() => setSelectedProduct(p)}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-muted mb-1.5">Product</p>
                  <p className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white">
                    {selectedProduct.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted mb-1.5">SKU</p>
                  <p className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-faint font-mono">
                    {selectedProduct.sku}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted">From warehouse</span>
                  <CustomDropdown
                    options={productStock.map((r) => ({ value: r.warehouse._id, label: r.warehouse.name }))}
                    value={fromWarehouseId}
                    onChange={setFromWarehouseId}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted">To warehouse</span>
                  <CustomDropdown
                    options={warehouses
                      .filter((w) => w._id !== fromWarehouseId)
                      .map((w) => ({ value: w._id, label: w.name }))}
                    value={toWarehouseId}
                    onChange={setToWarehouseId}
                    placeholder="Select warehouse"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-md border border-line bg-surface px-4 py-3">
                  <p className="text-xs text-faint">Available quantity</p>
                  <p className="text-sm text-white mt-1">{available} units</p>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted">Transfer quantity</span>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Reason</span>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter a reason for this transfer"
                  className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted">Additional details</span>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional details"
                  className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2 resize-none"
                />
              </label>

              {toWarehouseId && quantity && (
                <div className="flex items-center justify-between rounded-md bg-surface border border-line px-4 py-3">
                  <div>
                    <p className="text-xs font-medium text-white">Transfer summary</p>
                    <p className="text-xs text-faint mt-0.5">
                      {quantity} units moving from{' '}
                      <span className="text-white">{fromRow?.warehouse.name}</span> to{' '}
                      <span className="text-white">{warehouses.find((w) => w._id === toWarehouseId)?.name}</span>
                    </p>
                  </div>
                  <FaExchangeAlt className="text-accent2" size={14} />
                </div>
              )}

              {exceedsAvailable && (
                <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300">
                  The transfer quantity cannot exceed the available quantity.
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
              {saving ? 'Transferring…' : 'Complete Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}