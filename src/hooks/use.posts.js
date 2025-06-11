import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost, deletePost, getPosts, updatePost } from '@/api/post'
import toast from 'react-hot-toast'

// Constants
export const POST_QUERY_KEYS = {
  posts: (params) => ['posts', params],
  postStats: ['post-stats']
}

export const DEFAULT_PAGE_SIZE = 10
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const DEFAULT_SORT = {
  sortBy: 'createdAt',
  orderBy: 'DESC'
}

export const usePosts = (params) => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.posts(params),
    queryFn: async () => {
      return await getPosts(params)
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  })
}

export const usePostMutations = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEYS.postStats] })
      toast.success('Post created successfully')
    },
    onError: (error) => {
      console.error('Failed to create post:', error)
      toast.error('Failed to create post')
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEYS.postStats] })
      toast.success('Post updated successfully')
    },
    onError: (error) => {
      console.error('Failed to update post:', error)
      toast.error('Failed to update post')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: [POST_QUERY_KEYS.postStats] })
      toast.success('Post deleted successfully')
    },
    onError: (error) => {
      console.error('Failed to delete post:', error)
      toast.error('Failed to delete post')
    }
  })

  return {
    createPost: createMutation,
    updatePost: updateMutation,
    deletePost: deleteMutation
  }
}

// Helper function to convert sorting state to API params
export const convertSortingToParams = (sorting) => {
  if (!sorting.length) {
    return DEFAULT_SORT
  }

  const { id, desc } = sorting[0]
  return {
    sortBy: id,
    orderBy: desc ? 'DESC' : 'ASC'
  }
}
