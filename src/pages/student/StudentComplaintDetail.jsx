import { ArrowLeft, CalendarClock, MapPin, Tag } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import LoadingBlock from '../../components/LoadingBlock.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import StatusTimeline from '../../components/StatusTimeline.jsx'
import WorkspaceLayout from '../../components/WorkspaceLayout.jsx'
import { useComplaint } from '../../hooks/useComplaints.js'
import { formatDate } from '../../utils/complaintData.js'

export default function StudentComplaintDetail() {
  const { id } = useParams()
  const { complaint, loading, error } = useComplaint(id)

  return (
    <WorkspaceLayout role="student">
      <Link to="/student/complaints" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand"><ArrowLeft size={16} />My complaints</Link>
      {loading ? <div className="mt-6"><LoadingBlock rows={3} /></div> : error ? <p role="alert" className="mt-6 rounded-xl border border-rose-100 bg-white p-5 text-sm text-rose-700">{error}</p> : !complaint ? <p className="mt-6 rounded-xl border border-line bg-white p-6 text-sm text-muted">This complaint could not be found.</p> : (
        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="overflow-hidden rounded-xl border border-line bg-white">
            {complaint.imageUrl && <img src={complaint.imageUrl} alt={`Attachment for ${complaint.title}`} className="max-h-[420px] w-full bg-slate-50 object-contain" />}
            <div className="p-5 sm:p-7"><div className="flex flex-wrap items-center gap-3"><StatusBadge status={complaint.status} /><span className="text-xs text-muted">Report #{complaint.id.slice(0, 8)}</span></div><h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">{complaint.title}</h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted"><span className="inline-flex items-center gap-1.5"><Tag size={15} />{complaint.category}</span><span className="inline-flex items-center gap-1.5"><MapPin size={15} />{complaint.location}</span><span className="inline-flex items-center gap-1.5"><CalendarClock size={15} />Submitted {formatDate(complaint.createdAt)}</span></div>
              <div className="mt-6 border-t border-line pt-5"><h2 className="text-sm font-bold text-ink">Description</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-600">{complaint.description}</p></div>
              {complaint.adminRemark && <div className="mt-6 rounded-lg border-l-2 border-brand bg-indigo-50/60 px-4 py-3"><p className="text-xs font-bold uppercase text-brand">Latest team update</p><p className="mt-1.5 text-sm leading-6 text-slate-700">{complaint.adminRemark}</p></div>}
            </div>
          </article>
          <aside className="h-fit rounded-xl border border-line bg-white p-5 sm:p-6"><h2 className="font-bold text-ink">Status history</h2><p className="mt-1 text-xs text-muted">Updates appear here as the team reviews your report.</p><div className="mt-5"><StatusTimeline history={complaint.statusHistory || []} /></div></aside>
        </div>
      )}
    </WorkspaceLayout>
  )
}