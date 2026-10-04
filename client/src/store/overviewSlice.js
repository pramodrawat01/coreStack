import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchOverview = createAsyncThunk(
  'overview/fetchOverview',
  async (period = 'last_30', { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/overview?period=${period}`)
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to load overview')
    }
  }
)

const overviewSlice = createSlice({
  name: 'overview',
  initialState: { data: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverview.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchOverview.fulfilled, (state, action) => { state.loading = false; state.data = action.payload })
      .addCase(fetchOverview.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default overviewSlice.reducer