import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'))

  const login = (newToken) => {
    localStorage.setItem('access_token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setToken(null)
  }

  const isAuthenticated = !!token

  return <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
