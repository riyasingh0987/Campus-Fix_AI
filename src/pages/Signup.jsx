import { useState } from 'react'
import { ArrowLeft, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { getAuthErrorMessage } from '../utils/authErrors.js'
import { BrandMark, inputClass } from './Login.jsx'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [requestedRole, setRequestedRole] = useState('student')
  const [adminCode, setAdminCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) { setError('Your passwords do not match.'); return }
    if (password.length < 6) { setError('Choose a password with at least 6 characters.'); return }
    setSubmitting(true)
    try {
      const { profile, roleIsAuthorized } = await signup({ name: name.trim(), email: email.trim(), password, requestedRole, adminCode })
      if (requestedRole === 'admin' && !roleIsAuthorized) toast('Invite code not recognized. Your account was created as a student.', { icon: 'i' })
      else toast.success('Your account is ready.')
      navigate(profile.role === 'admin' ? '/admin' : '/student', { replace: true })
    } catch (signupError) {
      setError(getAuthErrorMessage(signupError))
    } finally {
      setSubmitting(false)
    }
  }

  return <main className="page-grid grid min-h-screen place-items-center px-4 py-8 sm:px-6"><div className="enter-up w-full max-w-lg">
    <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"><ArrowLeft size={16} />Back to home</Link>
    <div className="rounded-2xl border border-white bg-white p-6 shadow-[0_24px_80px_-35px_rgba(40,48,96,0.3)] sm:p-9"><BrandMark /><h1 className="mt-6 text-3xl font-bold text-ink">Create your account</h1><p className="mt-2 text-sm leading-6 text-muted">Use your details to join the CampusFix service desk.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div><label htmlFor="name" className="mb-2 block text-sm font-semibold text-ink">Full name</label><input id="name" name="name" autoComplete="name" required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} placeholder="Your name" /></div>
        <div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-ink">Email address</label><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={inputClass} placeholder="you@college.edu" /></div>
        <div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-ink">Password</label><input id="password" name="password" type="password" autoComplete="new-password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} placeholder="At least 6 characters" /></div><div><label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-ink">Confirm password</label><input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} placeholder="Type it again" /></div></div>
        <div><label htmlFor="role" className="mb-2 block text-sm font-semibold text-ink">Account type</label><select id="role" name="role" value={requestedRole} onChange={(event) => setRequestedRole(event.target.value)} className={inputClass}><option value="student">Student</option><option value="admin">Administrator</option></select></div>
        {requestedRole === 'admin' && <div className="enter-up"><label htmlFor="adminCode" className="mb-2 block text-sm font-semibold text-ink">Admin invite code</label><div className="relative"><KeyRound size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input id="adminCode" name="adminCode" type="password" autoComplete="off" value={adminCode} onChange={(event) => setAdminCode(event.target.value)} className={`${inputClass} pl-10`} placeholder="Enter the campus invite code" /></div><p className="mt-2 text-xs leading-5 text-muted">Admin access is granted only when the invite code matches the configured code.</p></div>}
        {error && <p role="alert" className="rounded-lg border border-rose-100 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">{error}</p>}
        <button type="submit" disabled={submitting} className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white transition hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Creating account…' : 'Create account'}</button>
      </form><p className="mt-5 text-center text-sm text-muted">Already have an account? <Link to="/login" className="font-bold text-brand hover:text-brand-dark">Sign in</Link></p>
    </div>
  </div></main>
}