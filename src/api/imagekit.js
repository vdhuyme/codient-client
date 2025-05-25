import api from '@/utils/axios'

export const authenticator = async () => {
  const response = await api.get('/imagekit/auth')
  return response.data
}
