import { useState } from 'react'
import { ArrowLeft, CalendarClock, LoaderCircle, MapPin, Tag, UserRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useParams } from 'react-router-dom'
import LoadingBlock from '../../components/LoadingBlock.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import StatusTimeline from '../../components/StatusTimeline.jsx'
import WorkspaceLayout from '../../components/WorkspaceLayout.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useComplaint } from '../../hooks/useComplaints.js'
import { transitionComplaint, updateComplaintPriority } from '../../services/complaints.js'
import { COMPLAINT_PRIORITIES, formatDate, nextStatuses } from '../../utils/complaintData.js'

const fieldClass = 'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10'
const statusLabels = { Approved: 'Approve', Rejected: 'Reject', 'In Progress': 'Start work', Resolved: 'Mark resolved' }

export default function AdminComplaintDetail() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const { complaint, loading, error } = useComplaint(id)
  const [remark, setRemark] = useState('')
  const [confirmStatus, setConfirmStatus] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const [prioritySaving, setPrioritySaving] = useState(false)
  const [priorityError, setPriorityError] = useState('')

  async function completeTransition(nextStatus) {
    if ((nextStatus === 'Rejected' || nextStatus === 'Resolved') && !remark.trim()) {
      toast.error(nextStatus === 'Rejected' ? 'Add a remark before rejecting.' : 'Add a resolution remark before closing this complaint.')
      return
    }
    setTransitioning(true)
    try {
      await transitionComplaint({ complaintId: id, nextStatus, remark, admin: currentUser })
      toast.success(`Complaint updated to ${nextStatus}.`)
      setRemark('')
      setConfirmStatus('')
    } catch (transitionError) {
      toast.error(transitionError.message || 'Could not update this complaint.')
    } finally {
      setTransitioning(false)
    }
  }

  async function handleStatusAction(nextStatus) {
    if (nextStatus === 'Rejected' || nextStatus === 'Resolved') {
      setConfirmStatus(nextStatus)
      return
    }
    await completeTransition(nextStatus)
  }

  async function handlePriorityChange(event) {
    const nextPriority = event.target.value
    setPrioritySaving(true)
    setPriorityError('')
    try {
      await updateComplaintPriority(id, nextPriority)
      toast.success('Priority updated.')
    } catch (priorityUpdateError) {
      setPriorityError(priorityUpdateError.message || 'Could not update priority.')
    } finally {
      setPrioritySaving(false)
    }
  }

  return (
    <WorkspaceLayout role="admin">
      <Link to="/admin/complaints" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand"><ArrowLeft size={16} />All complaints</Link>
      {loading ? <div className="mt-6"><LoadingBlock rows={3} /></div> : error ? <p role="alert" className="mt-6 rounded-xl border border-rose-100 bg-white p-5 text-sm text-rose-700">{error}</p> : !complaint ? <p className="mt-6 rounded-xl border border-line bg-white p-6 text-sm text-muted">This complaint could not be found.</p> : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="overflow-hidden rounded-xl border border-line bg-white">
            {complaint.imageUrl && <img src={complaint.imageUrl} alt={`Attachment for ${complaint.title}`} className="max-h-[420px] w-full bg-slate-50 object-contain" />}
            <div className="p-5 sm:p-7"><div className="flex flex-wrap items-center gap-3"><StatusBadge status={complaint.status} /><span className="text-xs text-muted">Report #{complaint.id.slice(0, 8)}</span></div><h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{complaint.title}</h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"><span className="inline-flex items-center gap-1.5"><Tag size={15} />{complaint.category}</span><span className="inline-flex items-center gap-1.5"><MapPin size={15} />{complaint.location}</span><span className="inline-flex items-center gap-1.5"><CalendarClock size={15} />{formatDate(complaint.createdAt)}</span></div>
              <div className="mt-6 border-t border-line pt-5"><h2 className="text-sm font-bold text-ink">Description</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{complaint.description}</p></div>
              <div className="mt-6 rounded-lg bg-slate-50 p-4"><h2 className="inline-flex items-center gap-2 text-sm font-bold text-ink"><UserRound size={15} />Submitted by</h2><p className="mt-2 text-sm font-semibold text-slate-700">{complaint.studentName}</p><p className="mt-1 text-sm text-muted">{complaint.studentEmail}</p></div>
              <div className="mt-6 border-t border-line pt-5"><h2 className="font-bold text-ink">Status history</h2><div className="mt-4"><StatusTimeline history={complaint.statusHistory || []} /></div></div>
            </div>
          </article>
          <aside className="h-fit rounded-xl border border-line bg-white p-5 sm:p-6">
            <p className="text-xs font-bold uppercase text-brand">Admin actions</p><h2 className="mt-1 text-lg font-bold text-ink">Manage report</h2>
            <label htmlFor="priority" className="mb-2 mt-5 block text-sm font-semibold text-ink">Priority</label><select id="priority" value={complaint.priority || 'Medium'} disabled={prioritySaving} onChange={handlePriorityChange} className={fieldClass}>{COMPLAINT_PRIORITIES.map((option) => <option key={option}>{option}</option>)}</select>{prioritySaving && <p className="mt-1 text-xs text-muted">Saving priority…</p>}{priorityError && <p role="alert" className="mt-2 text-xs text-rose-700">{priorityError}</p>}
            <label htmlFor="remark" className="mb-2 mt-5 block text-sm font-semibold text-ink">Remark</label><textarea id="remark" rows={4} maxLength={1000} value={remark} onChange={(event) => setRemark(event.target.value)} className={`${fieldClass} resize-y leading-6`} placeholder="Add context for the student" /><p className="mt-1 text-xs text-muted">Required when rejecting or resolving.</p>
            <div className="mt-5 space-y-2">{nextStatuses(complaint.status).length === 0 ? <p className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm text-muted">This complaint is closed. No further status changes are available.</p> : nextStatuses(complaint.status).map((nextStatus) => <button key={nextStatus} type="button" disabled={transitioning} onClick={() => handleStatusAction(nextStatus)} className={`flex min-h-10 w-full items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold transition disabled:opacity-60 ${nextStatus === 'Rejected' ? 'border border-rose-200 text-rose-700 hover:bg-rose-50' : 'bg-brand text-white hover:bg-brand-dark'}`}>{transitioning && <LoaderCircle size={15} className="animate-spin" />}{statusLabels[nextStatus]}</button>)}</div>
          </aside>
        </div>
      )}
      {confirmStatus && <div className="fixed inset-0 z-50 grid place-items-center bg-ink/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmStatus('') }}><section role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl sm:p-6"><p className="text-xs font-bold uppercase text-brand">Confirm status change</p><h2 id="confirm-title" className="mt-2 text-xl font-bold text-ink">{confirmStatus === 'Rejected' ? 'Reject this complaint?' : 'Resolve this complaint?'}</h2><p className="mt-2 text-sm leading-6 text-muted">{confirmStatus === 'Rejected' ? 'This is a final status. The student will see your remark.' : 'This is a final status. Include a short resolution note for the student.'}</p><label htmlFor="confirm-remark" className="mb-2 mt-4 block text-sm font-semibold text-ink">{confirmStatus === 'Rejected' ? 'Reason for rejection' : 'Resolution remark'}</label><textarea id="confirm-remark" rows={3} value={remark} onChange={(event) => setRemark(event.target.value)} className={`${fieldClass} resize-y`} autoFocus />{!remark.trim() && <p className="mt-1 text-xs text-rose-700">A remark is required.</p>}<div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setConfirmStatus('')} className="min-h-10 rounded-lg border border-line px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button><button type="button" disabled={transitioning || !remark.trim()} onClick={() => completeTransition(confirmStatus)} className={`min-h-10 rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-50 ${confirmStatus === 'Rejected' ? 'bg-rose-700 hover:bg-rose-800' : 'bg-brand hover:bg-brand-dark'}`}>{transitioning ? 'Saving…' : `Confirm ${confirmStatus.toLowerCase()}`}</button></div></section></div>}
    </WorkspaceLayout>
  )
}