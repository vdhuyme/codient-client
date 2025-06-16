import React, { createContext, useContext, useEffect, useState } from 'react'
import { me } from '@/api/auth'

const AuthorizeContext = createContext({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  hasPermission: () => false,
  getUser: () => null
})

export const AuthorizeProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  const fetchAuthUser = async () => {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      localStorage.removeItem('auth_user')
      setIsLoading(false)
      return
    }

    try {
      const data = await me()
      localStorage.setItem('auth_user', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to fetch user', error)
      localStorage.removeItem('auth_user')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthUser()
  }, [])

  const getUser = () => {
    try {
      const raw = localStorage.getItem('auth_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  const hasPermission = (permission, mode = 'every') => {
    const user = getUser()
    if (!user?.permissions) return false

    const check = (p) => user.permissions.includes(p)

    if (Array.isArray(permission)) {
      return mode === 'every' ? permission.every(check) : permission.some(check)
    }

    return check(permission)
  }

  const user = getUser()
  const isLoggedIn = Boolean(user)

  return <AuthorizeContext.Provider value={{ user, isLoggedIn, isLoading, hasPermission, getUser }}>{children}</AuthorizeContext.Provider>
}

export const useAuthorize = () => {
  const context = useContext(AuthorizeContext)
  if (!context) {
    throw new Error('useAuthorize must be used within an AuthorizeProvider')
  }
  return context
}
