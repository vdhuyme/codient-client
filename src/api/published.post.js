import api from '@/utils/axios'

export const getPublishedPosts = async ({ page, limit, query, sort, categoryId }) => {
  const response = await api.get('/posts/published-posts', { params: { page, limit, query, sort, categoryId } })
  return response.data
}

export const getPublishedPost = async (slug) => {
  const response = await api.get(`/posts/published-post/${slug}`)
  return response.data
}

export const getPublishedRelatedPost = async (slug) => {
  const response = await api.get(`/posts/related-posts/${slug}`)
  return response.data
}
