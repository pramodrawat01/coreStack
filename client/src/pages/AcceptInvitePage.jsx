import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '../hooks/useQuery.js'
import { useAuth } from '../hooks/useAuth.js'

export default function AcceptInvitePage() {
  const query = useQuery()
  const token = query.get('token')
  const navigate = useNavigate()
  const { acceptInvite } = useAuth()

  const [form, setForm] = useState({ name: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center text-white text-sm">
        This invite link is missing a token.
      </div>
    )
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await acceptInvite({ token, name: form.name, password: form.password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-line bg-panel p-7 flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-semibold text-white">Join your team on Corestack</h1>
          <p className="text-sm text-faint mt-1">Set your name and password to finish joining.</p>
        </div>

        {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-500/30 rounded-md px-3 py-2">{error}</p>}

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Full name</span>
          <input
            name="name" required value={form.name} onChange={handleChange}
            className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Password</span>
          <input
            type="password" name="password" required minLength={8} value={form.password} onChange={handleChange}
            className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-muted">Confirm password</span>
          <input
            type="password" name="confirmPassword" required value={form.confirmPassword} onChange={handleChange}
            className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
          />
        </label>

        <button
          type="submit" disabled={loading}
          className="rounded-md bg-accent2 text-white text-sm font-medium py-2.5 hover:bg-accent2/90 transition-colors disabled:opacity-60"
        >
          {loading ? 'Joining…' : 'Join workspace'}
        </button>
      </form>
    </div>
  )
}