import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTags, createTag, updateTag, deleteTag } from '@/api/tags'

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
    }
  })

  const updateTagMutation = useMutation({
    mutationFn: ({ id, data }) => updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(TAG_QUERY_KEYS.tags)
    }
  })

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries(TAG_QUERY_KEYS.tags)
    }
  })

  return {
    createTag: createTagMutation,
    updateTag: updateTagMutation,
    deleteTag: deleteTagMutation
  }
}
