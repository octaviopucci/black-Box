import { Navigate, Outlet } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Loading } from '@/components/ui/Feedback'

export function ProtectedRoute() {
  const { user, ready } = useApp()
  if (!ready) return <Loading />
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}

export function PublicOnlyRoute() {
  const { user, ready } = useApp()
  if (!ready) return <Loading />
  if (user) return <Navigate to="/" replace />
  return <Outlet />
}
