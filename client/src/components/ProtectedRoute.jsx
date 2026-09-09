import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-faint text-sm">
        Loading…
      </div>
    )
  }

  if (!user) return <Navigate to="/auth" replace />

  return children
}