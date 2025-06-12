import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryTrees } from '@/api/category'

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
    }
  })

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-trees'] })
    }
  })

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-trees'] })
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
