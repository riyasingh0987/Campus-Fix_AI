import { ClipboardList } from 'lucide-react'

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex min-h-60 flex-col items-center justify-center px-5 py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-500"><ClipboardList size={21} /></span>
      <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
      <p className="mt-1 max-w-sm text-sm leading-6 text-muted">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}