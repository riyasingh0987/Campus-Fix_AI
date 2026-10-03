import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import RoleRoute from './components/RoleRoute.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard.jsx'))
const NewComplaint = lazy(() => import('./pages/student/NewComplaint.jsx'))
const StudentComplaints = lazy(() => import('./pages/student/StudentComplaints.jsx'))
const StudentComplaintDetail = lazy(() => import('./pages/student/StudentComplaintDetail.jsx'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminComplaints = lazy(() => import('./pages/admin/AdminComplaints.jsx'))
const AdminComplaintDetail = lazy(() => import('./pages/admin/AdminComplaintDetail.jsx'))

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <ErrorBoundary>
        <Suspense fallback={<main className="grid min-h-[60vh] place-items-center text-sm font-medium text-muted">Loading workspace…</main>}>
          <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/student" element={<ProtectedRoute><RoleRoute role="student"><StudentDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/student/new" element={<ProtectedRoute><RoleRoute role="student"><NewComplaint /></RoleRoute></ProtectedRoute>} />
        <Route path="/student/complaints" element={<ProtectedRoute><RoleRoute role="student"><StudentComplaints /></RoleRoute></ProtectedRoute>} />
        <Route path="/student/complaints/:id" element={<ProtectedRoute><RoleRoute role="student"><StudentComplaintDetail /></RoleRoute></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><RoleRoute role="admin"><AdminDashboard /></RoleRoute></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute><RoleRoute role="admin"><AdminComplaints /></RoleRoute></ProtectedRoute>} />
        <Route path="/admin/complaints/:id" element={<ProtectedRoute><RoleRoute role="admin"><AdminComplaintDetail /></RoleRoute></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}


export default App
