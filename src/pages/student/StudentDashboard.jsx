import { ArrowRight, CheckCircle2, CircleDashed, Clock3, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import ComplaintLink from '../../components/ComplaintLink.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingBlock from '../../components/LoadingBlock.jsx'
import MetricCard from '../../components/MetricCard.jsx'
import WorkspaceLayout from '../../components/WorkspaceLayout.jsx'
import { useAuth } from '../../hooks/useAuth.js'
import { useStudentComplaints } from '../../hooks/useComplaints.js'

export default function StudentDashboard() {
  const { currentUser } = useAuth()
  const { complaints, loading, error } = useStudentComplaints(currentUser.uid)
  const count = (status) => complaints.filter((complaint) => complaint.status === status).length

  return (
    <WorkspaceLayout role="student">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-semibold text-brand">Student portal</p><h1 className="mt-1 text-3xl font-bold text-ink">Your campus, in good hands.</h1><p className="mt-2 text-sm text-muted">See what you have reported and where each issue stands.</p></div>
        <Link to="/student/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"><Plus size={17} />New complaint</Link>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Total reports" value={complaints.length} icon={CircleDashed} />
        <MetricCard label="Pending" value={count('Pending')} icon={Clock3} tone="amber" />
        <MetricCard label="In progress" value={count('In Progress')} icon={ArrowRight} tone="indigo" />
        <MetricCard label="Resolved" value={count('Resolved')} icon={CheckCircle2} tone="emerald" />
      </div>
      <section className="mt-8 rounded-xl border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-5"><div><h2 className="font-bold text-ink">Recent complaints</h2><p className="mt-1 text-xs text-muted">Your latest reports and their current status.</p></div><Link to="/student/complaints" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">View all <ArrowRight size={15} /></Link></div>
        {loading ? <div className="p-4"><LoadingBlock rows={2} /></div> : error ? <p role="alert" className="p-5 text-sm text-rose-700">{error}</p> : complaints.length === 0 ? <EmptyState title="Nothing to track yet" description="When you spot something that needs attention, send your first report." action={<Link to="/student/new" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"><Plus size={16} />New complaint</Link>} /> : <div className="divide-y divide-slate-100">{complaints.slice(0, 4).map((complaint) => <ComplaintLink key={complaint.id} complaint={complaint} to={`/student/complaints/${complaint.id}`} />)}</div>}
      </section>
    </WorkspaceLayout>
  )
}