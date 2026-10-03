import { useState } from 'react'
import { ArrowLeft, Wrench } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getAuthErrorMessage } from '../utils/authErrors.js'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const profile = await login(email.trim(), password)
      navigate(profile.role === 'admin' ? '/admin' : '/student', { replace: true })
    } catch (loginError) {
      setError(getAuthErrorMessage(loginError))
      toast.error('We could not sign you in.')
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="page-grid grid min-h-screen place-items-center px-4 py-10 sm:px-6"><div className="enter-up w-full max-w-md">
    <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"><ArrowLeft size={16} />Back to home</Link>
    <div className="rounded-2xl border border-white bg-white p-6 shadow-[0_24px_80px_-35px_rgba(40,48,96,0.3)] sm:p-9"><BrandMark /><h1 className="mt-7 text-3xl font-bold text-ink">Welcome back</h1><p className="mt-2 text-sm leading-6 text-muted">Sign in with your campus account to continue.</p>
      <form className="mt-7 space-y-5" onSubmit={handleSubmit}><div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">Email address</label><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder="you@college.edu" /></div><div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} placeholder="Enter your password" /></div>{error && <p role="alert" className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>}<button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Signing in…' : 'Sign in'}</button></form>
      <p className="mt-6 text-center text-sm text-muted">New to CampusFix? <Link to="/signup" className="font-bold text-brand hover:text-brand-dark">Create an account</Link></p></div>
  </div></main>
}

export const inputClass = 'min-h-11 w-full rounded-lg border border-line bg-white px-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-brand focus:ring-4 focus:ring-brand/10'
export function BrandMark() { return <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white"><Wrench size={20} /></span> }