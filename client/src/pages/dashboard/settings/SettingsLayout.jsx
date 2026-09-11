// src/pages/dashboard/settings/SettingsLayout.jsx — full rewrite

import { NavLink, Outlet } from 'react-router-dom'
import { usePermission } from '../../../hooks/usePermission.js'

export default function SettingsLayout() {
  const canManageRoles = usePermission('roles', 'manage')
  const canReadEmployees = usePermission('employees', 'read')
  const canInviteEmployees = usePermission('employees', 'invite')

  const TABS = [
    { label: 'Company', to: '/dashboard/settings/company', visible: true },
    { label: 'Users / Employees', to: '/dashboard/settings/users', visible: canReadEmployees },
    { label: 'Roles & Permissions', to: '/dashboard/settings/roles', visible: canManageRoles },
    { label: 'Invitations', to: '/dashboard/settings/invitations', visible: canInviteEmployees },
    { label: 'Profile', to: '/dashboard/settings/profile', visible: true },
    { label: 'Security', to: '/dashboard/settings/security', visible: true },
    { label: 'Notifications', to: '/dashboard/settings/notifications', visible: true },
  ]

  return (
    <div className=''>

      <div className="flex items-center gap-4 border-b border-line mb-6 overflow-x-auto">
        {TABS.filter((tab) => tab.visible).map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              ` py-2.5 pt-0.5  text-sm whitespace-nowrap border-b-2 -mb-1px transition-colors ${
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