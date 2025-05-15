import { useAuth } from '@/contexts/auth'
import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}

export default PublicRoute
