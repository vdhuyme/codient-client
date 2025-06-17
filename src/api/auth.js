import api from '@/utils/axios'

export const login = async ({ email, password }) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const register = async ({ email, password, name }) => {
  const response = await api.post('/auth/register', { email, password, name })
  return response.data
}

export const me = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const redirect = async () => {
  const response = await api.get('/auth/redirect/google')
  return response.data
}

export const callback = async (code) => {
  const response = await api.get('/auth/callback/google', { params: { code } })
  return response.data
}

export const changePassword = async ({ oldPassword, newPassword }) => {
  return await api.patch('/auth/change-password', { oldPassword, newPassword })
}

export const updateProfile = async ({ name, dob, avatar, phoneNumber }) => {
  return await api.put('/auth/profile', { name, dob, avatar, phoneNumber })
}
