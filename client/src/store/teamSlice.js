import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiFetch } from '../lib/api.js'

export const fetchPermissionSchema = createAsyncThunk('team/fetchPermissionSchema', async () =>
  apiFetch('/api/company/permission-schema')
)

export const fetchRoles = createAsyncThunk('team/fetchRoles', async () => apiFetch('/api/company/roles'))

export const createRole = createAsyncThunk('team/createRole', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/company/roles', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const updateRole = createAsyncThunk('team/updateRole', async ({ id, ...payload }, { rejectWithValue }) => {
  try {
    return await apiFetch(`/api/company/roles/${id}`, { method: 'PATCH', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const deleteRole = createAsyncThunk('team/deleteRole', async (id, { rejectWithValue }) => {
  try {
    await apiFetch(`/api/company/roles/${id}`, { method: 'DELETE' })
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const fetchEmployees = createAsyncThunk('team/fetchEmployees', async () => apiFetch('/api/company/employees'))

export const fetchInvites = createAsyncThunk('team/fetchInvites', async () => apiFetch('/api/company/invites'))

export const inviteEmployee = createAsyncThunk('team/inviteEmployee', async (payload, { rejectWithValue }) => {
  try {
    return await apiFetch('/api/company/invites', { method: 'POST', body: payload })
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

export const revokeInvite = createAsyncThunk('team/revokeInvite', async (id, { rejectWithValue }) => {
  try {
    await apiFetch(`/api/company/invites/${id}`, { method: 'DELETE' })
    return id
  } catch (err) {
    return rejectWithValue(err.message)
  }
})

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    permissionSchema: null,
    blankPermissions: null,
    roles: [],
    employees: [],
    invites: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearTeamError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissionSchema.fulfilled, (state, action) => {
        state.permissionSchema = action.payload.schema
        state.blankPermissions = action.payload.blank
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload)
      })
      
      .addCase(updateRole.fulfilled, (state, action) => {
        const i = state.roles.findIndex((r) => r._id === action.payload._id)
        if (i !== -1) state.roles[i] = action.payload
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((r) => r._id !== action.payload)
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload
      })
      .addCase(fetchInvites.fulfilled, (state, action) => {
        state.invites = action.payload
      })
      .addCase(inviteEmployee.fulfilled, (state, action) => {
        state.lastInviteLink = action.payload.inviteLink
      })
      .addCase(revokeInvite.fulfilled, (state, action) => {
        state.invites = state.invites.filter((i) => i._id !== action.payload)
      })
      .addMatcher(
        (action) => action.type.startsWith('team/') && action.type.endsWith('/rejected'),
        (state, action) => { state.error = action.payload }
      )
  },
})

export const { clearTeamError } = teamSlice.actions
export default teamSlice.reducer