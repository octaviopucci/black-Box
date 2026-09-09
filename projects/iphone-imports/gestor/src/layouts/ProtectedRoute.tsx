import { Navigate, Outlet } from 'react-router-dom'
import { getSession } from '@/services/database'

export function ProtectedRoute() {
  if (!getSession()) return <Navigate to="/login" replace />
  return <Outlet />
}

export function PublicOnlyRoute() {
  if (getSession()) return <Navigate to="/" replace />
  return <Outlet />
}
