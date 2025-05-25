import { Navigate, Outlet } from 'react-router-dom'

const PrivateRoute = () => {
  const isLoggedIn = localStorage.getItem('access_token')
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
