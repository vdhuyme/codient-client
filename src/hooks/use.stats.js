import { getGA4s } from '@/api/ga4'
import { useQuery } from '@tanstack/react-query'

export const GA4_QUERY_KEYS = {
  ga4s: ['ga4s']
}

export const useGA4s = (params) => {
  return useQuery({
    queryKey: [...GA4_QUERY_KEYS.ga4s, params],
    queryFn: () => getGA4s(params),
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })
}
