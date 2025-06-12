import api from '@/utils/axios'

export const getCategories = async ({ page, limit, search, sortBy = 'createdAt', orderBy = 'DESC' }) => {
  const response = await api.get('/categories', { params: { page, limit, search, sortBy, orderBy } })
  return response.data
}

export const createCategory = async ({ name, description, thumbnail, icon, parentId, status }) => {
  return await api.post('/categories', { name, description, thumbnail, icon, parentId, status })
}

export const updateCategory = async (id, { name, description, thumbnail, icon, parentId, status }) => {
  return await api.put(`/categories/${id}`, { name, description, thumbnail, icon, parentId, status })
}

export const deleteCategory = async (id) => {
  return await api.delete(`/categories/${id}`)
}

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const getCategoryTrees = async () => {
  const response = await api.get('/categories/trees')
  return response.data
}
