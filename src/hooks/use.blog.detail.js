import { useQuery } from '@tanstack/react-query'
import { getPublishedPost, getPublishedRelatedPost } from '@/api/published.post'

export const useBlogDetail = (id) => {
  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      return await getPublishedPost(id)
    }
  })

  const { data: relatedPosts } = useQuery({
    queryKey: ['related-posts', id],
    queryFn: async () => {
      return await getPublishedRelatedPost(id)
    }
  })

  return {
    post,
    relatedPosts,
    isLoading
  }
}
