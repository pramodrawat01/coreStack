import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchInvoices = createAsyncThunk('invoices/fetchInvoices', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    return await apiFetch(`/api/invoices?${query}`)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const fetchInvoiceStats = createAsyncThunk('invoices/fetchStats', async () =>
  apiFetch('/api/invoices/stats')
)

export const fetchInvoice = createAsyncThunk('invoices/fetchInvoice', async (id, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/invoices/${id}`)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createInvoice = createAsyncThunk('invoices/createInvoice', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/invoices', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateInvoice = createAsyncThunk('invoices/updateInvoice', async ({ id, body }, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/invoices/${id}`, { method: 'PUT', body })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const sendInvoice = createAsyncThunk('invoices/sendInvoice', async (id, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/invoices/${id}/send`, { method: 'POST', body: {} })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const recordPayment = createAsyncThunk('invoices/recordPayment', async ({ id, body }, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/invoices/${id}/payments`, { method: 'POST', body })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const voidInvoice = createAsyncThunk('invoices/voidInvoice', async (id, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/invoices/${id}/void`, { method: 'POST', body: {} })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteInvoice = createAsyncThunk('invoices/deleteInvoice', async (id, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/invoices/${id}`, { method: 'DELETE' })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

// Thunks that write data; they drive `saving` instead of `loading`
const mutationThunks = [createInvoice, updateInvoice, sendInvoice, recordPayment, voidInvoice, deleteInvoice]

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    stats: null,
    current: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearCurrentInvoice(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => { state.loading = true })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false
        state.invoices = action.payload.invoices
        state.pagination = action.payload.pagination
      })
      .addCase(fetchInvoices.rejected, (state) => { state.loading = false })
      .addCase(fetchInvoiceStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats
      })
      .addCase(fetchInvoice.pending, (state) => { state.loading = true })
      .addCase(fetchInvoice.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload.invoice
      })
      .addCase(fetchInvoice.rejected, (state) => { state.loading = false })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter((i) => i._id !== action.payload.id)
        state.current = null
      })
      .addMatcher(
        isAnyOf(...mutationThunks.map((t) => t.pending)),
        (state) => { state.saving = true }
      )
      .addMatcher(
        isAnyOf(...mutationThunks.flatMap((t) => [t.fulfilled, t.rejected])),
        (state) => { state.saving = false }
      )
      .addMatcher(
        isAnyOf(
          createInvoice.fulfilled,
          updateInvoice.fulfilled,
          sendInvoice.fulfilled,
          recordPayment.fulfilled,
          voidInvoice.fulfilled
        ),
        (state, action) => { state.current = action.payload.invoice }
      )
      .addMatcher(
        (action) => action.type.startsWith('invoices/') && action.type.endsWith('/pending'),
        (state) => { state.error = null }
      )
      .addMatcher(
        (action) => action.type.startsWith('invoices/') && action.type.endsWith('/rejected'),
        (state, action) => { state.error = action.payload }
      )
  },
})

export const { clearCurrentInvoice } = invoiceSlice.actions
export const selectInvoicesLoading = (state) => state.invoices.loading || state.invoices.saving
export default invoiceSlice.reducer