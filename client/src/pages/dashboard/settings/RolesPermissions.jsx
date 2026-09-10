import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus, FaTrash } from 'react-icons/fa'
import {
  fetchPermissionSchema, fetchRoles, createRole, updateRole, deleteRole,
} from '../../../store/teamSlice.js'

export default function RolesPermissions() {
  const dispatch = useDispatch()
  const { permissionSchema, blankPermissions, roles } = useSelector((s) => s.team)
  const [selectedRoleId, setSelectedRoleId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [newRoleName, setNewRoleName] = useState('')
  const [draftPermissions, setDraftPermissions] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'saved'



  useEffect(() => {
    dispatch(fetchPermissionSchema())
    dispatch(fetchRoles())
  }, [dispatch])

  useEffect(() => {
    if (!selectedRoleId && roles.length) setSelectedRoleId(roles[0]._id)
  }, [roles, selectedRoleId])

  const selectedRole = roles.find((r) => r._id === selectedRoleId)

  useEffect(() => {
    if (selectedRole) setDraftPermissions(selectedRole.permissions)
  }, [selectedRole])

  if (!permissionSchema) return null

  const togglePermission = (module, action) => {
    setDraftPermissions((prev) => ({
      ...prev,
      [module]: { ...prev[module], [action]: !prev[module]?.[action] },
    }))
  }

  const handleSaveExisting = () => {
    setSaveStatus('saving')
    dispatch(updateRole({ id: selectedRole._id, permissions: draftPermissions })).then((res) => {
      if(res.payload?._id){
        setSaveStatus('saved')
        setTimeout(() => {
          setSaveStatus('idle')
        }, 1500);
      } else {
        setSaveStatus('idle')
      }
    })
  }

  const handleCreateRole = () => {
    if (!newRoleName.trim()) return
    console.log("djfff")
    dispatch(createRole({ name: newRoleName.trim(), permissions: blankPermissions })).then((res) => {
      console.log(res)
      if (res.payload?._id) {
        setSelectedRoleId(res.payload._id)
        setCreating(false)
        setNewRoleName('')
      }
    }).catch((err) => {
      console.log( "got error while creating new role : ",err)
    })
  }

  const handleDelete = () => {
    if (!selectedRole || selectedRole.isDefaultOwnerRole) return
    if (!confirm(`Delete the "${selectedRole.name}" role?`)) return
    dispatch(deleteRole(selectedRole._id))
    setSelectedRoleId(null)
  }

  return (
    <div className="flex gap-6">
      {/* Role list */}
      <div className="w-56 shrink-0 flex flex-col gap-1">
        {roles.map((role) => (
          <button
            key={role._id}
            onClick={() => setSelectedRoleId(role._id)}
            className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
              role._id === selectedRoleId ? 'bg-white/[0.07] text-white' : 'text-faint hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {role.name}
            {role.isDefaultOwnerRole && <span className="ml-2 text-[10px] text-faint">(default)</span>}
          </button>
        ))}

        {creating ? (
          <div className="flex flex-col gap-2 mt-2">
            <input
              autoFocus
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              placeholder="Role name"
              className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-white outline-none focus:border-accent2"
            />
            <div className="flex gap-2">
              <button onClick={handleCreateRole} className="flex-1 rounded-md bg-accent2 text-white text-xs py-2">Create</button>
              <button onClick={() => setCreating(false)} className="flex-1 rounded-md border border-line text-xs py-2">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-accent2 hover:bg-white/[0.04] transition-colors mt-2"
          >
            <FaPlus size={11} /> New role
          </button>
        )}
      </div>

      {/* Permission grid — rendered entirely from permissionSchema, no hardcoded modules */}
      {selectedRole && draftPermissions && (
        <div className="flex-1 rounded-lg border border-line bg-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <div>
              <p className="text-sm font-medium text-white">{selectedRole.name}</p>
              {selectedRole.isDefaultOwnerRole && (
                <p className="text-xs text-faint mt-0.5">The Owner role always has full access and can't be edited.</p>
              )}
            </div>
            {!selectedRole.isDefaultOwnerRole && (
              <div className="flex gap-2">
                <button onClick={handleDelete} className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-2">
                  <FaTrash size={10} /> Delete
                </button>
                <button 
                onClick={handleSaveExisting}
                disabled={saveStatus === 'saving'}
                  className="rounded-md bg-accent2 text-white text-xs px-4 py-2 disabled:opacity-60 transition-colors">
                 {
                  saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? 'Saved ✓' : 'Save changes'
                 }
                </button>
              </div>
            )}
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-faint text-xs border-b border-line">
                <th className="px-5 py-2.5 font-normal">Module</th>
                {[...new Set(Object.values(permissionSchema).flatMap((m) => m.actions))].map((action) => (
                  <th key={action} className="px-5 py-2.5 font-normal capitalize">{action}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(permissionSchema).map(([moduleKey, { label, actions }]) => (
                <tr key={moduleKey} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 text-white">{label}</td>
                  {['read', 'write', 'manage', 'invite'].map((action) =>
                    actions.includes(action) ? (
                      <td key={action} className="px-5 py-3">
                        <input
                          type="checkbox"
                          disabled={selectedRole.isDefaultOwnerRole}
                          checked={!!draftPermissions[moduleKey]?.[action]}
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
      )}
    </div>
  )
}