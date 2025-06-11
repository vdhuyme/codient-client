import api from '@/utils/axios'

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const register = async ({ email, password, name }) => {
  return await api.post('/auth/register', { email, password, name })
}

export const forgotPassword = async ({ email }) => {
  return api.post('/auth/forgot-password', { email })
}

export const me = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const redirect = async () => {
  const response = await api.get('/auth/redirect/google')
  return response.data
}

export const callback = async ({ provider, queryParams }) => {
  const response = await api.get(`/auth/${provider}/callback`, { params: queryParams })
  return response.data
}

export const changePassword = async ({ oldPassword, newPassword }) => {
  return await api.patch('/auth/change-password', { oldPassword, newPassword })
}
