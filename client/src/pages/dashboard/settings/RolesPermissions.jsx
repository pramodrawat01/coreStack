

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus, FaPen, FaTrash, FaArrowLeft, FaCheck } from 'react-icons/fa'
import { fetchPermissionSchema, fetchRoles, fetchEmployees, createRole, updateRole, deleteRole } from '../../../store/teamSlice.js'
import { notifySuccess, notifyError } from '../../../lib/toast.js'

const DOT_COLORS = ['bg-accent2', 'bg-purple-400', 'bg-emerald-400', 'bg-amber-400', 'bg-pink-400', 'bg-accent']

function moduleHasAnyAccess(permissions, moduleKey) {
  const modulePerms = permissions?.[moduleKey]
  if (!modulePerms) return false
  return Object.values(modulePerms).some((v) => v === true)
}

export default function RolesPermissions() {
  const dispatch = useDispatch()
  const { permissionSchema, blankPermissions, roles, employees } = useSelector((s) => s.team)
  const [view, setView] = useState('overview') // 'overview' | 'edit'
  const [editingRoleId, setEditingRoleId] = useState(null) // null while creating a new role

  useEffect(() => {
    dispatch(fetchPermissionSchema())
    dispatch(fetchRoles())
    dispatch(fetchEmployees())
  }, [dispatch])

  const memberCounts = useMemo(() => {
    const counts = {}
    for (const emp of employees) {
      const id = emp.role?._id
      if (id) counts[id] = (counts[id] || 0) + 1
    }
    return counts
  }, [employees])

  if (!permissionSchema) return null

  const openEdit = (roleId) => {
    setEditingRoleId(roleId)
    setView('edit')
  }

  const openCreate = () => {
    setEditingRoleId(null)
    setView('edit')
  }

  if (view === 'edit') {
    return (
      <RoleEditor
        roleId={editingRoleId}
        onBack={() => setView('overview')}
      />
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Roles & Permissions</h1>
          <p className="text-sm text-faint mt-1">Define what each role can see and do across Corestack.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
        >
          <FaPlus size={11} /> Create Role
        </button>
      </div>

      {/* Role cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {roles.map((role) => (
          <div key={role._id} className="rounded-lg border border-line bg-surface p-4 flex flex-col">
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium text-white">{role.name}</p>
              {!role.isDefaultOwnerRole && (
                <button onClick={() => openEdit(role._id)} className="text-accent2 hover:text-white transition-colors">
                  <FaPen size={11} />
                </button>
              )}
            </div>
            <p className="text-xs text-faint mt-1.5 flex-1">{role.description || 'No description'}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-faint">{memberCounts[role._id] || 0} members</span>
              {role.isDefaultOwnerRole && (
                <span className="text-[10px] rounded px-2 py-0.5 bg-white/[0.06] text-faint">System role</span>
              ) }
            </div>
          </div>
        ))}
      </div>

      {/* Permission matrix — read-only summary across all roles */}
      <div className="rounded-lg border border-line bg-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-line">
          <p className="text-sm font-medium text-white">Permission Matrix</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-faint text-xs border-b border-line">
                <th className="px-5 py-2.5 font-normal">Module / Permission</th>
                {roles.map((role, i) => (
                  <th key={role._id} className="px-5 py-2.5 font-normal">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${DOT_COLORS[i % DOT_COLORS.length]}`} />
                      {role.name.toUpperCase()}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissionSchema).map(([moduleKey, { label }]) => (
                <tr key={moduleKey} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 text-white">{label}</td>
                  {roles.map((role) => (
                    <td key={role._id} className="px-5 py-3">
                      {moduleHasAnyAccess(role.permissions, moduleKey) ? (
                        <FaCheck size={11} className="text-accent2" />
                      ) : (
                        <span className="text-faint">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function RoleEditor({ roleId, onBack }) {
  const dispatch = useDispatch()
  const { permissionSchema, blankPermissions, roles } = useSelector((s) => s.team)
  const existingRole = roles.find((r) => r._id === roleId)
  const isNew = !existingRole

  const [name, setName] = useState(existingRole?.name || '')
  const [description, setDescription] = useState(existingRole?.description || '')
  const [permissions, setPermissions] = useState(existingRole?.permissions || blankPermissions)
  const [saving, setSaving] = useState(false)

  const ACTION_COLUMNS = permissionSchema
    ? [...new Set(Object.values(permissionSchema).flatMap((m) => m.actions))]
    : []

  const togglePermission = (module, action) => {
    setPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: !prev[module]?.[action] },
    }))
  }

  const handleSave = async () => {
    if (!name.trim()) {
      notifyError('Role name is required')
      return
    }
    setSaving(true)
    try {
      if (isNew) {
        await dispatch(createRole({ name: name.trim(), description, permissions })).unwrap()
        notifySuccess('Role created')
      } else {
        await dispatch(updateRole({ id: existingRole._id, name: name.trim(), description, permissions })).unwrap()
        notifySuccess('Role updated')
      }
      onBack()
    } catch (err) {
      notifyError(err || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!existingRole || !confirm(`Delete the "${existingRole.name}" role?`)) return
    try {
      await dispatch(deleteRole(existingRole._id)).unwrap()
      notifySuccess('Role deleted')
      onBack()
    } catch (err) {
      notifyError(err || 'Could not delete this role')
    }
  }

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-faint hover:text-white transition-colors mb-5">
        <FaArrowLeft size={11} /> Back to Roles
      </button>

      <div className="flex items-start justify-between mb-6">
        <div className="flex flex-col gap-3 max-w-md flex-1">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Role name"
            className="rounded-md border border-line bg-surface px-3 py-2 text-lg font-semibold text-white outline-none focus:border-accent2"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description of what this role can do"
            className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted outline-none focus:border-accent2"
          />
        </div>

        <div className="flex gap-2 shrink-0">
          {!isNew && (
            <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3">
              <FaTrash size={10} /> Delete
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-accent2 text-white text-sm px-4 py-2 disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving…' : isNew ? 'Create role' : 'Save changes'}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-line bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-faint text-xs border-b border-line">
              <th className="px-5 py-2.5 font-normal">Module</th>
              {ACTION_COLUMNS.map((action) => (
                <th key={action} className="px-5 py-2.5 font-normal capitalize">{action}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(permissionSchema).map(([moduleKey, { label, actions }]) => (
              <tr key={moduleKey} className="border-b border-line last:border-0">
                <td className="px-5 py-3 text-white">{label}</td>
                {ACTION_COLUMNS.map((action) =>
                  actions.includes(action) ? (
                    <td key={action} className="px-5 py-3">
                      <input
                        type="checkbox"
                        checked={!!permissions[moduleKey]?.[action]}
                        onChange={() => togglePermission(moduleKey, action)}
                        className="accent-accent2 h-4 w-4"
                      />
                    </td>
                  ) : (
                    <td key={action} className="px-5 py-3 text-faint">—</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}