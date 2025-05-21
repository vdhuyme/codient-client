import api from '@/utils/axios'

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const me = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const redirect = async ({ provider }) => {
  const response = await api.get(`/auth/${provider}/redirect`)
  return response.data
}

export const callback = async ({ provider, queryParams }) => {
  const response = await api.get(`/auth/${provider}/callback`, { params: queryParams })
  return response.data
}
