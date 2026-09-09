import { useState } from 'react'
import { FaSearch, FaBell, FaChevronDown } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth.js'

export default function Topbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?'

  return (
    <header className="flex items-center justify-between border-b border-line bg-ink px-6 py-3.5">
      <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm text-faint w-72">
        <FaSearch size={12} />
        <span>Search orders, SKUs…</span>
      </div>

      <div className="flex items-center gap-4">
        <FaBell size={14} className="text-faint" />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 text-sm text-white"
          >
            <span className="h-7 w-7 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-xs font-semibold">
              {initial}
            </span>
            <span>{user?.name}</span>
            <FaChevronDown size={10} className="text-faint" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 rounded-md border border-line bg-panel py-1 shadow-lg">
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-sm text-muted hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}