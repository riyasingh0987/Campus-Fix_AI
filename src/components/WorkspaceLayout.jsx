import { ClipboardList, Home, LogOut, Plus, ShieldCheck, Wrench } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function WorkspaceLayout({ role, children }) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const isAdmin = role === 'admin'
  const links = isAdmin
    ? [{ to: '/admin', label: 'Overview', icon: Home, end: true }, { to: '/admin/complaints', label: 'Complaints', icon: ClipboardList }]
    : [{ to: '/student', label: 'Overview', icon: Home, end: true }, { to: '/student/complaints', label: 'My complaints', icon: ClipboardList }]

  async function handleLogout() {
    try {
      await logout()
      navigate('/', { replace: true })
    } catch {
      toast.error('Unable to sign out. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7fa] text-ink">
      <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link to={isAdmin ? '/admin' : '/student'} className="flex items-center gap-2.5" aria-label="CampusFix workspace home">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand text-white"><Wrench size={18} /></span>
            <span className="text-base font-bold ">CampusFix<span className="text-brand">.</span></span>
          </Link>
          <nav className="order-3 flex w-full items-center gap-1 border-t border-slate-100 pt-2 sm:order-none sm:w-auto sm:border-0 sm:pt-0" aria-label="Workspace navigation">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand ${isActive ? 'bg-indigo-50 text-brand' : 'text-slate-600 hover:bg-slate-50 hover:text-ink'}`}>
                <Icon size={16} />{label}
              </NavLink>
            ))}
            {!isAdmin && <Link to="/student/new" className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-md bg-brand px-3 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:ml-2"><Plus size={16} />New</Link>}
          </nav>
          <div className="ml-auto flex items-center gap-3 sm:ml-0">
            <span className="hidden max-w-40 truncate text-sm font-medium text-slate-600 md:inline">{currentUser?.name}</span>
            <span className="hidden h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-600 sm:grid">{isAdmin ? <ShieldCheck size={16} /> : (currentUser?.name?.[0] || 'S').toUpperCase()}</span>
            <button type="button" onClick={handleLogout} aria-label="Sign out" title="Sign out" className="grid h-9 w-9 place-items-center rounded-md text-slate-500 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"><LogOut size={17} /></button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">{children}</main>
    </div>
  )
}