import api from '@/utils/axios'

export const getPublishedCategories = async ({ page, limit, search, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get('/categories/published-categories', { params: { page, limit, search, sortBy, orderBy } })
  return response.data
}
