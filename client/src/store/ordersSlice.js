import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiFetch } from '../lib/api.js';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async ({ search = '', status = 'All statuses' } = {}, { rejectWithValue }) => {
    try {
      // Returned directly to match apiFetch usage in customersSlice
      const res = await apiFetch(`/api/orders?search=${encodeURIComponent(search)}&status=${status}`);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      const res = await apiFetch(`/api/orders/${id}`);
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch order');
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await apiFetch('/api/orders', { method: 'POST', body: payload });
      return res;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create order');
    }
  }
);


export const updateOrder = createAsyncThunk('orders/updateOrder', async ({ id, ...payload }, { rejectWithValue }) => {
  try { return await apiFetch(`/api/orders/${id}`, { method: 'PUT', body: payload }); }
  catch (err) { return rejectWithValue(err.message || 'Failed to update order'); }
});

export const shipOrder = createAsyncThunk('orders/shipOrder', async (id, { rejectWithValue }) => {
  try { return await apiFetch(`/api/orders/${id}/ship`, { method: 'POST' }); }
  catch (err) { return rejectWithValue(err.message || 'Failed to ship order'); }
});

export const deliverOrder = createAsyncThunk('orders/deliverOrder', async (id, { rejectWithValue }) => {
  try { return await apiFetch(`/api/orders/${id}/deliver`, { method: 'POST' }); }
  catch (err) { return rejectWithValue(err.message || 'Failed to mark delivered'); }
});


const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    stats: { totalOrders: 0, processingCount: 0, shippedCount: 0, revenue: 0 },
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Fallback to empty array and default stats if backend returns undefined data
        state.items = action.payload?.orders || [];
        state.stats = action.payload?.stats || {
          totalOrders: 0,
          processingCount: 0,
          shippedCount: 0,
          revenue: 0,
        };
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addMatcher(
        (action) => [updateOrder, shipOrder, deliverOrder].some((thunk) => thunk.fulfilled.match(action)),
        (state, action) => {
          state.currentOrder = action.payload;
          const index = state.items.findIndex((item) => item._id === action.payload._id);
          if (index !== -1) state.items[index] = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected') && action.type.startsWith('orders/'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;