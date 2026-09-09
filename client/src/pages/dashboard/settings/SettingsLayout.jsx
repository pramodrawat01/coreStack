import { NavLink, Outlet } from 'react-router-dom'

const TABS = [
  { label: 'Company', to: '/dashboard/settings/company' },
  { label: 'Users', to: '/dashboard/settings/users' },
  { label: 'Roles & Permissions', to: '/dashboard/settings/roles' },
  { label: 'Invitations', to: '/dashboard/settings/invitations' },
  { label: 'Profile', to: '/dashboard/settings/profile' },
  { label: 'Security', to: '/dashboard/settings/security' },
  { label: 'Notifications', to: '/dashboard/settings/notifications' },
]

export default function SettingsLayout() {
  return (
    <div>
      <p className="text-sm text-faint">Settings</p>

      <div className="flex items-center gap-1 border-b border-line mt-2 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `px-3.5 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                isActive ? 'text-white border-white' : 'text-faint border-transparent hover:text-white'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  )
}