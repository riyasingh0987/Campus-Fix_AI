import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/EmptyState.jsx'
import LoadingBlock from '../../components/LoadingBlock.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import WorkspaceLayout from '../../components/WorkspaceLayout.jsx'
import { useAllComplaints } from '../../hooks/useComplaints.js'
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES, COMPLAINT_STATUSES, formatDate } from '../../utils/complaintData.js'

const PAGE_SIZE = 10
const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 }
const controlClass = 'min-h-10 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/10'

function toDate(value) {
  return value?.toDate?.() || (value ? new Date(value) : null)
}

export default function AdminComplaints() {
  const { complaints, loading, error } = useAllComplaints()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [category, setCategory] = useState('All categories')
  const [priority, setPriority] = useState('All priorities')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase()
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null
    const end = endDate ? new Date(`${endDate}T23:59:59.999`) : null
    const result = complaints.filter((complaint) => {
      const complaintDate = toDate(complaint.createdAt)
      return (!searchText || `${complaint.title} ${complaint.studentName}`.toLowerCase().includes(searchText)) &&
        (status === 'All statuses' || complaint.status === status) &&
        (category === 'All categories' || complaint.category === category) &&
        (priority === 'All priorities' || complaint.priority === priority) &&
        (!start || (complaintDate && complaintDate >= start)) &&
        (!end || (complaintDate && complaintDate <= end))
    })
    if (sortBy === 'priority') {
      result.sort((first, second) => (PRIORITY_ORDER[first.priority] ?? 99) - (PRIORITY_ORDER[second.priority] ?? 99))
    }
    return result
  }, [complaints, search, status, category, priority, startDate, endDate, sortBy])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visibleComplaints = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const setFilter = (setter) => (event) => { setter(event.target.value); setPage(1) }

  return (
    <WorkspaceLayout role="admin">
      <div><p className="text-sm font-semibold text-brand">Operations</p><h1 className="mt-1 text-3xl font-bold text-ink">All complaints</h1><p className="mt-2 text-sm text-muted">Search and narrow reports to the work that needs attention.</p></div>
      <section className="mt-6 rounded-xl border border-line bg-white">
        <div className="space-y-3 border-b border-line p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><label className="relative block w-full sm:max-w-sm"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="search" value={search} onChange={setFilter(setSearch)} aria-label="Search title or student" placeholder="Search title or student" className={`${controlClass} w-full pl-9`} /></label><label className="flex items-center gap-2 text-sm text-muted">Sort<select value={sortBy} onChange={setFilter(setSortBy)} className={controlClass}><option value="newest">Newest first</option><option value="priority">Priority</option></select></label></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <select aria-label="Filter by status" value={status} onChange={setFilter(setStatus)} className={controlClass}><option>All statuses</option>{COMPLAINT_STATUSES.map((item) => <option key={item}>{item}</option>)}</select>
            <select aria-label="Filter by category" value={category} onChange={setFilter(setCategory)} className={controlClass}><option>All categories</option>{COMPLAINT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select>
            <select aria-label="Filter by priority" value={priority} onChange={setFilter(setPriority)} className={controlClass}><option>All priorities</option>{COMPLAINT_PRIORITIES.map((item) => <option key={item}>{item}</option>)}</select>
            <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted">From<input aria-label="Start date" type="date" value={startDate} onChange={setFilter(setStartDate)} className={controlClass} /></label>
            <label className="flex flex-col gap-1 text-[11px] font-semibold text-muted">To<input aria-label="End date" type="date" value={endDate} onChange={setFilter(setEndDate)} className={controlClass} /></label>
            <button type="button" onClick={() => { setSearch(''); setStatus('All statuses'); setCategory('All categories'); setPriority('All priorities'); setStartDate(''); setEndDate(''); setSortBy('newest'); setPage(1); }} className="min-h-10 self-end rounded-md border border-line px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">Clear filters</button>
          </div>
        </div>
        {loading ? <div className="p-4"><LoadingBlock rows={5} /></div> : error ? <p role="alert" className="p-5 text-sm text-rose-700">{error}</p> : filtered.length === 0 ? <EmptyState title="No matching complaints" description="Adjust your filters or clear them to see more reports." /> : (
          <>
            <div className="overflow-x-auto"><table className="w-full min-w-[850px] border-collapse text-left"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3 font-semibold">Complaint</th><th className="px-4 py-3 font-semibold">Student</th><th className="px-4 py-3 font-semibold">Category</th><th className="px-4 py-3 font-semibold">Priority</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 font-semibold">Reported</th></tr></thead><tbody className="divide-y divide-slate-100">{visibleComplaints.map((complaint) => <tr key={complaint.id} className="transition hover:bg-slate-50/80"><td className="max-w-64 px-4 py-3"><Link to={`/admin/complaints/${complaint.id}`} className="block truncate font-semibold text-ink hover:text-brand">{complaint.title}</Link><span className="mt-1 block text-xs text-slate-400">#{complaint.id.slice(0, 8)}</span></td><td className="px-4 py-3"><span className="block font-medium text-slate-700">{complaint.studentName}</span><span className="text-xs text-slate-400">{complaint.studentEmail}</span></td><td className="px-4 py-3 text-sm text-slate-600">{complaint.category}</td><td className="px-4 py-3 text-sm font-semibold text-slate-700">{complaint.priority}</td><td className="px-4 py-3"><StatusBadge status={complaint.status} /></td><td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">{formatDate(complaint.createdAt)}</td></tr>)}</tbody></table></div>
            <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs text-muted">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</p><div className="flex items-center gap-2"><button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => setPage((current) => current - 1)} className="grid h-9 w-9 place-items-center rounded-md border border-line text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={17} /></button><span className="min-w-20 text-center text-sm font-medium text-slate-600">Page {page} of {pageCount}</span><button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => setPage((current) => current + 1)} className="grid h-9 w-9 place-items-center rounded-md border border-line text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight size={17} /></button></div></div>
          </>
        )}
      </section>
    </WorkspaceLayout>
  )
}