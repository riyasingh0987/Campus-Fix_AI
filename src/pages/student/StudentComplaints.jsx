import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import ComplaintLink from '../../components/ComplaintLink.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingBlock from '../../components/LoadingBlock.jsx'
import WorkspaceLayout from '../../components/WorkspaceLayout.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useStudentComplaints } from '../../hooks/useComplaints.js'
import { COMPLAINT_STATUSES } from '../../utils/complaintData.js'

export default function StudentComplaints() {
  const { currentUser } = useAuth()
  const { complaints, loading, error } = useStudentComplaints(currentUser.uid)
  const [statusFilter, setStatusFilter] = useState('All statuses')
  const filteredComplaints = useMemo(
    () => statusFilter === 'All statuses' ? complaints : complaints.filter((complaint) => complaint.status === statusFilter),
    [complaints, statusFilter],
  )

  return (
    <WorkspaceLayout role="student">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand">Student portal</p><h1 className="mt-1 text-3xl font-bold text-ink">My complaints</h1><p className="mt-2 text-sm text-muted">Every report you have submitted, with its latest status.</p></div><Link to="/student/new" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"><Plus size={16} />New complaint</Link></div>
      <section className="mt-6 overflow-hidden rounded-xl border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"><div><h2 className="font-bold text-ink">All reports <span className="ml-1 text-sm font-medium text-slate-400">{filteredComplaints.length}</span></h2></div><label className="flex items-center gap-2 text-sm text-muted"><span>Status</span><select aria-label="Filter complaints by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-h-9 rounded-md border border-line bg-white px-2.5 text-sm font-medium text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"><option>All statuses</option>{COMPLAINT_STATUSES.map((status) => <option key={status}>{status}</option>)}</select></label></div>
        {loading ? <div className="p-4"><LoadingBlock rows={4} /></div> : error ? <p role="alert" className="p-5 text-sm text-rose-700">{error}</p> : filteredComplaints.length === 0 ? <EmptyState title={complaints.length ? 'No reports match this status' : 'No complaints yet'} description={complaints.length ? 'Try another status filter.' : 'Create a report when you find an issue on campus.'} action={!complaints.length && <Link to="/student/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white"><Plus size={16} />New complaint</Link>} /> : <div className="divide-y divide-slate-100">{filteredComplaints.map((complaint) => <ComplaintLink key={complaint.id} complaint={complaint} to={`/student/complaints/${complaint.id}`} />)}</div>}
      </section>
    </WorkspaceLayout>
  )
}