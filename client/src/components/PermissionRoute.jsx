import { Navigate } from 'react-router-dom'
import { usePermission } from '../hooks/usePermission.js'

export default function PermissionRoute({ module, action, children }) {
  const allowed = usePermission(module, action)
  if (!allowed) return <Navigate to="/dashboard" replace />
  return children
}