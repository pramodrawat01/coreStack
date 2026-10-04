import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api'
const makeThunk = (name, path) =>
  createAsyncThunk(`reports/${name}`, async (period = 'this_month', { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/reports/${path}?period=${period}`)
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load report')
    }
  })

export const fetchReportsSummary = makeThunk('fetchSummary', 'summary')
export const fetchSalesReport = makeThunk('fetchSales', 'sales')
export const fetchInventoryReport = makeThunk('fetchInventory', 'inventory')

const reportsSlice = createSlice({
  name: 'reports',
  initialState: { 
    summary: null, 
    sales: null, 
    inventory: null, 
    loading: false, 
    error: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportsSummary.fulfilled, (state, action) => { state.summary = action.payload })
      .addCase(fetchSalesReport.fulfilled, (state, action) => { state.sales = action.payload })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => { state.inventory = action.payload })
      .addMatcher(
        (a) => a.type.startsWith('reports/') && a.type.endsWith('/pending'),
        (state) => { state.loading = true; state.error = null }
      )
      .addMatcher(
        (a) => a.type.startsWith('reports/') && a.type.endsWith('/fulfilled'),
        (state) => { state.loading = false }
      )
      .addMatcher(
        (a) => a.type.startsWith('reports/') && a.type.endsWith('/rejected'),
        (state, action) => { state.loading = false; state.error = action.payload }
      )
  },
})

export default reportsSlice.reducer