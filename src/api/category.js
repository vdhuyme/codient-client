import api from '@/utils/axios'

export const getCategories = async ({ page, limit, search, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get('/categories', { params: { page, limit, search, sortBy, orderBy } })
  return response.data
}

export const createCategory = async (data) => {
  return await api.post('/categories', data)
}

export const updateCategory = async (slug, data) => {
  return await api.put(`/categories/${slug}`, data)
}

export const deleteCategory = async (slug) => {
  return await api.delete(`/categories/${slug}`)
}

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const getCategoryTrees = async () => {
  const response = await api.get('/categories/trees')
  return response.data
}
