import api from '@/utils/axios'

export const getGA4s = async ({ startAt, endAt }) => {
  const response = await api.get('/stats/ga4', { params: { startAt, endAt } })
  return response.data
}
