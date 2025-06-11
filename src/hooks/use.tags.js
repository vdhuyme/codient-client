import { useQuery } from '@tanstack/react-query'
import { getTags } from '@/api/tags'
import { POST_QUERY_KEYS } from './use.posts'

export const useTags = () => {
  return useQuery({
    queryKey: POST_QUERY_KEYS.tags,
    queryFn: getTags,
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })
}

export const useTagOptions = () => {
  const { data: tagData = [], isLoading } = useTags()

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
