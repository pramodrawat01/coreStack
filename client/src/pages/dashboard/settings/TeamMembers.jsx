import { FaPlus, FaSearch, FaEllipsisH } from 'react-icons/fa'
import StatusBadge from '../../../components/dashboard/StatusBadge.jsx'

const STATS = [
  { label: 'Total Members', value: 14 },
  { label: 'Active', value: 11 },
  { label: 'Pending Invites', value: 3 },
]

const MEMBERS = [
  { initials: 'AR', name: 'Alex Rivera', email: 'alex@acmemfg.com', role: 'Admin', status: 'Active', lastActive: '2m ago' },
  { initials: 'PA', name: 'Priya Anand', email: 'priya@acmemfg.com', role: 'Manager', status: 'Active', lastActive: '1h ago' },
  { initials: 'DO', name: 'Derek Osei', email: 'derek@acmemfg.com', role: 'Staff', status: 'Active', lastActive: 'Yesterday' },
  { initials: 'MF', name: 'Monica Fields', email: 'monica@acmemfg.com', role: 'Staff', status: 'Active', lastActive: '3d ago' },
  { initials: 'SW', name: 'Sam Whitfield', email: 'sam@acmemfg.com', role: 'Viewer', status: 'Suspended', lastActive: '2w ago' },
  { initials: 'JL', name: 'Jordan Lee', email: 'jordan@acmemfg.com', role: 'Manager', status: 'Pending invite', lastActive: 'Invited 3d ago' },
  { initials: 'TB', name: 'Tasha Brooks', email: 'tasha@acmemfg.com', role: 'Staff', status: 'Pending invite', lastActive: 'Invited 1d ago' },
  { initials: 'WC', name: 'Will Chen', email: 'will@acmemfg.com', role: 'Admin', status: 'Pending invite', lastActive: 'Invited 5h ago' },
]

export default function TeamMembers() {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold">Team Members</h1>
          <p className="text-sm text-faint mt-1">Manage who has access to your Corestack workspace.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors">
          <FaPlus size={11} /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-6">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-line bg-surface px-4 py-3">
            <p className="text-xs text-faint">{stat.label}</p>
            <p className="text-2xl font-semibold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm text-faint flex-1">
          <FaSearch size={12} />
          <span>Search by name or email</span>
        </div>
        <select className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted">
          <option>All Roles</option>
        </select>
        <select className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted">
          <option>All Statuses</option>
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
            {MEMBERS.map((m) => (
              <tr key={m.email} className="border-b border-line last:border-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-[10px] font-semibold">
                      {m.initials}
                    </span>
                    {m.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{m.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded px-2 py-0.5 text-xs bg-white/[0.06] text-muted">{m.role}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3 text-faint">{m.lastActive}</td>
                <td className="px-4 py-3 text-faint">
                  <FaEllipsisH size={12} className="cursor-pointer hover:text-white" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-faint">
        <span>Showing 1-8 of 14 members</span>
        <span>Previous · 1 · 2 · Next</span>
      </div>
    </div>
  )
}