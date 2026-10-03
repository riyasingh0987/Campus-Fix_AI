import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'

export default function ComplaintLink({ complaint, to }) {
  return (
    <Link to={to} className="group block rounded-lg px-4 py-4 transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand sm:px-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-semibold text-ink group-hover:text-brand">{complaint.title}</h3><StatusBadge status={complaint.status} /></div>
          <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-muted">{complaint.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500"><span>{complaint.category}</span><span className="inline-flex items-center gap-1"><MapPin size={13} />{complaint.location}</span></div>
        </div>
        <ArrowUpRight size={17} className="mt-1 shrink-0 text-slate-400 transition group-hover:text-brand" />
      </div>
    </Link>
  )
}