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
        search: searchQuery.trim(),
        sortBy: SORT_FIELDS.CREATED_AT,
        orderBy: sortOrder,
        categoryId
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      const posts = lastPage.items || []
      if (!posts || posts.length === 0 || posts.length < limit) {
        return undefined
      }

      if (lastPage.meta?.totalItems !== undefined) {
        const totalLoadedItems = allPages.reduce((total, page) => {
          const pageItems = page.posts || page.items || []
          return total + pageItems.length
        }, 0)
        if (totalLoadedItems >= lastPage.meta.totalItems) {
          return undefined
        }
      }

      return allPages.length + 1
    },
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000
  })
}
