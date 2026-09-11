import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPlus, FaTimes, FaCopy } from 'react-icons/fa'
import {  fetchInvites, fetchRoles, inviteEmployee, revokeInvite } from '../../../store/teamSlice.js'
import { useNavigate } from 'react-router-dom'

export default function Invitations() {
  const dispatch = useDispatch()
  const { roles, invites, error } = useSelector((s) => s.team)
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('')
  const [inviteLink, setInviteLink] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchRoles())
    dispatch(fetchInvites()).then((res)=>{
      console.log(res)
    })
  }, [dispatch])

  const handleInvite = async (e) => {
    e.preventDefault()
    const res = await dispatch(inviteEmployee({ email, roleId }))
    if (res.payload?.inviteLink) {
      setInviteLink(res.payload.inviteLink)
      dispatch(fetchInvites())
      setEmail('')
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setInviteLink('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-3xl font-semibold">Pending invitations</h2>
          <p className="text-sm text-faint mt-1">People who haven't accepted their invite yet.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/settings/invite')}
          // onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-md bg-accent2 px-4 py-2.5 text-sm font-medium text-white hover:bg-accent2/90 transition-colors"
        >
          <FaPlus size={11} /> Invite Member
        </button>
      </div>

      <div className="rounded-lg border border-line bg-surface overflow-hidden">
        {invites.length === 0 ? (
          <p className="text-sm text-faint text-center py-12">No pending invitations.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-faint text-xs border-b border-line">
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Role</th>
                <th className="px-4 py-3 font-normal">Invited</th>
                <th className='px-4 py-3 font-normal'>Link</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv._id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">{inv.email}</td>
                  <td className="px-4 py-3 text-muted">{inv?.roleName}</td>
                  <td className="px-4 py-3 text-faint">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
  <button
    onClick={() => navigator.clipboard.writeText(inv.inviteLink)}
    className="flex items-center gap-1.5 text-xs text-faint hover:text-white"
  >
    <FaCopy size={11} /> Copy
  </button>
</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => dispatch(revokeInvite(inv._id))}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-sm rounded-xl border border-line bg-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Invite a team member</h3>
              <button onClick={closeModal}><FaTimes size={14} className="text-faint hover:text-white" /></button>
            </div>

            {inviteLink ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted">Share this link with them — it expires in 7 days.</p>
                <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2">
                  <span className="text-xs text-faint truncate flex-1">{inviteLink}</span>
                  <button onClick={() => navigator.clipboard.writeText(inviteLink)}>
                    <FaCopy size={12} className="text-faint hover:text-white" />
                  </button>
                </div>
                <button onClick={closeModal} className="rounded-md bg-accent2 text-white text-sm py-2.5">Done</button>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="flex flex-col gap-3">
                {error && <p className="text-xs text-red-400 bg-red-400/10 border border-red-500/30 rounded-md px-3 py-2">{error}</p>}

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted">Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teammate@company.com"
                    className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-white outline-none focus:border-accent2"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted">Role</span>
                  <select
                    required
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-white outline-none focus:border-accent2"
                  >
                    <option value="" disabled>Select a role</option>
                    {roles.filter((r) => !r.isDefaultOwnerRole).map((r) => (
                      <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                  </select>
                </label>

                <button type="submit" className="rounded-md bg-accent2 text-white text-sm py-2.5 mt-1">
                  Send invite
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}