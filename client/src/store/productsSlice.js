import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiFetch(`/api/products?${query}`)
})

export const fetchCategories = createAsyncThunk('products/fetchCategories', async () =>
  apiFetch('/api/products/categories')
)

export const fetchProduct = createAsyncThunk('products/fetchProduct', async (id) =>
  apiFetch(`/api/products/${id}`)
)

export const createProduct = createAsyncThunk('products/createProduct', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/products', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/products/${id}`, { method: 'PATCH', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { rejectWithValue }) => {
  try {
    await apiFetch(`/api/products/${id}`, { method: 'DELETE' })
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    page: 1,
    limit: 8,
    categories: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProduct(state) {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.products
        state.total = action.payload.total
        state.page = action.payload.page
        state.limit = action.payload.limit
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.current = action.payload
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.current = action.payload
      })
      .addMatcher(
        (action) => action.type.startsWith('products/') && action.type.endsWith('/rejected'),
        (state, action) => { state.error = action.payload }
      )
  },
})

export const { clearCurrentProduct } = productsSlice.actions
export default productsSlice.reducer