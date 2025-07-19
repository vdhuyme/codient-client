import api from '@/utils/axios'

export const getTags = async ({ page, limit = 1000, search, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get('/tags', { params: { page, limit, search, sortBy, orderBy } })
  return response.data
}

export const createTag = async ({ name, status }) => {
  return await api.post('/tags', { name, status })
}

export const updateTag = async (id, { name, status }) => {
  return await api.put(`/tags/${id}`, { name, status })
}

export const deleteTag = async (id) => {
  return await api.delete(`/tags/${id}`)
}
