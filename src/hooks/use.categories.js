import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryTrees } from '@/api/category'
import toast from 'react-hot-toast'

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })
}

export const useCategoryTrees = () => {
  return useQuery({
    queryKey: ['category-trees'],
    queryFn: getCategoryTrees,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30 // 30 minutes
  })
}

export const useCategoryMutations = () => {
  const queryClient = useQueryClient()

  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-trees'] })
      toast.success('Category created successfully')
    },
    onError: (error) => {
      console.error('Failed to update category:', error)
      toast.error('Failed to update category')
    }
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-trees'] })
      toast.success('Category updated successfully')
    },
    onError: (error) => {
      console.error('Failed to update category:', error)
      toast.error('Failed to update category')
    }
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-trees'] })
      toast.success('Category deleted successfully')
    },
    onError: (error) => {
      console.error('Failed to update category:', error)
      toast.error('Failed to update category')
    }
  })

  return {
    createCategory: createCategoryMutation,
    updateCategory: updateCategoryMutation,
    deleteCategory: deleteCategoryMutation
  }
}

export const useCategoryOptions = () => {
  const { data: categoryData = [], isLoading } = useCategories()

  const options =
    categoryData?.items
      ?.flatMap((item) => item || [])
      .map((item) => ({
        value: item.id.toString(),
        label: item.name
      })) || []

  return {
    options,
    isLoading
  }
}
