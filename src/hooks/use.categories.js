import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/api/category'
import { POST_QUERY_KEYS } from './use.posts'

export const useCategories = () => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.categories,
    queryFn: getCategories,
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })
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
