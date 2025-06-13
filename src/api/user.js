import api from '@/utils/axios'

export const getUsers = async ({ page, limit, search, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get('/users', { params: { page, limit, search, sortBy, orderBy } })
  return response.data
}

export const updateUserStatus = async (id, { status }) => {
  return await api.patch(`/users/${id}`, { status })
}
