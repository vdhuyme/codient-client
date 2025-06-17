import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { User as UserIcon } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import Badge from '@/components/ui/badge'
import Tooltip from '@/components/ui/tooltip'
import DataTable from '@/components/ui/data-table'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { useUsers, useUserMutations } from '@/hooks/use.users'
import { convertSortingToParams } from '@/utils/convert-sorting-params'
import PermissionGuard from '@/hocs/permission-guard'

const DEFAULT_PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sorting, setSorting] = useState([])
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const usersParams = useMemo(
    () => ({
      search: searchQuery,
      page: currentPage,
      limit: pageSize,
      ...convertSortingToParams(sorting)
    }),
    [currentPage, searchQuery, pageSize, sorting]
  )

  const { data: usersData, isLoading: usersLoading, error: usersError, isFetching: usersFetching } = useUsers(usersParams)
  const mutations = useUserMutations()

  const handleStatusToggle = useCallback((user) => {
    setSelectedUser(user)
    setStatusDialogOpen(true)
  }, [])

  const handleStatusConfirm = useCallback(async () => {
    try {
      const newStatus = selectedUser.status === 'activated' ? 'blocked' : 'activated'
      await mutations.updateUserStatus.mutateAsync({
        id: selectedUser.id,
        data: { status: newStatus }
      })
    } catch (error) {
      console.error('Failed to update user status:', error)
    } finally {
      setStatusDialogOpen(false)
    }
  }, [selectedUser, mutations])

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((newSorting) => {
    setSorting(newSorting)
    setCurrentPage(1)
  }, [])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center">
            <UserIcon className="mr-2 h-4 w-4 text-gray-400" />
            <span className="font-medium text-white">{row.original.name}</span>
          </div>
        ),
        enableSorting: true
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => <div className="text-gray-400">{row.original.email}</div>,
        enableSorting: true
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={row.original.status === 'activated' ? 'success' : 'warning'}>{row.original.status}</Badge>,
        enableSorting: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => <div className="text-gray-400">{new Date(row.original.createdAt).toLocaleDateString()}</div>,
        enableSorting: true
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <PermissionGuard required={'user.update'}>
              <Tooltip content={row.original.status === 'activated' ? 'Block user' : 'Activate user'}>
                <Button variant="ghost" size="sm" onClick={() => handleStatusToggle(row.original)}>
                  <Badge variant={row.original.status === 'activated' ? 'warning' : 'success'}>
                    {row.original.status === 'activated' ? 'Block' : 'Activate'}
                  </Badge>
                </Button>
              </Tooltip>
            </PermissionGuard>
          </div>
        )
      }
    ],
    [handleStatusToggle]
  )

  if (usersError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-400">Error loading users</h3>
          <p className="text-gray-400">{usersError.message}</p>
        </div>
      </div>
    )
  }

  const users = usersData?.items?.flatMap((item) => item || []) || []
  const totalCount = usersData?.meta?.totalItems || 0
  const isLoading = usersLoading || usersFetching

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-white">Users Management</h1>
          <p className="mt-2 text-gray-400">View and manage user accounts</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          {
            label: 'Total Users',
            value: totalCount,
            color: 'indigo',
            icon: UserIcon
          },
          {
            label: 'Active Users',
            value: users.filter((u) => u.status === 'activated').length,
            color: 'green',
            icon: UserIcon
          }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="py-4">
                      <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                      <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-500`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Data Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={users}
              columns={columns}
              totalCount={totalCount}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onSearch={setSearchQuery}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
              searchPlaceholder="Search users..."
              onSort={handleSortChange}
              serverSort={true}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Status Toggle Confirmation */}
      <ConfirmDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        title={`${selectedUser?.status === 'activated' ? 'Block' : 'Activate'} User`}
        description={`Are you sure you want to ${selectedUser?.status === 'activated' ? 'block' : 'activated'} "${selectedUser?.name}"?`}
        confirmText={selectedUser?.status === 'activated' ? 'Block' : 'Activate'}
        onConfirm={handleStatusConfirm}
        loading={mutations.updateUserStatus.isPending}
      />
    </div>
  )
}

export default UsersPage
