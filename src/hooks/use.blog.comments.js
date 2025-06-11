import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createComment, getPublishedCommentsByPost } from '@/api/published.comments'
import { SORT_ORDERS } from '@/utils/constants'
import toast from 'react-hot-toast'

export const useBlogComments = (id) => {
  const queryClient = useQueryClient()

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      return await getPublishedCommentsByPost({ id, sortBy: SORT_ORDERS.ASC })
    }
  })

  const commentMutation = useMutation({
    mutationFn: (data) => createComment({ ...data, id }),
    onSuccess: () => {
      toast.success('Your comment has been posted')
      queryClient.invalidateQueries(['comments', id])
    },
    onError: () => {
      toast.error('Failed to post comment')
    }
  })

  const handleSubmitComment = (data) => {
    const isLoggedIn = localStorage.getItem('access_token')
    if (!isLoggedIn) {
      toast.error('Login to comment')
      return false
    }
    commentMutation.mutate(data)
    return true
  }

  return {
    comments,
    handleSubmitComment,
    isSubmitting: commentMutation.isPending
  }
}
