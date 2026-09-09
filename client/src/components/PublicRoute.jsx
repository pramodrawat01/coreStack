import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
export default function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-faint text-sm">
        Loading…
      </div>
    )
  }

  if (user) return <Navigate to="/dashboard" replace />

  return children
}