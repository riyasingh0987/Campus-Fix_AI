import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

export default function RoleRoute({ role, children }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  if (currentUser.role !== role) return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/student'} replace />
  return children
}