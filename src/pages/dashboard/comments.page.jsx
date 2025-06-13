import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Edit, Trash2 } from 'lucide-react'
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
import { useComments, useCommentMutations } from '@/hooks/use.comments'
import { convertSortingToParams } from '@/utils/convert-sorting-params'
import { COMMENT_SCHEMA } from './schema/comment.schema'

const DEFAULT_PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-2">
    <Label required={required}>{label}</Label>
    {children}
    {error && <p className="text-sm text-red-400">{error.message}</p>}
  </div>
)

const CommentForm = ({ defaultValues, onSubmit, loading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(COMMENT_SCHEMA),
    defaultValues: {
      content: '',
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
        {/* Content */}
        <FormField label="Content" required error={errors.content}>
          <Controller
            name="content"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter comment content" className={errors.content ? 'border-red-500' : ''} />}
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
                  { value: 'pending', label: 'Pending' }
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
          Update Comment
        </Button>
      </div>
    </form>
  )
}

const CommentsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sorting, setSorting] = useState([])

  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedComment, setSelectedComment] = useState(null)

  const commentsParams = useMemo(
    () => ({
      search: searchQuery,
      page: currentPage,
      limit: pageSize,
      ...convertSortingToParams(sorting)
    }),
    [currentPage, searchQuery, pageSize, sorting]
  )

  const { data: commentsData, isLoading: commentsLoading, error: commentsError, isFetching: commentsFetching } = useComments(commentsParams)
  const mutations = useCommentMutations()

  const handleEdit = useCallback((comment) => {
    setSelectedComment(comment)
    setEditDialogOpen(true)
  }, [])

  const handleDelete = useCallback((comment) => {
    setSelectedComment(comment)
    setDeleteDialogOpen(true)
  }, [])

  const handleFormSubmit = useCallback(
    async (data) => {
      try {
        await mutations.updateComment.mutateAsync({ id: selectedComment.id, data })
        setEditDialogOpen(false)
      } catch (error) {
        console.error('Failed to update comment:', error)
      }
    },
    [selectedComment, mutations]
  )

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await mutations.deleteComment.mutateAsync(selectedComment.id)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }, [selectedComment, mutations])

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((newSorting) => {
    setSorting(newSorting)
    setCurrentPage(1)
  }, [])

  const handleStatusToggle = useCallback(
    async (comment) => {
      try {
        const newStatus = comment.status === 'published' ? 'pending' : 'published'
        await mutations.updateComment.mutateAsync({
          id: comment.id,
          data: { content: comment.content, status: newStatus }
        })
      } catch (error) {
        console.error('Failed to toggle comment status:', error)
      }
    },
    [mutations]
  )

  const editDefaultValues = useMemo(() => {
    return selectedComment
      ? {
          content: selectedComment.content,
          status: selectedComment.status
        }
      : undefined
  }, [selectedComment])

  const columns = useMemo(
    () => [
      {
        accessorKey: 'content',
        header: 'Content',
        cell: ({ row }) => (
          <div className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4 text-gray-400" />
            <span className="font-medium text-white">{row.original.content}</span>
          </div>
        ),
        enableSorting: true
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Badge
              variant={row.original.status === 'published' ? 'success' : 'warning'}
              className="cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => handleStatusToggle(row.original)}
            >
              {row.original.status}
            </Badge>
          </div>
        ),
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
            <Tooltip content="Edit comment">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
                <Edit className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete comment">
              <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </Tooltip>
          </div>
        )
      }
    ],
    [handleEdit, handleDelete]
  )

  if (commentsError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-400">Error loading comments</h3>
          <p className="text-gray-400">{commentsError.message}</p>
        </div>
      </div>
    )
  }

  const comments = commentsData?.items?.flatMap((item) => item || []) || []
  const totalCount = commentsData?.meta?.totalItems || 0
  const isLoading = commentsLoading || commentsFetching

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-white">Comments Management</h1>
          <p className="mt-2 text-gray-400">View and manage blog comments</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          {
            label: 'Total Comments',
            value: totalCount,
            color: 'indigo',
            icon: MessageSquare
          },
          {
            label: 'Published Comments',
            value: comments.filter((c) => c.status === 'published').length,
            color: 'green',
            icon: MessageSquare
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
            <CardTitle>All Comments</CardTitle>
            <CardDescription>View and manage blog comments</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={comments}
              columns={columns}
              totalCount={totalCount}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onSearch={setSearchQuery}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
              searchPlaceholder="Search comments..."
              onSort={handleSortChange}
              serverSort={true}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogClose onClose={() => setEditDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>Update the comment content and status</DialogDescription>
          </DialogHeader>
          <CommentForm defaultValues={editDefaultValues} onSubmit={handleFormSubmit} loading={mutations.updateComment.isPending} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Comment"
        description={`Are you sure you want to delete this comment? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        loading={mutations.deleteComment.isPending}
      />
    </div>
  )
}

export default CommentsPage
