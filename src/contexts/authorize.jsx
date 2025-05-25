import React, { createContext, useContext, useEffect, useState } from 'react'
import { me } from '@/api/auth'

const AuthorizeContext = createContext()

export const AuthorizeProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchAuthUser = async () => {
    try {
      const data = await me()
      setUser(data)
    } catch (error) {
      console.error('Failed to fetch user', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthUser()
  }, [])

  const hasPermission = (permission, mode = 'every') => {
    if (!user?.permissions) {
      return false
    }
    if (Array.isArray(permission)) {
      return mode === 'every' ? permission.every((p) => user.permissions.includes(p)) : permission.some((p) => user.permissions.includes(p))
    }
    return user.permissions.includes(permission)
  }

  return <AuthorizeContext.Provider value={{ user, hasPermission, isLoading }}>{children}</AuthorizeContext.Provider>
}

export const useAuthorize = () => {
  const context = useContext(AuthorizeContext)
  if (!context) {
    throw new Error('useAuthorize must be used within an AuthorizeProvider')
  }
  return context
}
