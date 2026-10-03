export default function LoadingBlock({ rows = 3 }) {
  return (
    <div className="space-y-3" aria-label="Loading" role="status">
      <span className="sr-only">Loading</span>
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="animate-pulse rounded-xl border border-slate-100 bg-white p-5">
          <div className="h-4 w-1/3 rounded bg-slate-100" />
          <div className="mt-3 h-3 w-2/3 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  )
}