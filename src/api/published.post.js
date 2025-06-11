import api from '@/utils/axios'

export const getPublishedPosts = async ({ page, limit, search, sortBy = 'createdAt', orderBy = 'DESC', categoryId }) => {
  const response = await api.get('/posts/published-posts', { params: { page, limit, search, sortBy, orderBy, categoryId } })
  return response.data
}

export const getPublishedPost = async (id) => {
  const response = await api.get(`/posts/published-post/${id}`)
  return response.data
}

export const getPublishedRelatedPost = async (id) => {
  const response = await api.get(`/posts/related-posts/${id}`)
  return response.data
}
