

import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaPlus, FaSearch, FaEllipsisH } from 'react-icons/fa'
import StatusBadge from '../../../components/dashboard/StatusBadge.jsx'
import { usePermission } from '../../../hooks/usePermission.js'
import { fetchEmployees, fetchInvites, fetchRoles } from '../../../store/teamSlice.js'

const ROLE_COLORS = {
  Owner: 'bg-accent2/15 text-accent2',
  Admin: 'bg-accent2/15 text-accent2',
  Manager: 'bg-purple-400/15 text-purple-300',
  Staff: 'bg-white/[0.06] text-muted',
  Viewer: 'bg-white/[0.06] text-muted',
}
const DEFAULT_ROLE_STYLE = 'bg-white/[0.06] text-muted'

function timeAgo(dateString) {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return days === 1 ? 'Yesterday' : `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

function initialsOf(name) {
  return (name || '?')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function TeamMembers() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const canInvite = usePermission('employees', 'invite')

  const { employees, invites, roles } = useSelector((s) => s.team)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    dispatch(fetchEmployees())
    dispatch(fetchInvites())
    dispatch(fetchRoles())
  }, [dispatch])

  // Merge active employees + pending invites into one row shape
  const rows = useMemo(() => {
    const employeeRows = employees.map((emp) => ({
      key: emp._id,
      name: emp.name,
      email: emp.email,
      roleName: emp.role?.name || 'No role',
      status: emp.status === 'Deactivated' ? 'Suspended' : 'Active',
      lastActive: timeAgo(emp.updatedAt),
    }))

    const inviteRows = invites.map((inv) => ({
      key: inv._id,
      name: inv.email.split('@')[0],
      email: inv.email,
      roleName: inv.roleName,
      status: 'Pending invite',
      lastActive: `Invited ${timeAgo(inv.createdAt).replace(' ago', '')} ago`,
    }))

    return [...employeeRows, ...inviteRows]
  }, [employees, invites])

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesSearch =
        !search.trim() ||
        row.name.toLowerCase().includes(search.toLowerCase()) ||
        row.email.toLowerCase().includes(search.toLowerCase())
      const matchesRole = roleFilter === 'all' || row.roleName === roleFilter
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter
      return matchesSearch && matchesRole && matchesStatus
    })
  }, [rows, search, roleFilter, statusFilter])

  const stats = useMemo(
    () => ({
      total: rows.length,
      active: rows.filter((r) => r.status === 'Active').length,
      pending: rows.filter((r) => r.status === 'Pending invite').length,
    }),
    [rows]
  )

  return (
    <div>
      <div className="flex items-start justify-between">
        
        <div>
          <h1 className="text-3xl font-semibold">Team Members</h1>
          <p className="text-sm text-faint mt-1">Manage who has access to your Corestack workspace.</p>
        </div>
        {canInvite && (
          <button
            onClick={() => navigate('/dashboard/settings/invite')}
            className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
          >
            <FaPlus size={11} /> Invite Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        <div className="rounded-lg border border-line bg-surface px-4 py-3">
          <p className="text-xs text-faint">Total Members</p>
          <p className="text-2xl font-semibold mt-1">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-line bg-surface px-4 py-3">
          <p className="text-xs text-faint">Active</p>
          <p className="text-2xl font-semibold mt-1">{stats.active}</p>
        </div>
        <div className="rounded-lg border border-line bg-surface px-4 py-3">
          <p className="text-xs text-faint">Pending Invites</p>
          <p className="text-2xl font-semibold mt-1">{stats.pending}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm flex-1">
          <FaSearch size={12} className="text-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="bg-transparent outline-none text-white placeholder:text-faint flex-1"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted"
        >
          <option value="all">All Roles</option>
          {roles.map((r) => (
            <option key={r._id} value={r.name}>{r.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted"
        >
          <option value="all">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
          <option value="Pending invite">Pending invite</option>
        </select>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-faint border-b border-line text-xs">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Role</th>
              <th className="px-4 py-3 font-normal">Status</th>
              <th className="px-4 py-3 font-normal">Last Active</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-faint text-sm">
                  No members match your search.
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr key={row.key} className="border-b border-line last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-[10px] font-semibold shrink-0">
                        {initialsOf(row.name)}
                      </span>
                      <span className="capitalize">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{row.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-xs ${ROLE_COLORS[row.roleName] || DEFAULT_ROLE_STYLE}`}>
                      {row.roleName}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                  <td className="px-4 py-3 text-faint">{row.lastActive}</td>
                  <td className="px-4 py-3 text-faint">
                    <FaEllipsisH size={12} className="cursor-pointer hover:text-white" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-faint">
        <span>Showing {filteredRows.length} of {rows.length} members</span>
      </div>
    </div>
  )
}