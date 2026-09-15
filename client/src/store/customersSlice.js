// client/src/store/customersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async ({ search = '', status = 'All' } = {}, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/customers?search=${encodeURIComponent(search)}&status=${status}`)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchCustomerById',
  async (id, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/customers/${id}`)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      return await apiFetch('/api/customers', { method: 'POST', body: customerData })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, customerData }, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/customers/${id}`, { method: 'PUT', body: customerData })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    items: [],
    stats: { totalCustomers: 0, activeCustomers: 0, newThisMonth: 0, avgOrderValue: 0 },
    currentCustomer: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.customers
        state.stats = action.payload.stats
      })
      .addCase(fetchCustomerById.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false
        state.currentCustomer = action.payload
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.currentCustomer = action.payload
        const index = state.items.findIndex((item) => item._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('customers/'),
        (state, action) => { state.loading = false; state.error = action.payload }
      )
  },
})

export const { clearCurrentCustomer } = customersSlice.actions
export default customersSlice.reducer