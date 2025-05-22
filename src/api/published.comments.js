import api from '@/utils/axios'

export const getPublishedCommentsByPost = async (slug) => {
  const response = await api.get(`/published-comments/by-post/${slug}`)
  return response.data
}

export const createComment = async ({ content, slug }) => {
  return api.post('/published-comments', { content, slug })
}
