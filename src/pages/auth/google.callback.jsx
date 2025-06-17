import { callback } from '@/api/auth'
import LoadingOverlay from '@/components/customs/loading.overlay'
import { useAuth } from '@/contexts/auth'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const GoogleCallback = () => {
  const queryParams = new URLSearchParams(window.location.search)
  const code = queryParams.get('code')

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuthToken } = useAuth()

  const handleCallback = async (code) => {
    setIsLoading(true)
    try {
      const { accessToken, refreshToken } = await callback(code)
      setAuthToken({ accessToken, refreshToken })
      navigate('/')
    } catch (error) {
      toast.error(error?.data?.message || 'An error occurred during login')
      console.error('Fail to login:', error)
      navigate('/')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (code) {
      handleCallback(code)
    }
  }, [code])

  if (isLoading) {
    return <LoadingOverlay />
  }

  return null
}

export default GoogleCallback
