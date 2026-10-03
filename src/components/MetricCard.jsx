export default function MetricCard({ label, value, icon: Icon, tone = 'indigo' }) {
  const tones = {
    indigo: 'bg-indigo-50 text-indigo-700',
    amber: 'bg-amber-50 text-amber-700',
    sky: 'bg-sky-50 text-sky-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
  }

  return (
    <section className="rounded-xl border border-line bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div><p className="text-sm font-medium text-muted">{label}</p><p className="mt-2 text-3xl font-bold tabular-nums text-ink">{value}</p></div>
        <span className={`grid h-10 w-10 place-items-center rounded-lg ${tones[tone] || tones.indigo}`}><Icon size={19} /></span>
      </div>
    </section>
  )
}