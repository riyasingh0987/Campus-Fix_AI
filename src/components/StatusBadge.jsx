const STATUS_STYLES = {
  Pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  Approved: 'bg-sky-50 text-sky-800 ring-sky-200',
  'In Progress': 'bg-indigo-50 text-indigo-800 ring-indigo-200',
  Resolved: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  Rejected: 'bg-rose-50 text-rose-800 ring-rose-200',
}

export default function StatusBadge({ status }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>{status}</span>
}