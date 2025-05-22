import api from '@/utils/axios'

export const getPublishedPosts = async () => {
  const response = await api.get('/published-posts')
  return response.data
}
