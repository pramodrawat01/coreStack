import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api'

export const fetchPayments = createAsyncThunk('payments/fetchPayments', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString()
    return await apiFetch(`/api/payments?${query}`)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const fetchPaymentStats = createAsyncThunk('payments/fetchStats', async () =>
  apiFetch('/api/payments/stats')
)

export const fetchPayment = createAsyncThunk('payments/fetchPayment', async (id, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/payments/${id}`)
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const createPayment = createAsyncThunk('payments/createPayment', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/payments', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const refundPayment = createAsyncThunk('payments/refundPayment', async (id, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/payments/${id}/refund`, { method: 'POST', body: {} })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const mutationThunks = [createPayment, refundPayment]

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    payments: [],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    stats: null,
    current: null,
    loading: false,
    saving: false,
    error: null,
  },
  reducers: {
    clearCurrentPayment(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => { state.loading = true })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false
        state.payments = action.payload.payments
        state.pagination = action.payload.pagination
      })
      .addCase(fetchPayments.rejected, (state) => { state.loading = false })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.stats = action.payload.stats
      })
      .addCase(fetchPayment.pending, (state) => { state.loading = true })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload.payment
      })
      .addCase(fetchPayment.rejected, (state) => { state.loading = false })
      .addMatcher(isAnyOf(...mutationThunks.map((t) => t.pending)), (state) => { state.saving = true })
      .addMatcher(isAnyOf(...mutationThunks.flatMap((t) => [t.fulfilled, t.rejected])), (state) => { state.saving = false })
      .addMatcher(isAnyOf(createPayment.fulfilled, refundPayment.fulfilled), (state, action) => {
        state.current = action.payload.payment
      })
      .addMatcher((a) => a.type.startsWith('payments/') && a.type.endsWith('/pending'), (state) => { state.error = null })
      .addMatcher((a) => a.type.startsWith('payments/') && a.type.endsWith('/rejected'), (state, action) => { state.error = action.payload })
  },
})

export const { clearCurrentPayment } = paymentsSlice.actions
export const selectPaymentsLoading = (state) => state.payments.loading || state.payments.saving
export default paymentsSlice.reducer