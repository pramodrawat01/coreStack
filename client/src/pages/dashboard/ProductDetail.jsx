import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { FaPen, FaTrash, FaCube, FaArrowLeft, FaChevronRight } from 'react-icons/fa'
import { fetchProduct, deleteProduct, clearCurrentProduct } from '../../store/productsSlice.js'
import { usePermission } from '../../hooks/usePermission.js'
import StatusBadge from '../../components/dashboard/StatusBadge.jsx'
import { notifySuccess, notifyError } from '../../lib/toast.js'

const MOVEMENT_STYLES = {
  'Stock In': 'text-emerald-400 bg-emerald-400/10',
  'Stock Out': 'text-red-400 bg-red-400/10',
}

export default function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canWrite = usePermission('products', 'write')
  const { current: product } = useSelector((s) => s.products)

  useEffect(() => {
    dispatch(fetchProduct(id))
    return () => dispatch(clearCurrentProduct())
  }, [dispatch, id])

  const handleDelete = async () => {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return
    try {
      await dispatch(deleteProduct(id)).unwrap()
      notifySuccess('Product deleted')
      navigate('/dashboard/products')
    } catch (err) {
      notifyError(err || 'Could not delete this product')
    }
  }

  if (!product) return null

  return (
    <div className=''>
      <div className="flex items-center justify-between">
        <p className="text-sm text-faint flex gap-2 items-center ">
          <Link to="/dashboard/products" className="hover:text-white flex gap-2 items-center">
          <FaArrowLeft size={11} />
          Products 
          </Link> 
          <FaChevronRight size={12}/> 
           <span className="text-white">{product.name}</span>
          
        </p>
        {canWrite && (
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/dashboard/products/${id}/edit`)}
              className="flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-white hover:border-white/40 transition-colors"
            >
              <FaPen size={11} /> Edit Product
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/15 transition-colors"
            >
              <FaTrash size={11} /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[35%_1fr] gap-5 mt-6">
       
        <div className="rounded-lg border border-line bg-surface p-4">
            {/* Main image */}
            <div className="aspect-square rounded-md bg-white/[0.04] flex items-center justify-center overflow-hidden">
            {product.images?.[0] ? (
                <img
                src={product.images[0]}
                alt={product.name}
                className="h-full w-full object-cover"
                />
            ) : (
                <div className="flex flex-col items-center gap-2 text-faint">
                <FaCube size={80} />
                <span className="text-xl">Product image</span>
                </div>
            )}
            </div>

            {/* 3 thumbnails */}
            <div className="grid grid-cols-3 gap-2 mt-3">
            {[1, 2, 3].map((index) => (
                <div
                key={index}
                className="aspect-square rounded-md bg-white/[0.04] overflow-hidden flex items-center justify-center"
                >
                {product.images?.[index] ? (
                    <img
                    src={product.images[index]}
                    alt=""
                    className="h-full w-full object-cover"
                    />
                ) : (
                    <FaCube size={20} className="text-faint" />
                )}
                </div>
            ))}
            </div>

        </div>

        <div className="rounded-lg border border-line bg-surface p-5">
          <div className="flex items-center gap-8">
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <StatusBadge status={product.status} />
          </div>
          <p className="text-xs text-faint mt-2 flex items-center gap-2">
            SKU: <span className="font-mono text-muted">{product.sku}</span>
            <span className="rounded px-2 py-0.5 bg-white/[0.06] text-muted">{product.category}</span>
          </p>

          <div className="grid grid-cols-2 gap-8 mt-6">
            <div>
              <p className="text-xs text-faint">Price</p>
              <p className="text-sm font-medium mt-0.5">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-faint">Cost</p>
              <p className="text-sm font-medium mt-0.5">${product.cost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-faint">Margin</p>
              <p className="text-sm font-medium mt-0.5">
                {product.price > 0 ? (((product.price - product.cost) / product.price) * 100).toFixed(1) : '0.0'}%
              </p>
            </div>
            <div>
              <p className="text-xs text-faint">Stock on hand</p>
              <p className="text-sm font-medium mt-0.5">{product.stockQuantity} units</p>
            </div>
            <div>
              <p className="text-xs text-faint">Reorder point</p>
              <p className="text-sm font-medium mt-0.5">{product.reorderPoint} units</p>
            </div>
            <div>
              <p className="text-xs text-faint">Warehouse</p>
              <p className="text-sm font-medium mt-0.5">{product.warehouse || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-faint">Supplier</p>
              <p className="text-sm font-medium mt-0.5">{product.supplier || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-faint">Weight</p>
              <p className="text-sm font-medium mt-0.5">{product.weight} kg</p>
            </div>
          </div>

          {product.description && (
            <div className="mt-5 pt-5 border-t border-line">
              <p className="text-xs font-medium text-white mb-1.5">Description</p>
              <p className="text-sm text-muted leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface mt-5 overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <p className="text-sm font-medium">Stock Movement History</p>
        </div>
        {(!product.stockMovements || product.stockMovements.length === 0) ? (
          <p className="text-sm text-faint text-center py-10">No stock movements recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-faint text-xs border-b border-line">
                <th className="px-5 py-2.5 font-normal">Date</th>
                <th className="px-5 py-2.5 font-normal">Type</th>
                <th className="px-5 py-2.5 font-normal">Quantity</th>
                <th className="px-5 py-2.5 font-normal">Reference</th>
                <th className="px-5 py-2.5 font-normal">Balance</th>
              </tr>
            </thead>
            <tbody>
              {product.stockMovements.slice().reverse().map((m, i) => (
                <tr key={i} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 text-muted">{new Date(m.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs ${MOVEMENT_STYLES[m.type]}`}>{m.type}</span>
                  </td>
                  <td className="px-5 py-3">{m.type === 'Stock In' ? '+' : '-'}{Math.abs(m.quantity)}</td>
                  <td className="px-5 py-3 text-muted">{m.reference || '—'}</td>
                  <td className="px-5 py-3">{m.balanceAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}