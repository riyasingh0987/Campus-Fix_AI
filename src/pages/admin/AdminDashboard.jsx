import { useMemo } from 'react'
import { ArrowRight, CheckCircle2, CircleDashed, Clock3, ShieldCheck, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ComplaintLink from '../../components/ComplaintLink.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingBlock from '../../components/LoadingBlock.jsx'
import MetricCard from '../../components/MetricCard.jsx'
import WorkspaceLayout from '../../components/WorkspaceLayout.jsx'
import { useAllComplaints } from '../../hooks/useComplaints.js'
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from '../../utils/complaintData.js'

const STATUS_COLORS = ['#d39422', '#3982c5', '#5455dc', '#25916a', '#d14e68']

export default function AdminDashboard() {
  const { complaints, loading, error } = useAllComplaints()
  const statusCounts = useMemo(
    () => COMPLAINT_STATUSES.map((status) => ({ name: status, value: complaints.filter((item) => item.status === status).length })),
    [complaints],
  )
  const categoryCounts = useMemo(
    () => COMPLAINT_CATEGORIES.map((category) => ({ category, reports: complaints.filter((item) => item.category === category).length })),
    [complaints],
  )
  const count = (status) => complaints.filter((complaint) => complaint.status === status).length

  return (
    <WorkspaceLayout role="admin">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold text-brand">Operations</p><h1 className="mt-1 text-3xl font-bold text-ink">Campus overview</h1><p className="mt-2 text-sm text-muted">Live view of incoming issues and team progress.</p></div><Link to="/admin/complaints" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-ink hover:border-indigo-200 hover:text-brand">Manage complaints <ArrowRight size={16} /></Link></div>
      {error && <p role="alert" className="mt-5 rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {loading ? <div className="mt-7"><LoadingBlock rows={4} /></div> : (
        <>
          <div className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-6">
            <MetricCard label="Total" value={complaints.length} icon={CircleDashed} />
            <MetricCard label="Pending" value={count('Pending')} icon={Clock3} tone="amber" />
            <MetricCard label="Approved" value={count('Approved')} icon={ShieldCheck} tone="sky" />
            <MetricCard label="In progress" value={count('In Progress')} icon={ArrowRight} />
            <MetricCard label="Resolved" value={count('Resolved')} icon={CheckCircle2} tone="emerald" />
            <MetricCard label="Rejected" value={count('Rejected')} icon={XCircle} tone="rose" />
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <section className="rounded-xl border border-line bg-white p-4 sm:p-5"><div><h2 className="font-bold text-ink">Complaints by category</h2><p className="mt-1 text-xs text-muted">Distribution of submitted reports.</p></div><div className="mt-4 h-64" role="img" aria-label="Bar chart of complaints by category"><ResponsiveContainer width="100%" height="100%"><BarChart data={categoryCounts} margin={{ top: 8, right: 8, left: -22, bottom: 8 }}><CartesianGrid vertical={false} stroke="#edf0f5" /><XAxis dataKey="category" tick={{ fontSize: 11, fill: '#68728b' }} interval={0} angle={-20} textAnchor="end" height={54} /><YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#68728b' }} /><Tooltip /><Bar dataKey="reports" name="Reports" fill="#4e50d9" radius={[4, 4, 0, 0]} maxBarSize={38} /></BarChart></ResponsiveContainer></div></section>
            <section className="rounded-xl border border-line bg-white p-4 sm:p-5"><div><h2 className="font-bold text-ink">Status distribution</h2><p className="mt-1 text-xs text-muted">Current lifecycle of all reports.</p></div><div className="mt-2 h-64" role="img" aria-label="Pie chart of complaints by status"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusCounts} dataKey="value" nameKey="name" innerRadius={58} outerRadius={86} paddingAngle={2} stroke="white" strokeWidth={2}>{statusCounts.map((entry, index) => <Cell key={entry.name} fill={STATUS_COLORS[index]} />)}</Pie><Tooltip /><Legend verticalAlign="bottom" height={42} wrapperStyle={{ fontSize: '11px' }} /></PieChart></ResponsiveContainer></div></section>
          </div>
          <section className="mt-5 overflow-hidden rounded-xl border border-line bg-white"><div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-5"><div><h2 className="font-bold text-ink">Recent complaints</h2><p className="mt-1 text-xs text-muted">Latest reports from across campus.</p></div><Link to="/admin/complaints" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark">View all <ArrowRight size={15} /></Link></div>{complaints.length === 0 ? <EmptyState title="No complaints yet" description="New student reports will appear here in real time." /> : <div className="divide-y divide-slate-100">{complaints.slice(0, 4).map((complaint) => <ComplaintLink key={complaint.id} complaint={complaint} to={`/admin/complaints/${complaint.id}`} />)}</div>}</section>
        </>
      )}
    </WorkspaceLayout>
  )
}