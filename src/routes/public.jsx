import { Navigate, Outlet } from 'react-router-dom'

const PublicRoute = () => {
  const isLoggedIn = localStorage.getItem('access_token')
  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />
}

export default PublicRoute
