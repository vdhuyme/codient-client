import api from '@/utils/axios'

export const getPublishedCommentsByPost = async ({ slug, page, limit, sort }) => {
  const response = await api.get(`/published-comments/by-post/${slug}`, { params: { page, limit, sort } })
  return response.data
}

export const createComment = async ({ content, slug }) => {
  return api.post('/published-comments', { content, slug })
}
