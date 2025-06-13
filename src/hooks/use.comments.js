import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, updateComment, deleteComment } from '@/api/comment'
import toast from 'react-hot-toast'

export const COMMENT_QUERY_KEYS = {
  comments: ['comments'],
  comment: (id) => ['comment', id]
}

export const useComments = (params) => {
  return useQuery({
    queryKey: [...COMMENT_QUERY_KEYS.comments, params],
    queryFn: () => getComments(params),
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })
}

export const useCommentMutations = () => {
  const queryClient = useQueryClient()

  const updateCommentMutation = useMutation({
    mutationFn: ({ id, data }) => updateComment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(COMMENT_QUERY_KEYS.comments)
      toast.success('Comment updated successfully')
    },
    onError: (error) => {
      console.error('Failed to update comment:', error)
      toast.error('Failed to update comment')
    }
  })

  const deleteCommentMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries(COMMENT_QUERY_KEYS.comments)
      toast.success('Comment deleted successfully')
    },
    onError: (error) => {
      console.error('Failed to delete comment:', error)
      toast.error('Failed to delete comment')
    }
  })

  return {
    updateComment: updateCommentMutation,
    deleteComment: deleteCommentMutation
  }
}
