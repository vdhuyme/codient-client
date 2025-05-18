import api from '@/utils/axios'

export const getPosts = async ({ page, limit, query, sort }) => {
  const response = await api.get('/posts', { params: { page, limit, query, sort } })
  return response.data
}

export const createPost = async ({ title, description, content, thumbnail, images }) => {
  const response = await api.post('/posts', { title, description, content, thumbnail, images })
  return response.data
}
