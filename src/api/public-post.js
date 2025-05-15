import api from '@/utils/axios'

export const getPublicPosts = async () => {
  const response = await api.get('/public-posts')
  return response.data
}
