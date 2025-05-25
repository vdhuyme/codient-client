import api from '@/utils/axios'

export const getPosts = async ({ page, limit, query, sort }) => {
  const response = await api.get('/posts', { params: { page, limit, query, sort } })
  return response.data
}

export const createPost = async ({ title, excerpt, content, thumbnail, readTime, categoryId, tagIds }) => {
  const response = await api.post('/posts', { title, excerpt, content, thumbnail, readTime, categoryId, tagIds })
  return response.data
}

export const updatePost = async (slug, { title, excerpt, content, thumbnail, readTime, categoryId, tagIds }) => {
  const response = await api.put(`/posts/${slug}`, { title, excerpt, content, thumbnail, readTime, categoryId, tagIds })
  return response.data
}

export const deletePost = async (slug) => {
  const response = await api.delete(`/posts/${slug}`)
  return response.data
}
