import { useAuth } from '../../hooks/useAuth.js'

export default function Overview() {
  const { user, company, role } = useAuth()

  return (
    <div>
      <h1 className="text-xl font-semibold">Welcome, {user?.name?.split(' ')[0]}</h1>
      <p className="text-sm text-faint mt-1">
        {company?.name} · signed in as <span className="text-muted">{role?.name}</span>
      </p>

      <div className="mt-8 rounded-xl border border-dashed border-line bg-surface/40 px-6 py-16 text-center">
        <p className="text-sm text-faint">
          Revenue, orders and analytics cards land here once the Reports module is built.
        </p>
      </div>
    </div>
  )
}