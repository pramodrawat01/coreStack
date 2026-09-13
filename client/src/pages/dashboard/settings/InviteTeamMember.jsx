import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaTimes, FaCopy, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { fetchRoles, inviteEmployee } from '../../../store/teamSlice.js'
import { notifySuccess, notifyError } from '../../../lib/toast.js'
import { FaPlus, FaPen, FaTrash, FaArrowLeft, FaCheck } from 'react-icons/fa'


export default function InviteTeamMember() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { roles } = useSelector((s) => s.team)

  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [roleId, setRoleId] = useState('')
  const [queue, setQueue] = useState([]) // [{ email, roleId, roleName }]
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true)
  const [sending, setSending] = useState(false)
  const [results, setResults] = useState([]) // [{ email, status: 'success'|'error', message, inviteLink? }]
  const [singleInviteLink, setSingleInviteLink] = useState(null) // popup, only when exactly one invite sent

  useEffect(() => {
    dispatch(fetchRoles())
  }, [dispatch])

  const invitableRoles = roles.filter((r) => !r.isDefaultOwnerRole)
  const selectedRole = invitableRoles.find((r) => r._id === roleId)

  useEffect(() => {
    if (!roleId && invitableRoles.length) setRoleId(invitableRoles[0]._id)
  }, [invitableRoles, roleId])

  const addToQueue = () => {
    if (!email.trim() || !roleId) return
    if (queue.some((q) => q.email === email.trim())) {
      notifyError('That email is already in the list')
      return
    }
    setQueue((q) => [...q, { email: email.trim(), roleId, roleName: selectedRole?.name }])
    setEmail('')
  }

  const removeFromQueue = (targetEmail) => {
    setQueue((q) => q.filter((item) => item.email !== targetEmail))
  }

  const handleSend = async () => {
    // include whatever is still typed in the top field as one more invite, if valid
    const finalList = [...queue]
    if (email.trim() && roleId && !finalList.some((q) => q.email === email.trim())) {
      finalList.push({ email: email.trim(), roleId, roleName: selectedRole?.name })
    }

    if (finalList.length === 0) {
      notifyError('Add at least one email to invite')
      return
    }

    setSending(true)
    const outcomes = []

    for (const item of finalList) {
      try {
        const res = await dispatch(inviteEmployee({ email: item.email, roleId: item.roleId })).unwrap()
        outcomes.push({ email: item.email, status: 'success', message: `Invitation sent to ${item.email}`, inviteLink: res.inviteLink })
      } catch (err) {
        outcomes.push({ email: item.email, status: 'error', message: err || `Could not invite ${item.email}` })
      }
    }

    setResults(outcomes)
    setSending(false)
    setQueue([])
    setEmail('')

    const successCount = outcomes.filter((o) => o.status === 'success').length
    if (successCount > 0) notifySuccess(`${successCount} invitation${successCount > 1 ? 's' : ''} sent`)
    const failCount = outcomes.length - successCount
    if (failCount > 0) notifyError(`${failCount} invitation${failCount > 1 ? 's' : ''} failed`)

    if (outcomes.length === 1 && outcomes[0].status === 'success') {
      setSingleInviteLink(outcomes[0].inviteLink)
    }
  }

  const handleDone = () => {
    navigate('/dashboard/settings/users')
  }

  return (
    <div className=''>
      {/* <p className="text-sm text-faint">Settings / Users</p> */}

      <button onClick={() => navigate("/dashboard/settings/users")} 
      className="flex items-center gap-2 text-sm text-faint hover:text-white transition-colors mb-5">
        <FaArrowLeft size={11} /> Users /
      </button>
      <h1 className="text-xl font-semibold mt-1">Invite Team Member</h1>
      <p className="text-sm text-faint mt-1">Send an invitation and assign their role before they join.</p>
       
        <div className='mt-8  flex justify-center '>
            <div className="w-[800px] rounded-xl border border-line bg-panel py-10 px-16 flex flex-col gap-8">
                <label className="flex flex-col gap-4">
                <span className="text-xs font-medium text-muted">Email address</span>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="colleague@company.com"
                    className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
                />
                </label>

                <label className="flex flex-col gap-4">
                <span className="text-xs font-medium text-muted">Full name (optional)</span>
                <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jamie Chen"
                    className="rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
                />
                </label>

                <label className="flex flex-col gap-4">
                <span className="text-xs font-medium text-muted">Assign role</span>
                <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="w-full appearance-none rounded-md border border-line bg-surface px-3 py-2.5 text-sm text-white outline-none focus:border-accent2"
                >
                    {invitableRoles.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                </select>
                {selectedRole?.description && <span className="text-xs text-faint">{selectedRole.description}</span>}
                </label>

                <div className="flex flex-col gap-2">
                <span className="text-xs font-medium text-muted">Invite multiple people</span>

                {queue.map((item) => (
                    <div key={item.email} className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2">
                    <span className="text-sm text-white flex-1 truncate">{item.email}</span>
                    <span className="text-[10px] rounded px-2 py-0.5 bg-white/[0.06] text-muted">{item.roleName}</span>
                    <button onClick={() => removeFromQueue(item.email)} className="text-faint hover:text-white">
                        <FaTimes size={11} />
                    </button>
                    </div>
                ))}

                <button onClick={addToQueue} className="text-sm text-accent2 hover:underline text-left">
                    + Add another
                </button>
                </div>

                <div className='h-0.5 bg-white/30'></div>

                <label className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted">Send welcome email with setup instructions</span>
                  <button
                      type="button"
                      onClick={() => setSendWelcomeEmail((v) => !v)}
                      className={`relative flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-0 p-0 transition-colors ${
                          sendWelcomeEmail ? 'bg-accent2' : 'bg-line'
                      }`}
                      >
                      <span
                          className={`absolute left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          sendWelcomeEmail ? 'translate-x-4' : 'translate-x-0'
                          }`}
                      />
                  </button>
                </label>

                <div className="flex justify-end gap-2 mt-2">
                <button onClick={handleDone} className="rounded-md border border-line px-4 py-2.5 text-sm text-white hover:border-white/40 transition-colors">
                    Cancel
                </button>
                <button
                    onClick={handleSend}
                    disabled={sending}
                    className="rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 disabled:opacity-60 transition-colors"
                >
                    {sending ? 'Sending…' : 'Send Invite'}
                </button>
                </div>
            </div>
        </div>

      {results.length > 0 && (
        <div className="max-w-lg mt-6">
          <p className="text-sm font-medium text-white mb-2">Invite states</p>
          <div className="flex flex-col gap-2">
            {results.map((r) => (
              <div
                key={r.email}
                className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-sm ${
                  r.status === 'success' ? 'border-emerald-500/30 bg-emerald-400/5 text-emerald-300' : 'border-red-500/30 bg-red-400/5 text-red-300'
                }`}
              >
                <span className="flex items-center gap-2">
                  {r.status === 'success' ? <FaCheckCircle size={12} /> : <FaExclamationCircle size={12} />}
                  {r.message}
                </span>
                {r.status === 'success' && r.inviteLink && (
                  <button
                    onClick={() => navigator.clipboard.writeText(r.inviteLink)}
                    className="flex items-center gap-1.5 text-xs text-faint hover:text-white shrink-0"
                  >
                    <FaCopy size={10} /> Copy link
                  </button>
                )}
              </div>
            ))}
          </div>
          <button onClick={handleDone} className="mt-4 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors">
            Done
          </button>
        </div>
      )}

      {/* Single-invite popup */}
      {singleInviteLink && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-sm rounded-xl border border-line bg-panel p-6">
            <h3 className="text-base font-semibold text-white mb-1">Invitation sent</h3>
            <p className="text-sm text-faint mb-4">Share this link with them — it expires in 7 days.</p>
            <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 mb-4">
              <span className="text-xs text-faint truncate flex-1">{singleInviteLink}</span>
              <button onClick={() => navigator.clipboard.writeText(singleInviteLink)}>
                <FaCopy size={12} className="text-faint hover:text-white" />
              </button>
            </div>
            <button
              onClick={handleDone}
              className="w-full rounded-md bg-accent2 text-white text-sm py-2.5 hover:bg-accent2/90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}