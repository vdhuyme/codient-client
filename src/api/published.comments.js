import api from '@/utils/axios'

export const getPublishedCommentsByPost = async ({ id, page, limit, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get(`/comments/by-post/${id}`, { params: { page, limit, sortBy, orderBy } })
  return response.data
}

export const createComment = async ({ content, id }) => {
  return api.post('/comments', { content, id })
}
