import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, Clock, Tag, Folder, FileText, CheckCircle, FileClock, Eye, Upload, Download } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Components
import Button from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import Badge from '@/components/ui/badge'
import Tooltip from '@/components/ui/tooltip'
import DataTable from '@/components/ui/data-table'
import MultiSelect from '@/components/ui/multi-select'
import FileUpload from '@/components/ui/file-upload'
import ConfirmDialog from '@/components/ui/confirm-dialog'

// API functions
import { getCategories } from '@/api/category'
import { getTags } from '@/api/tags'

// Custom hooks
import { usePosts, usePostMutations, POST_QUERY_KEYS, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS, convertSortingToParams } from '@/hooks/use.posts'

const POST_SCHEMA = z.object({
  title: z.string().min(1, 'Title is required').min(3, 'Title must be at least 3 characters').max(200, 'Title must not exceed 200 characters'),
  excerpt: z
    .string()
    .min(1, 'Excerpt is required')
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt must not exceed 500 characters'),
  content: z.string().min(1, 'Content is required').min(50, 'Content must be at least 50 characters'),
  thumbnail: z.any().optional(),
  readTime: z
    .string()
    .min(1, 'Read time is required')
    .refine((val) => {
      const num = parseInt(val)
      return !isNaN(num) && num > 0 && num <= 999
    }, 'Read time must be a positive number between 1 and 999'),
  categoryId: z.union([z.string().min(1, 'Category is required'), z.number()]),
  tagIds: z.array(z.coerce.string()).min(1, 'At least one tag is required')
})

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-2">
    <Label required={required}>{label}</Label>
    {children}
    {error && <p className="text-sm text-red-400">{error.message}</p>}
  </div>
)

const PostForm = ({ defaultValues, onSubmit, isEdit = false, loading = false }) => {
  const { data: categoryData = [], isLoading: categoriesLoading } = useQuery({
    queryKey: POST_QUERY_KEYS.categories,
    queryFn: getCategories,
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })

  const { data: tagData = [], isLoading: tagsLoading } = useQuery({
    queryKey: POST_QUERY_KEYS.tags,
    queryFn: getTags,
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })

  const categories =
    categoryData?.items
      ?.flatMap((item) => item || [])
      .map((item) => ({
        value: item.id.toString(),
        label: item.name
      })) || []

  const tags =
    tagData?.items
      ?.flatMap((item) => item || [])
      .map((item) => ({
        value: item.id.toString(),
        label: item.name
      })) || []

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch
  } = useForm({
    resolver: zodResolver(POST_SCHEMA),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      thumbnail: null,
      readTime: '',
      categoryId: '',
      tagIds: [],
      ...defaultValues
    },
    mode: 'onChange'
  })

  // Watch for character count
  const watchedTitle = watch('title')
  const watchedExcerpt = watch('excerpt')
  const watchedContent = watch('content')

  const isFormLoading = loading || categoriesLoading || tagsLoading

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Title */}
        <div className="md:col-span-2">
          <FormField label="Title" required error={errors.title}>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <div>
                  <Input {...field} placeholder="Enter post title" className={errors.title ? 'border-red-500' : ''} />
                  <div className="mt-1 text-xs text-gray-500">{watchedTitle?.length || 0}/200 characters</div>
                </div>
              )}
            />
          </FormField>
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <FormField label="Excerpt" required error={errors.excerpt}>
            <Controller
              name="excerpt"
              control={control}
              render={({ field }) => (
                <div>
                  <Textarea {...field} placeholder="Brief description of the post" rows={3} className={errors.excerpt ? 'border-red-500' : ''} />
                  <div className="mt-1 text-xs text-gray-500">{watchedExcerpt?.length || 0}/500 characters</div>
                </div>
              )}
            />
          </FormField>
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <FormField label="Content" required error={errors.content}>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <div>
                  <Textarea {...field} placeholder="Write your post content here..." rows={8} className={errors.content ? 'border-red-500' : ''} />
                  <div className="mt-1 text-xs text-gray-500">{watchedContent?.length || 0} characters (minimum 50)</div>
                </div>
              )}
            />
          </FormField>
        </div>

        {/* Thumbnail */}
        <div className="md:col-span-2">
          <FormField label="Thumbnail" error={errors.thumbnail}>
            <Controller
              name="thumbnail"
              control={control}
              render={({ field }) => <FileUpload value={field.value} onChange={field.onChange} placeholder="Upload post thumbnail" />}
            />
          </FormField>
        </div>

        {/* Read Time */}
        <div>
          <FormField label="Read Time (minutes)" required error={errors.readTime}>
            <Controller
              name="readTime"
              control={control}
              render={({ field }) => (
                <Input {...field} type="number" placeholder="5" min="1" max="999" className={errors.readTime ? 'border-red-500' : ''} />
              )}
            />
          </FormField>
        </div>

        {/* Category */}
        <div>
          <FormField label="Category" required error={errors.categoryId}>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  options={categories}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select category"
                  className={errors.categoryId ? 'border-red-500' : ''}
                  loading={categoriesLoading}
                />
              )}
            />
          </FormField>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <FormField label="Tags" required error={errors.tagIds}>
            <Controller
              name="tagIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={tags}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select tags"
                  className={errors.tagIds ? 'border-red-500' : ''}
                  loading={tagsLoading}
                />
              )}
            />
          </FormField>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit" loading={isFormLoading} disabled={!isValid || isFormLoading}>
          {isEdit ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  )
}

const PostsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sorting, setSorting] = useState([])

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const postsParams = useMemo(
    () => ({
      search: searchQuery,
      page: currentPage,
      limit: pageSize,
      ...convertSortingToParams(sorting)
    }),
    [currentPage, searchQuery, pageSize, sorting]
  )

  // Data fetching with React Query
  const { data: postsData, isLoading: postsLoading, error: postsError, isFetching: postsFetching } = usePosts(postsParams)

  const { data: categories = [] } = useQuery({
    queryKey: POST_QUERY_KEYS.categories,
    queryFn: getCategories,
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })

  const { data: tags = [] } = useQuery({
    queryKey: POST_QUERY_KEYS.tags,
    queryFn: getTags,
    staleTime: 15 * 60 * 1000,
    cacheTime: 30 * 60 * 1000
  })

  // Mutations
  const mutations = usePostMutations()

  // Form handlers
  const handleCreate = useCallback(() => {
    setSelectedPost(null)
    setCreateDialogOpen(true)
  }, [])

  const handleEdit = useCallback((post) => {
    setSelectedPost(post)
    setEditDialogOpen(true)
  }, [])

  const handleDelete = useCallback((post) => {
    setSelectedPost(post)
    setDeleteDialogOpen(true)
  }, [])

  // Submit handler for form
  const handleFormSubmit = useCallback(
    async (data, isEdit = false) => {
      try {
        if (isEdit && selectedPost) {
          await mutations.updatePost.mutateAsync({ id: selectedPost.id, data })
          setEditDialogOpen(false)
        } else {
          await mutations.createPost.mutateAsync(data)
          setCreateDialogOpen(false)
        }
      } catch (error) {
        console.error('Failed to save post:', error)
      }
    },
    [selectedPost, mutations]
  )

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await mutations.deletePost.mutateAsync(selectedPost.id)
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete post:', error)
    }
  }, [selectedPost, mutations])

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  // Handle sort change
  const handleSortChange = useCallback((newSorting) => {
    setSorting(newSorting)
    setCurrentPage(1)
  }, [])

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'thumbnail',
        header: 'Thumbnail',
        cell: ({ row }) => (
          <div className="h-12 w-16 overflow-hidden rounded-lg bg-slate-700">
            <img src={row.original.thumbnail || '/placeholder.svg'} alt={row.original.title} className="h-full w-full object-cover" />
          </div>
        ),
        enableSorting: false
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div className="max-w-xs">
            <h4 className="truncate font-medium text-white">{row.original.title}</h4>
            <p className="truncate text-sm text-gray-400">{row.original.excerpt}</p>
          </div>
        ),
        enableSorting: true
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
          return (
            <Badge variant="secondary">
              <Folder className="mr-1 h-3 w-3" />
              {row.original?.category?.name || 'Unknown'}
            </Badge>
          )
        },
        enableSorting: false
      },
      {
        accessorKey: 'tags',
        header: 'Tags',
        cell: ({ row }) => {
          return (
            <div className="flex flex-wrap gap-1">
              {row.original.tags?.slice(0, 2).map((tag, index) => (
                <Badge key={`tag-${tag.value}-${index}`} variant="default" size="sm">
                  <Tag className="mr-1 h-2 w-2" />
                  {tag.name}
                </Badge>
              ))}
              {row.original.tags?.length > 2 && (
                <Badge variant="secondary" size="sm">
                  +{row.original.tags.length - 2}
                </Badge>
              )}
            </div>
          )
        },
        enableSorting: false
      },
      {
        accessorKey: 'readTime',
        header: 'Read Time',
        cell: ({ row }) => (
          <div className="flex items-center text-gray-400">
            <Clock className="mr-1 h-4 w-4" />
            {row.original.readTime} min
          </div>
        ),
        enableSorting: true
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge variant={row.original.status === 'published' ? 'success' : 'warning'}>{row.original.status}</Badge>
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => (
          <div className="flex items-center text-gray-400">
            <Calendar className="mr-1 h-4 w-4" />
            {new Date(row.original.createdAt).toLocaleDateString()}
          </div>
        ),
        enableSorting: true
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Tooltip content="Edit post">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(row.original)}>
                <Edit className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content="Delete post">
              <Button variant="ghost" size="sm" onClick={() => handleDelete(row.original)}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </Tooltip>
          </div>
        )
      }
    ],
    [handleEdit, handleDelete, categories, tags]
  )

  if (postsError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-400">Error loading posts</h3>
          <p className="text-gray-400">{postsError.message}</p>
        </div>
      </div>
    )
  }

  const posts = postsData?.items?.flatMap((item) => item || []) || []
  const totalCount = postsData?.meta?.totalItems || 0
  const isLoading = postsLoading || postsFetching

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-white">Posts Management</h1>
          <p className="mt-2 text-gray-400">Create, edit, and manage your blog posts</p>
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
          <Button onClick={handleCreate} disabled={mutations.createPost.isPending}>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          {
            label: 'Total Posts',
            value: totalCount,
            color: 'indigo',
            icon: FileText
          },
          {
            label: 'Published',
            value: posts.filter((p) => p.status === 'published').length,
            color: 'green',
            icon: CheckCircle
          },
          {
            label: 'Drafts',
            value: posts.filter((p) => p.status === 'draft').length,
            color: 'yellow',
            icon: FileClock
          },
          {
            label: 'Views',
            value: '12.5K',
            color: 'red',
            icon: Eye
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
            <CardTitle>All Posts</CardTitle>
            <CardDescription>Manage and organize your blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={posts}
              columns={columns}
              totalCount={totalCount}
              pageSize={pageSize}
              pageSizeOptions={PAGE_SIZE_OPTIONS}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              onSearch={setSearchQuery}
              onPageSizeChange={handlePageSizeChange}
              loading={isLoading}
              searchPlaceholder="Search posts..."
              onSort={handleSortChange}
              serverSort={true}
              sorting={sorting}
              onSortingChange={setSorting}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} size="xl">
        <DialogContent className="scrollbar-hide max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogClose onClose={() => setCreateDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>Fill in the details to create a new blog post</DialogDescription>
          </DialogHeader>
          <PostForm onSubmit={(data) => handleFormSubmit(data, false)} loading={mutations.createPost.isPending} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen} size="xl">
        <DialogContent className="scrollbar-hide max-h-[90vh] max-w-4xl overflow-y-auto">
          <DialogClose onClose={() => setEditDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Update the post details</DialogDescription>
          </DialogHeader>
          <PostForm
            defaultValues={
              selectedPost
                ? {
                    title: selectedPost.title,
                    excerpt: selectedPost.excerpt,
                    content: selectedPost.content,
                    thumbnail: selectedPost.thumbnail,
                    readTime: selectedPost.readTime?.toString(),
                    categoryId: selectedPost.category?.id?.toString() || selectedPost.categoryId?.toString() || '',
                    tagIds: selectedPost.tags?.map((tag) => tag.id?.toString()) || []
                  }
                : undefined
            }
            onSubmit={(data) => handleFormSubmit(data, true)}
            isEdit={true}
            loading={mutations.updatePost.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Post"
        description={`Are you sure you want to delete "${selectedPost?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        loading={mutations.deletePost.isPending}
      />
    </div>
  )
}

export default PostsPage
