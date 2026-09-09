import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/auth/me')
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/auth/login', { method: 'POST', body: { email, password } })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const signup = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/auth/signup', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiFetch('/api/auth/logout', { method: 'POST' })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const initialState = {
  user: null,
  company: null,
  role: null,
  status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
  initializing: true,   // true until the first /me check resolves
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.initializing = true
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload.user
        state.company = action.payload.company
        state.role = action.payload.role
        state.initializing = false
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null
        state.company = null
        state.role = null
        state.initializing = false
      })

      .addCase(login.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.company = action.payload.company
        state.role = action.payload.role
      })
      .addCase(login.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })

      .addCase(signup.pending, (state) => { state.status = 'loading'; state.error = null })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.company = action.payload.company
        state.role = action.payload.role
      })
      .addCase(signup.rejected, (state, action) => { state.status = 'failed'; state.error = action.payload })

      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.company = null
        state.role = null
        state.status = 'idle'
      })
  },
})

export const { clearAuthError } = authSlice.actions
export default authSlice.reducer