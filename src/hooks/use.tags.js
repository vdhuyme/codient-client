import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTags, createTag, updateTag, deleteTag } from '@/api/tags'
import toast from 'react-hot-toast'

export const TAG_QUERY_KEYS = {
  tags: ['tags'],
  tag: (id) => ['tag', id]
}

export const useTags = (params) => {
  return useQuery({
    queryKey: [...TAG_QUERY_KEYS.tags, params],
    queryFn: () => getTags(params),
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })
}

export const useTagOptions = (params = {}) => {
  const { data: tagData = [], isLoading } = useTags(params)

  const options =
    tagData?.items
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

export const useTagMutations = () => {
  const queryClient = useQueryClient()

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries(TAG_QUERY_KEYS.tags)
      toast.success('Tag created successfully')
    },
    onError: (error) => {
      console.error('Failed to create tag:', error)
      toast.error('Failed to create tag')
    }
  })

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(TAG_QUERY_KEYS.tags)
      toast.success('Tag updated successfully')
    },
    onError: (error) => {
      console.error('Failed to update tag:', error)
      toast.error('Failed to update tag')
    }
  })

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries(TAG_QUERY_KEYS.tags)
      toast.success('Tag deleted successfully')
    },
    onError: (error) => {
      console.error('Failed to update tag:', error)
      toast.error('Failed to update tag')
    }
  })

  return {
    createTag: createTagMutation,
    updateTag: updateTagMutation,
    deleteTag: deleteTagMutation
  }
}
