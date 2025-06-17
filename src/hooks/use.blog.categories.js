import { useQuery } from '@tanstack/react-query'
import { getPublishedCategories } from '@/api/published.categories'
import { PER_PAGE, SORT_FIELDS, SORT_ORDERS } from '@/utils/constants'

export const useBlogCategories = () => {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: async () => {
      return await getPublishedCategories({
        page: 1,
        limit: PER_PAGE,
        search: '',
        sortBy: SORT_FIELDS.CREATED_AT,
        orderBy: SORT_ORDERS.DESC
      })
    },
    staleTime: 1 * 60 * 1000
  })
}
