import api from '@/utils/axios'

export const getPosts = async ({ page, limit, search, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get('/posts', { params: { page, limit, search, sortBy, orderBy } })
  return response.data
}

export const createPost = async ({ title, excerpt, content, thumbnail, readTime, categoryId, tagIds }) => {
  return await api.post('/posts', { title, excerpt, content, thumbnail, readTime, categoryId, tagIds })
}

export const updatePost = async (id, { title, excerpt, content, thumbnail, readTime, categoryId, tagIds }) => {
  return await api.put(`/posts/${id}`, { title, excerpt, content, thumbnail, readTime, categoryId, tagIds })
}

export const deletePost = async (id) => {
  return await api.delete(`/posts/${id}`)
}
