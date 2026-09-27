import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchPurchaseOrders = createAsyncThunk(
  'purchaseOrders/fetchPurchaseOrders',
  async ({ search = '', status = 'All statuses' } = {}, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/purchase-orders?search=${encodeURIComponent(search)}&status=${status}`)
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch purchase orders')
    }
  }
)

export const fetchPurchaseOrderById = createAsyncThunk(
  'purchaseOrders/fetchPurchaseOrderById',
  async (id, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/purchase-orders/${id}`)
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch purchase order')
    }
  }
)

export const createPurchaseOrder = createAsyncThunk(
  'purchaseOrders/createPurchaseOrder',
  async (payload, { rejectWithValue }) => {
    try {
      return await apiFetch('/api/purchase-orders', { method: 'POST', body: payload })
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create purchase order')
    }
  }
)

export const updatePurchaseOrder = createAsyncThunk(
  'purchaseOrders/updatePurchaseOrder',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/purchase-orders/${id}`, { method: 'PUT', body: payload })
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update purchase order')
    }
  }
)

export const approvePurchaseOrder = createAsyncThunk(
  'purchaseOrders/approvePurchaseOrder',
  async (id, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/purchase-orders/${id}/approve`, { method: 'POST' })
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to approve purchase order')
    }
  }
)

export const markPurchaseOrderInTransit = createAsyncThunk(
  'purchaseOrders/markPurchaseOrderInTransit',
  async (id, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/purchase-orders/${id}/in-transit`, { method: 'POST' })
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update purchase order')
    }
  }
)

export const receivePurchaseOrder = createAsyncThunk(
  'purchaseOrders/receivePurchaseOrder',
  async (id, { rejectWithValue }) => {
    try {
      return await apiFetch(`/api/purchase-orders/${id}/receive`, { method: 'POST' })
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to receive purchase order')
    }
  }
)

const purchaseOrdersSlice = createSlice({
  name: 'purchaseOrders',
  initialState: {
    items: [],
    stats: {
      totalPOs: 0,
      openPOs: 0,
      openCommitted: 0,
      awaitingApproval: 0,
      awaitingApprovalValue: 0,
      inTransit: 0,
      inTransitValue: 0,
      receivedThisMonth: 0,
    },
    currentPO: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPO: (state) => {
      state.currentPO = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload?.purchaseOrders || []
        state.stats = action.payload?.stats || state.stats
      })
      .addCase(fetchPurchaseOrderById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPurchaseOrderById.fulfilled, (state, action) => {
        state.loading = false
        state.currentPO = action.payload
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addMatcher(
        (action) =>
          [updatePurchaseOrder, approvePurchaseOrder, markPurchaseOrderInTransit, receivePurchaseOrder].some(
            (thunk) => thunk.fulfilled.match(action)
          ),
        (state, action) => {
          state.currentPO = action.payload
          const index = state.items.findIndex((item) => item._id === action.payload._id)
          if (index !== -1) state.items[index] = action.payload
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('purchaseOrders/'),
        (state, action) => {
          state.loading = false
          state.error = action.payload
        }
      )
  },
})

export const { clearCurrentPO } = purchaseOrdersSlice.actions
export default purchaseOrdersSlice.reducer