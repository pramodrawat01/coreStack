import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchInventory = createAsyncThunk('inventory/fetchInventory', async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/api/inventory?${query}`)
})

export const fetchInventorySummary = createAsyncThunk('inventory/fetchSummary', async () =>
  apiFetch('/api/inventory/summary')
)

export const fetchProductStock = createAsyncThunk('inventory/fetchProductStock', async (productId) =>
  apiFetch(`/api/inventory/stock/${productId}`)
)

export const adjustStock = createAsyncThunk('inventory/adjustStock', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/inventory/adjust', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const transferStock = createAsyncThunk('inventory/transferStock', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/inventory/transfer', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    limit: 50,
    summary: null,
    productStock: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearProductStock(state) {
      state.productStock = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.loading = true })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.items
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchInventory.rejected, (state) => { state.loading = false })
      .addCase(fetchInventorySummary.fulfilled, (state, action) => {
        state.summary = action.payload
      })
      .addCase(fetchProductStock.fulfilled, (state, action) => {
        state.productStock = action.payload
      })
      .addMatcher(
        (action) => action.type.startsWith('inventory/') && action.type.endsWith('/rejected'),
        (state, action) => { state.error = action.payload }
      )
  },
})

export const { clearProductStock } = inventorySlice.actions
export default inventorySlice.reducer