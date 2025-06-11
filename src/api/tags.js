import api from '@/utils/axios'

export const getTags = async ({ page, limit, search, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get('/tags', { params: { page, limit, search, sortBy, orderBy } })
  return response.data
}

export const createTag = async (data) => {
  return await api.post('/tags', data)
}

export const updateTag = async (id, data) => {
  return await api.put(`/tags/${id}`, data)
}

export const deleteTag = async (id) => {
  return await api.delete(`/tags/${id}`)
}
