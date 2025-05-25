import api from '@/utils/axios'

export const getTags = async () => {
  const response = await api.get('/tags')
  return response.data
}

export const createTag = async (data) => {
  const response = await api.post('/tags', data)
  return response.data
}

export const updateTag = async (id, data) => {
  const response = await api.put(`/tags/${id}`, data)
  return response.data
}

export const deleteTag = async (id) => {
  const response = await api.delete(`/tags/${id}`)
  return response.data
}
