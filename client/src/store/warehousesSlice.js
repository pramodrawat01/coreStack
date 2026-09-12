import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchWarehouses = createAsyncThunk('warehouses/fetchWarehouses', async () =>
  apiFetch('/api/warehouses')
)

export const fetchWarehouseSummary = createAsyncThunk('warehouses/fetchSummary', async () =>
  apiFetch('/api/warehouses/summary')
)

export const fetchWarehouse = createAsyncThunk('warehouses/fetchWarehouse', async (id) =>
  apiFetch(`/api/warehouses/${id}`)
)

export const createWarehouse = createAsyncThunk('warehouses/createWarehouse', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/warehouses', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateWarehouse = createAsyncThunk('warehouses/updateWarehouse', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/warehouses/${id}`, { method: 'PATCH', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteWarehouse = createAsyncThunk('warehouses/deleteWarehouse', async (id, { rejectWithValue }) => {
  try {
    await apiFetch(`/api/warehouses/${id}`, { method: 'DELETE' })
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const warehousesSlice = createSlice({
  name: 'warehouses',
  initialState: { items: [], summary: null, current: null, loading: false, error: null },
  reducers: {
    clearCurrentWarehouse(state) { state.current = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWarehouses.pending, (state) => { state.loading = true })
      .addCase(fetchWarehouses.fulfilled, (state, action) => { state.loading = false; state.items = action.payload })
      .addCase(fetchWarehouses.rejected, (state) => { state.loading = false })
      .addCase(fetchWarehouseSummary.fulfilled, (state, action) => { state.summary = action.payload })
      .addCase(fetchWarehouse.fulfilled, (state, action) => { state.current = action.payload })
      .addCase(updateWarehouse.fulfilled, (state, action) => { state.current = action.payload })
      .addMatcher(
        (action) => action.type.startsWith('warehouses/') && action.type.endsWith('/rejected'),
        (state, action) => { state.error = action.payload }
      )
  },
})

export const { clearCurrentWarehouse } = warehousesSlice.actions
export default warehousesSlice.reducer