import api from '@/utils/axios'

export const getPublicPosts = async () => {
  const response = await api.get('/posts')
  return response.data
}

export const createPost = async ({ title, description, content, thumbnail, images }) => {
  const response = await api.post('/posts', { title, description, content, thumbnail, images })
  return response.data
}
