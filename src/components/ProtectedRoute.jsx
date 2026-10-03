import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return <main className="grid min-h-screen place-items-center" aria-label="Loading account"><div className="h-9 w-9 animate-spin rounded-full border-2 border-brand/20 border-t-brand" /></main>
  }
  if (!currentUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}