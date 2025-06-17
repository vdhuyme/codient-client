import { getUsers, updateUserStatus } from '@/api/user'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export const USER_QUERY_KEYS = {
  users: ['users'],
  user: (id) => ['user', id]
}

export const useUsers = (params) => {
  return useQuery({
    queryKey: [...USER_QUERY_KEYS.users, params],
    queryFn: () => getUsers(params),
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })
}

export const useUserMutations = () => {
  const queryClient = useQueryClient()

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ id, data }) => updateUserStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(USER_QUERY_KEYS.users)
      toast.success('User updated successfully')
    },
    onError: (error) => {
      console.error('Failed to update user:', error)
      toast.error(error.data.message ?? 'Failed to update user')
    }
  })

  return {
    updateUserStatus: updateUserStatusMutation
  }
}
