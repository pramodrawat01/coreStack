import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <input
        className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white placeholder:text-faint outline-none focus:border-accent2 transition-colors"
        {...props}
      />
    </label>
  )
}

function PasswordField({ label, name, value, onChange, hint }) {
  const [visible, setVisible] = useState(false)
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="relative">
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required
          placeholder="••••••••"
          className="w-full rounded-md border border-line bg-surface px-3 py-2.5 pr-9 text-sm text-white placeholder:text-faint outline-none focus:border-accent2 transition-colors"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-white transition-colors"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
        </button>
      </div>
      {hint && <span className="text-[11px] text-faint">{hint}</span>}
    </label>
  )
}

export default function AuthForm({ mode, setMode }) {
  return (
   <div className="w-full max-w-md h-[600px] flex flex-col rounded-xl border border-line bg-panel p-7">
        <div className="flex w-full items-center gap-1 rounded-full border border-line bg-surface p-1 mb-6 shrink-0">
            <button
            onClick={() => setMode('login')}
            className={`flex-1 px-4 py-1.5 rounded-full text-sm transition-colors ${
                mode === 'login' ? 'bg-white text-ink' : 'text-muted hover:text-white'
            }`}
            >
            Log in
            </button>
            <button
            onClick={() => setMode('signup')}
            className={`flex-1 px-4 py-1.5 rounded-full text-sm transition-colors ${
                mode === 'signup' ? 'bg-white text-ink' : 'text-muted hover:text-white'
            }`}
            >
            Sign up
            </button>
        </div>

     
      <div className="relative flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
        <AnimatePresence mode="wait">
            {mode === 'login' ? (
            <motion.div
                key="login"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{
                duration: 0.35,
                ease: 'easeInOut',
                }}
            >
                <LoginForm onSwitch={() => setMode('signup')} />
            </motion.div>
            ) : (
            <motion.div
                key="signup"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{
                duration: 0.35,
                ease: 'easeInOut',
                }}
            >
                <SignupForm onSwitch={() => setMode('login')} />
            </motion.div>
            )}
        </AnimatePresence>
        </div>
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Welcome back</h2>
        <p className="text-sm text-faint mt-1">Log in to your Corestack workspace</p>
      </div>

      {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-500/30 rounded-md px-3 py-2">{error}</p>}

      <Field label="Email" type="email" name="email" required placeholder="you@company.com" value={form.email} onChange={handleChange} />
      <PasswordField label="Password" name="password" value={form.password} onChange={handleChange} />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-muted">
          <input type="checkbox" className="accent-accent2" />
          Remember me
        </label>
        <a href="#forgot" className="text-accent2 hover:underline">Forgot password?</a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md mt-2 bg-accent2 text-white text-sm font-medium py-2.5 hover:bg-accent2/90 transition-colors disabled:opacity-60"
      >
        {loading ? 'Logging in…' : 'Log in'}
      </button>

      <div className="flex items-center gap-3 text-faint text-xs">
        <div className="h-px flex-1 bg-line" /> or <div className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-md border border-line bg-surface py-2.5 text-sm text-white hover:border-white/40 transition-colors"
      >
        <FaGoogle size={13} /> Continue with Google
      </button>

      <p className="text-center text-xs text-faint">
        Don&apos;t have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-accent2 hover:underline">
          Sign up
        </button>
      </p>
    </form>
  )
}

function SignupForm({ onSwitch }) {
  const { signup } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', companyName: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      await signup({ name: form.name, email: form.email, password: form.password, companyName: form.companyName })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Create your account</h2>
        <p className="text-sm text-faint mt-1">Start running your business on Corestack</p>
      </div>

      {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-500/30 rounded-md px-3 py-2">{error}</p>}

      <Field label="Full name" type="text" name="name" required placeholder="Jordan Lee" value={form.name} onChange={handleChange} />
      <Field label="Work email" type="email" name="email" required placeholder="you@company.com" value={form.email} onChange={handleChange} />
      <Field label="Company name" type="text" name="companyName" required placeholder="Acme Manufacturing Co." value={form.companyName} onChange={handleChange} />
      <PasswordField label="Password" name="password" value={form.password} onChange={handleChange} hint="At least 8 characters, one number, one symbol" />
      <PasswordField label="Confirm password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-accent2 text-white text-sm font-medium py-2.5 hover:bg-accent2/90 transition-colors disabled:opacity-60"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-[11px] text-faint">By creating an account you agree to the Terms and Privacy Policy</p>
      <p className="text-center text-xs text-faint">
        Already have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-accent2 hover:underline">
          Log in
        </button>
      </p>
    </form>
  )
}