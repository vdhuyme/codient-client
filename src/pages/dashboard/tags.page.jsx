import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Tag as TagIcon, Upload, Download } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Select from '@/components/ui/select'
import Badge from '@/components/ui/badge'
import Tooltip from '@/components/ui/tooltip'
import DataTable from '@/components/ui/data-table'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { useTags, useTagMutations } from '@/hooks/use.tags'
import { convertSortingToParams } from '@/utils/convert-sorting-params'
import { TAG_SCHEMA } from './schema/tag.schema'
import PermissionGuard from '@/hocs/permission-guard'

const DEFAULT_PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-2">
    <Label required={required}>{label}</Label>
    {children}
    {error && <p className="text-sm text-red-400">{error.message}</p>}
  </div>
)

const TagForm = ({ defaultValues, onSubmit, isEdit = false, loading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(TAG_SCHEMA),
    defaultValues: {
      name: '',
      status: 'published',
      ...defaultValues
    },
    mode: 'onChange'
  })

  const handleFormSubmit = async (data) => {
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Name */}
        <FormField label="Name" required error={errors.name}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter tag name" className={errors.name ? 'border-red-500' : ''} />}
          />
        </FormField>

        {/* Status */}
        <FormField label="Status" required error={errors.status}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                options={[
                  { value: 'published', label: 'Published' },
                  { value: 'blocked', label: 'Blocked' }
                ]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select status"
                className={errors.status ? 'border-red-500' : ''}
              />
            )}
          />
        </FormField>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" loading={loading} disabled={!isValid || loading}>
          {isEdit ? 'Update Tag' : 'Create Tag'}
        </Button>
      </div>
    </form>
  )
}

const TagsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sorting, setSorting] = useState([])

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTag, setSelectedTag] = useState(null)

  const tagsParams = useMemo(
    () => ({
      search: searchQuery,
      page: currentPage,
      limit: pageSize,
      ...convertSortingToParams(sorting)
    }),
    [currentPage, searchQuery, pageSize, sorting]
  )

  const { data: tagsData, isLoading: tagsLoading, error: tagsError, isFetching: tagsFetching } = useTags(tagsParams)
  const mutations = useTagMutations()

  const handleCreate = useCallback(() => {
    setSelectedTag(null)
    setCreateDialogOpen(true)
  }, [])

  const handleEdit = useCallback((tag) => {
    setSelectedTag(tag)
    setEditDialogOpen(true)
  }, [])

  const handleDelete = useCallback((tag) => {
    setSelectedTag(tag)
    setDeleteDialogOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    async (data, isEdit = false) => {
      try {
        if (isEdit && selectedTag) {
          await mutations.updateTag.mutateAsync({ id: selectedTag.id, data })
          setEditDialogOpen(false)
        } else {
          await mutations.createTag.mutateAsync(data)
          setCreateDialogOpen(false)
        }
      } catch (error) {
        console.error('Failed to save tag:', error)
      }
    },
    [selectedTag, mutations]
  )

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await mutations.deleteTag.mutateAsync(selectedTag.id)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete tag:', error)
    }
  }, [selectedTag, mutations])

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((newSorting) => {
    setSorting(newSorting)
    setCurrentPage(1)
  }, [])

  const editDefaultValues = useMemo(() => {
    return selectedTag
      ? {
          name: selectedTag.name,
          status: selectedTag.status
        }
      : undefined
  }, [selectedTag])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex items-center">
            <TagIcon className="mr-2 h-4 w-4 text-gray-400" />
            <span className="font-medium text-white">{row.original.name}</span>
          </div>
        ),
        enableSorting: true
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={row.original.status === 'published' ? 'success' : 'warning'}>{row.original.status}</Badge>,
        enableSorting: true
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => <div className="text-gray-400">{new Date(row.original.createdAt).toLocaleDateString()}</div>,
        enableSorting: true
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        cell: ({ row }) => <div className="text-gray-400">{new Date(row.original.updatedAt).toLocaleDateString()}</div>,
        enableSorting: true
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <PermissionGuard required={'tag.update'}>
              <Tooltip content="Edit tag">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </Tooltip>
            </PermissionGuard>

            <PermissionGuard required={'tag.delete'}>
              <Tooltip content="Delete tag">
                <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </Tooltip>
            </PermissionGuard>
          </div>
        )
      }
    ],
    [handleEdit, handleDelete]
  )

  if (tagsError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-400">Error loading tags</h3>
          <p className="text-gray-400">{tagsError.message}</p>
        </div>
      </div>
    )
  }

  const tags = tagsData?.items?.flatMap((item) => item || []) || []
  const totalCount = tagsData?.meta?.totalItems || 0
  const isLoading = tagsLoading || tagsFetching

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-white">Tags Management</h1>
          <p className="mt-2 text-gray-400">Create, edit, and manage your blog tags</p>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip content="Import">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Export">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Button onClick={handleCreate} disabled={mutations.createTag.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Create Tag
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          {
            label: 'Total Tags',
            value: totalCount,
            color: 'indigo',
            icon: TagIcon
          },
          {
            label: 'Active Tags',
            value: tags.filter((t) => t.status === 'active').length,
            color: 'green',
            icon: TagIcon
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
            <CardTitle>All Tags</CardTitle>
            <CardDescription>Manage and organize your blog tags</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={tags}
              columns={columns}
              totalCount={totalCount}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onSearch={setSearchQuery}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
              searchPlaceholder="Search tags..."
              onSort={handleSortChange}
              serverSort={true}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogClose onClose={() => setCreateDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
            <DialogDescription>Fill in the details to create a new tag</DialogDescription>
          </DialogHeader>
          <TagForm onSubmit={(data) => handleFormSubmit(data, false)} loading={mutations.createTag.isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogClose onClose={() => setEditDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update the tag details</DialogDescription>
          </DialogHeader>
          <TagForm
            defaultValues={editDefaultValues}
            onSubmit={(data) => handleFormSubmit(data, true)}
            isEdit={true}
            loading={mutations.updateTag.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tag"
        description={`Are you sure you want to delete "${selectedTag?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        loading={mutations.deleteTag.isPending}
      />
    </div>
  )
}

export default TagsPage
