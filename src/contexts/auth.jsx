import { createContext, useContext, useState } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('access_token'))
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('refresh_token'))

  const setAuthToken = ({ accessToken, refreshToken }) => {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken)
      setAccessToken(accessToken)
    }
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
      setRefreshToken(refreshToken)
    }
    toast.success('Login success')
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_user')
    setAccessToken(null)
    setRefreshToken(null)
    toast.success('Logout success')
  }

  const isAuthenticated = !!accessToken

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        isAuthenticated,
        setAuthToken,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
