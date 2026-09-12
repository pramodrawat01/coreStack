import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { fetchWarehouse, createWarehouse, updateWarehouse, clearCurrentWarehouse } from '../../store/warehousesSlice.js'
import { notifySuccess, notifyError } from '../../lib/toast.js'

const EMPTY_FORM = {
  name: '', code: '', manager: '', address: '', city: '', state: '', zipCode: '',
  status: 'Active', storageCapacity: '',
}

export default function WarehouseForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current: existing } = useSelector((s) => s.warehouses)

  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isEdit) dispatch(fetchWarehouse(id))
    return () => dispatch(clearCurrentWarehouse())
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        name: existing.name, code: existing.code, manager: existing.manager,
        address: existing.address, city: existing.city, state: existing.state, zipCode: existing.zipCode,
        status: existing.status, storageCapacity: existing.storageCapacity,
      })
    }
  }, [isEdit, existing])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      notifyError('Warehouse name is required')
      return
    }

    const payload = { ...form, storageCapacity: Number(form.storageCapacity) || 0 }

    setSaving(true)
    try {
      if (isEdit) {
        await dispatch(updateWarehouse({ id, ...payload })).unwrap()
        notifySuccess('Warehouse updated')
        navigate(`/dashboard/warehouses/${id}`)
      } else {
        const created = await dispatch(createWarehouse(payload)).unwrap()
        notifySuccess('Warehouse created')
        navigate(`/dashboard/warehouses/${created._id}`)
      }
    } catch (err) {
      notifyError(err || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Link to="/dashboard/warehouses" className="text-sm text-faint hover:text-white transition-colors">← Back to Warehouses</Link>
      <h1 className="text-xl font-semibold mt-3">{isEdit ? 'Edit warehouse' : 'Add warehouse'}</h1>
      <p className="text-sm text-faint mt-1">
        {isEdit ? 'Update warehouse details and storage capacity' : 'Add a new facility and its storage capacity'}
      </p>

      <form onSubmit={handleSubmit} className="rounded-xl border border-line bg-panel p-6 mt-6 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Warehouse name</span>
            <input name="name" value={form.name} onChange={handleChange} required
              className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Warehouse code</span>
            <input name="code" value={form.code} onChange={handleChange} placeholder="WH-MH-001"
              className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-muted">Manager</span>
            <input name="manager" value={form.manager} onChange={handleChange}
              className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
          </label>

          <label className="flex flex-col gap-1.5 sm:col-span-2">
            <span className="text-xs font-medium text-muted">Address</span>
            <input name="address" value={form.address} onChange={handleChange}
              className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">City</span>
            <input name="city" value={form.city} onChange={handleChange}
              className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">State</span>
              <input name="state" value={form.state} onChange={handleChange}
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted">ZIP code</span>
              <input name="zipCode" value={form.zipCode} onChange={handleChange}
                className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
            </label>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Status</span>
            <select name="status" value={form.status} onChange={handleChange}
              className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2">
              <option value="Active">Active</option>
              <option value="Review">Review</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted">Storage capacity (sq ft)</span>
            <input type="number" min="0" name="storageCapacity" value={form.storageCapacity} onChange={handleChange}
              className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2" />
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-5 border-t border-line">
          <button type="button" onClick={() => navigate(-1)} className="rounded-md border border-line px-4 py-2.5 text-sm text-white hover:border-white/40 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 disabled:opacity-60 transition-colors">
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create warehouse'}
          </button>
        </div>
      </form>
    </div>
  )
}