import api from '@/utils/axios'
import { format } from 'date-fns'

export const getLogs = async ({ type = 'error', date = format(new Date(), 'yyyy-MM-dd') }) => {
  const response = await api.get(`/logs?type=${type}&date=${date}`)
  return response.data
}
