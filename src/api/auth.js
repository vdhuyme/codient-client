import api from '@/utils/axios'

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const me = async () => {
  const response = await api.get('/auth/me')
  return response.data
}
