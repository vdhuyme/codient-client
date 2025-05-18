export const baseStatus = [
  { id: 1, value: 'pending', label: 'Pending' },
  { id: 2, value: 'published', label: 'Published' },
  { id: 3, value: 'archived', label: 'Archived' },
  { id: 4, value: 'activated', label: 'Activated' },
  { id: 5, value: 'blocked', label: 'Blocked' },
  { id: 6, value: 'drafted', label: 'Drafted' },
  { id: 7, value: 'ok', label: 'OK' }
]

export const getStatusLabel = (value) => {
  const found = baseStatus.find((status) => status.value === value)
  return found?.label ?? value
}
