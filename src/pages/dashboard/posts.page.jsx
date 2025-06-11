import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Calendar, Clock, Tag, Folder, FileText, CheckCircle, FileClock, Eye, Upload, Download } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { usePosts, usePostMutations, DEFAULT_PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/hooks/use.posts'
import { useCategories, useCategoryOptions } from '@/hooks/use.categories'
import { useTagOptions, useTags } from '@/hooks/use.tags'
import { convertSortingToParams } from '@/utils/convert-sorting-params'
import { POST_SCHEMA } from './schema/post.schema'

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-2">
    <Label required={required}>{label}</Label>
    {children}
    {error && <p className="text-sm text-red-400">{error.message}</p>}
  </div>
)

const PostForm = ({ defaultValues, onSubmit, isEdit = false, loading = false }) => {
  const { options: categories, isLoading: categoriesLoading } = useCategoryOptions()
  const { options: tags, isLoading: tagsLoading } = useTagOptions()

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
      status: 'published',
      ...defaultValues
    },
    mode: 'onChange'
  })

  const watchedTitle = watch('title')
  const watchedExcerpt = watch('excerpt')
  const watchedContent = watch('content')

  const isFormLoading = loading || categoriesLoading || tagsLoading

  const handleFormSubmit = async (data) => {
    const formattedData = {
      ...data,
      tagIds: data.tagIds.map((id) => Number(id))
    }

    console.log('Submitted data: ', formattedData)
    onSubmit(formattedData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
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

        <div>
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

  const { data: postsData, isLoading: postsLoading, error: postsError, isFetching: postsFetching } = usePosts(postsParams)
  const { data: categories = [] } = useCategories()
  const { data: tags = [] } = useTags()

  const mutations = usePostMutations()

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

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((newSorting) => {
    setSorting(newSorting)
    setCurrentPage(1)
  }, [])

  const editDefaultValues = useMemo(() => {
    return selectedPost
      ? {
          title: selectedPost.title,
          excerpt: selectedPost.excerpt,
          content: selectedPost.content,
          thumbnail: selectedPost.thumbnail,
          status: selectedPost.status,
          readTime: selectedPost.readTime?.toString(),
          categoryId: selectedPost.category.id?.toString(),
          tagIds: selectedPost.tags?.map(({ id }) => id.toString()) || []
        }
      : undefined
  }, [selectedPost])

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
                  + {row.original.tags.length - 2}
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
            defaultValues={editDefaultValues}
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
