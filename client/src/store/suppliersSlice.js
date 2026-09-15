import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async ({ search = '', status = 'All' } = {}, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/suppliers?search=${encodeURIComponent(search)}&status=${status}`)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchSupplierById = createAsyncThunk(
  'suppliers/fetchSupplierById',
  async (id, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/suppliers/${id}`)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createSupplier = createAsyncThunk(
  'suppliers/createSupplier',
  async (supplierData, { rejectWithValue }) => {
    try {
      return await apiFetch('/api/suppliers', { method: 'POST', body: supplierData })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async ({ id, supplierData }, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/suppliers/${id}`, { method: 'PUT', body: supplierData })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const suppliersSlice = createSlice({
  name: 'suppliers',
  initialState: {
    items: [],
    stats: { totalSuppliers: 0, activeSuppliers: 0, openPurchaseOrders: 0, averageLeadTime: 0 },
    currentSupplier: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentSupplier: (state) => {
      state.currentSupplier = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.suppliers
        state.stats = action.payload.stats
      })
      .addCase(fetchSupplierById.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchSupplierById.fulfilled, (state, action) => {
        state.loading = false
        state.currentSupplier = action.payload
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.currentSupplier = action.payload
        const index = state.items.findIndex((item) => item._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('suppliers/'),
        (state, action) => { state.loading = false; state.error = action.payload }
      )
  },
})

export const { clearCurrentSupplier } = suppliersSlice.actions
export default suppliersSlice.reducer