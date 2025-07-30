import { useInfiniteQuery } from '@tanstack/react-query'
import { getPublishedPosts } from '@/api/published.post'
import { PER_PAGE, SORT_FIELDS, SORT_ORDERS } from '@/utils/constants'

export const useBlogPosts = ({ searchQuery, sortOrder = SORT_ORDERS.DESC, categoryId, limit = PER_PAGE }) => {
  return useInfiniteQuery({
    queryKey: ['public-posts', searchQuery, SORT_FIELDS.CREATED_AT, sortOrder, categoryId],
    queryFn: async ({ pageParam = 1 }) => {
      return await getPublishedPosts({
        page: pageParam,
        limit,
        search: searchQuery?.trim(),
        sortBy: SORT_FIELDS.CREATED_AT,
        orderBy: sortOrder,
        categoryId
      })
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.nextPage) {
        return lastPage.meta.currentPage + 1
      }

      return undefined
    },
    staleTime: 60 * 1000,
    gcTime: 60 * 1000
  })
}
