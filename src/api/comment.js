import api from '@/utils/axios'

export const getComments = async ({ page, limit, search, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get('/comments', { params: { page, limit, search, sortBy, orderBy } })
  return response.data
}

export const updateComment = async (id, { content, status }) => {
  return await api.put(`/comments/${id}`, { content, status })
}

export const deleteComment = async (id) => {
  return await api.delete(`/comments/${id}`)
}
