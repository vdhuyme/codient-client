import api from '@/utils/axios'

export const getPublishedPosts = async ({ page, limit, query, sort, categoryId }) => {
  const response = await api.get('/published-posts', { params: { page, limit, query, sort, categoryId } })
  return response.data
}

export const getPublishedPost = async (slug) => {
  const response = await api.get(`/published-posts/${slug}`)
  return response.data
}

export const getPublishedRelatedPost = async (slug) => {
  const response = await api.get(`/published-posts/related/${slug}`)
  return response.data
}
