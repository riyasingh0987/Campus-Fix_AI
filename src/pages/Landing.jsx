import { ArrowRight, Check, ClipboardList, ShieldCheck, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'

const steps = [
  { number: '01', title: 'Tell us what needs fixing', done: true },
  { number: '02', title: 'Campus team reviews it', done: false },
  { number: '03', title: 'Track the resolution', done: false },
]

export default function Landing() {
  return (
    <div className="page-grid min-h-screen overflow-hidden">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-3" aria-label="CampusFix home"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-white shadow-lg shadow-brand/20"><Wrench size={19} strokeWidth={2.2} /></span><span className="text-lg font-bold text-ink">CampusFix<span className="text-brand">.</span></span></Link>
        <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main navigation">
          <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand">Log in</Link>
          <Link to="/signup" className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/15 transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Create account <ArrowRight size={16} /></Link>
        </nav>
      </header>
      <main className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-20">
        <section className="enter-up max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase text-brand shadow-sm"><span className="h-2 w-2 rounded-full bg-emerald-500" />Campus service desk</div>
          <h1 className="max-w-xl text-5xl font-bold leading-[1.07] text-ink sm:text-6xl">A better way to get campus issues <span className="text-brand">sorted.</span></h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">Report a problem, follow its progress, and help make your campus work better for everyone.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row"><Link to="/signup" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand px-6 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Get started <ArrowRight size={17} /></Link><Link to="/login" className="inline-flex min-h-12 items-center justify-center rounded-lg border border-line bg-white px-6 text-sm font-semibold text-ink transition hover:border-indigo-200 hover:bg-indigo-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Sign in to your account</Link></div>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-slate-200/80 pt-6 text-sm text-muted"><span className="inline-flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-600" />Private student reports</span><span className="inline-flex items-center gap-2"><ClipboardList size={17} className="text-brand" />Clear status updates</span></div>
        </section>
        <section className="enter-up relative mx-auto w-full max-w-xl lg:justify-self-end" style={{ animationDelay: '100ms' }} aria-label="How CampusFix works">
          <div className="relative overflow-hidden rounded-2xl border border-white bg-white shadow-[0_24px_80px_-35px_rgba(40,48,96,0.32)]">
            <div className="flex items-start justify-between border-b border-line px-6 py-5 sm:px-8"><div><p className="text-xs font-bold uppercase text-muted">The process</p><h2 className="mt-1 text-xl font-bold text-ink">From report to resolved</h2></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-brand"><ClipboardList size={19} /></span></div>
            <ol className="divide-y divide-slate-100 px-6 sm:px-8">{steps.map((step) => <li key={step.number} className="flex items-center gap-4 py-5"><span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${step.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{step.done ? <Check size={17} strokeWidth={2.5} /> : step.number}</span><div className="min-w-0 flex-1"><p className="font-semibold text-ink">{step.title}</p><p className="mt-1 text-sm text-muted">{step.done ? 'A report starts with you.' : 'Stay in the loop at every step.'}</p></div>{step.number === '02' && <span className="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">Review</span>}</li>)}</ol>
            <div className="mx-6 mb-6 rounded-xl bg-[#f5f7ff] px-4 py-4 sm:mx-8 sm:mb-8 sm:px-5"><div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-ink">One place for campus concerns</p><p className="mt-1 text-xs text-muted">Facilities · Wi-Fi · Residence · More</p></div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-brand shadow-sm"><Wrench size={17} /></span></div></div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl justify-between px-5 pb-6 text-xs text-slate-400 sm:px-8 lg:px-12"><span>CampusFix Lite</span><span>Built for a better campus</span></footer>
    </div>
  )
}