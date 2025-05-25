import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'))

  const setAuthToken = (token, key = 'access_token') => {
    localStorage.setItem(key, token)
    setToken(token)
    toast.success('Login success')
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setToken(null)
    toast.success('Logout success')
  }

  const isAuthenticated = !!token
  const authUser = JSON.parse(localStorage.getItem('auth_user'))

  return <AuthContext.Provider value={{ token, setAuthToken, logout, isAuthenticated, authUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
