import { format } from 'date-fns'

export const dateFormat = (date, hasFormat = 'PPP') => {
  return format(date, hasFormat)
}
