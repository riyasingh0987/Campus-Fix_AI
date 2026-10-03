import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-[#f6f7fa] px-5">
          <section className="w-full max-w-md rounded-xl border border-line bg-white p-7 text-center">
            <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-rose-50 text-rose-700"><AlertTriangle size={20} /></span>
            <h1 className="mt-4 text-xl font-bold text-ink">This page could not load</h1>
            <p className="mt-2 text-sm leading-6 text-muted">Try loading it again. Your account and saved reports have not been changed.</p>
            <button type="button" onClick={() => window.location.reload()} className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-dark"><RotateCcw size={15} />Reload page</button>
          </section>
        </main>
      )
    }
    return this.props.children
  }
}