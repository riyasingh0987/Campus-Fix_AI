import { Check } from 'lucide-react'
import { formatDate } from '../utils/complaintData.js'

export default function StatusTimeline({ history = [] }) {
  if (history.length === 0) return <p className="text-sm text-muted">No status updates yet.</p>

  return (
    <ol className="space-y-0" aria-label="Complaint status history">
      {history.map((entry, index) => (
        <li key={`${entry.status}-${index}`} className="relative flex gap-4 pb-7 last:pb-0">
          {index < history.length - 1 && <span className="absolute bottom-0 left-[13px] top-7 w-px bg-slate-200" aria-hidden="true" />}
          <span className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full ${index === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-brand'}`}><Check size={14} strokeWidth={2.5} /></span>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><p className="font-semibold text-ink">{entry.status}</p><time className="text-xs text-slate-500">{formatDate(entry.timestamp)}</time></div>
            {entry.remark && <p className="mt-1 text-sm leading-6 text-muted">{entry.remark}</p>}
            {entry.updatedByName && <p className="mt-1 text-xs text-slate-400">Updated by {entry.updatedByName}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}