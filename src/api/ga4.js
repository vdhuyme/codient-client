import { subDays, format, parseISO } from 'date-fns'
import api from '@/utils/axios'

export const getGA4s = async ({ startAt, endAt }) => {
  const now = new Date()
  const isBefore9AM = now.getHours() < 9

  const adjustedEndAt = isBefore9AM ? format(subDays(now, 1), 'yyyy-MM-dd') : endAt

  const response = await api.get('/stats/ga4', {
    params: {
      startAt,
      endAt: adjustedEndAt
    }
  })

  return response.data
}
