import api from '@/utils/axios'

export const getPublishedCategories = async () => {
  const response = await api.get('/published-categories')
  return response.data
}
