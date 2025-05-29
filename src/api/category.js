import api from '@/utils/axios'

export const getCategories = async () => {
  const response = await api.get('/categories')
  return response.data
}

export const createCategory = async (data) => {
  const response = await api.post('/categories', data)
  return response.data
}

export const updateCategory = async (slug, data) => {
  const response = await api.put(`/categories/${slug}`, data)
  return response.data
}

export const deleteCategory = async (slug) => {
  const response = await api.delete(`/categories/${slug}`)
  return response.data
}

export const getCategory = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

export const getCategoryTrees = async () => {
  const response = await api.get('/categories/trees')
  return response.data
}
