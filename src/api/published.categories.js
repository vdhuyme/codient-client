import api from '@/utils/axios'

export const getPublishedCategories = async ({ page, limit, query, sort }) => {
  const response = await api.get('/published-categories', { params: { page, limit, query, sort } })
  return response.data
}
