import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPublishedCommentsByPost, createComment } from '@/api/published.comments'
import toast from 'react-hot-toast'

export const PUBLISHED_COMMENT_QUERY_KEYS = {
  comments: (postId) => ['published-comments', postId]
}

export const usePublishedComments = (postId, { page = 1, limit = 3, sortBy = 'createdAt', orderBy = 'DESC' } = {}) => {
  return useQuery({
    queryKey: [...PUBLISHED_COMMENT_QUERY_KEYS.comments(postId), { page, limit, sortBy, orderBy }],
    queryFn: () => getPublishedCommentsByPost({ id: postId, page, limit, sortBy, orderBy }),
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })
}

export const usePublishedCommentMutations = (postId) => {
  const queryClient = useQueryClient()

  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      queryClient.invalidateQueries(PUBLISHED_COMMENT_QUERY_KEYS.comments(postId))
      toast.success('Comment posted successfully')
    },
    onError: (error) => {
      console.error('Failed to post comment:', error)
      toast.error('Failed to post comment')
    }
  })

  return {
    createComment: createCommentMutation
  }
}
