import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Download, Upload, Trash2, FolderPlus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import TreeView from '@/components/ui/tree-view'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import Badge from '@/components/ui/badge'
import Tooltip from '@/components/ui/tooltip'
import Select from '@/components/ui/select'
import Label from '@/components/ui/label'
import IconPicker from '@/components/ui/icon-picker'
import FileUpload from '@/components/ui/file-upload'
import Textarea from '@/components/ui/textarea'
import { createCategory, deleteCategory, getCategories, getCategoryTrees, updateCategory } from '@/api/category'
import toast from 'react-hot-toast'

const fetchCategories = async () => {
  try {
    const response = await getCategories()
    console.log('Fetched categories:', response) // Debug log
    return response
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
}

const fetchCategoryTrees = async () => {
  try {
    const response = await getCategoryTrees()
    console.log('Fetched category trees:', response) // Debug log
    return response
  } catch (error) {
    console.error('Error fetching category trees:', error)
    throw new Error(`Failed to fetch category trees: ${error.message}`)
  }
}

// Custom Hooks
const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    onError: (error) => {
      console.error('Categories query error:', error)
      toast.error('Failed to load categories')
    }
  })
}

const useCategoryTrees = () => {
  return useQuery({
    queryKey: ['categoryTrees'],
    queryFn: fetchCategoryTrees,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    onError: (error) => {
      console.error('Category trees query error:', error)
      toast.error('Failed to load category trees')
    }
  })
}

const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data) => {
      console.log('Creating category with data:', data) // Debug log
      const response = await createCategory(data)
      console.log('Create category response:', response) // Debug log
      return response
    },
    onSuccess: (data) => {
      console.log('Category created successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTrees'] })
      toast.success('Category created successfully!')
    },
    onError: (error) => {
      console.error('Error creating category:', error)
      toast.error(`Failed to create category: ${error.message}`)
      throw error
    }
  })
}

const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }) => {
      console.log('Updating category:', id, 'with data:', data) // Debug log
      const response = await updateCategory(id, data)
      console.log('Update category response:', response) // Debug log
      return response
    },
    onSuccess: (data) => {
      console.log('Category updated successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTrees'] })
      toast.success('Category updated successfully!')
    },
    onError: (error) => {
      console.error('Error updating category:', error)
      toast.error(`Failed to update category: ${error.message}`)
      throw error
    }
  })
}

const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id) => {
      console.log('Deleting category with ID:', id) // Debug log
      const response = await deleteCategory(id)
      console.log('Delete category response:', response) // Debug log
      return response
    },
    onSuccess: () => {
      console.log('Category deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTrees'] })
      toast.success('Category deleted successfully!')
    },
    onError: (error) => {
      console.error('Error deleting category:', error)
      toast.error(`Failed to delete category: ${error.message}`)
      throw error
    }
  })
}

const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ category }) => {
      const newStatus = category.status === 'published' ? 'draft' : 'published'
      console.log('Toggling status for category:', category.id, 'from', category.status, 'to', newStatus) // Debug log

      const response = await updateCategory(category.id, { status: newStatus })
      console.log('Toggle status response:', response) // Debug log
      return response
    },
    onSuccess: (data) => {
      console.log('Category status toggled successfully:', data)
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTrees'] })
      toast.success('Category status updated!')
    },
    onError: (error) => {
      console.error('Error toggling category status:', error)
      toast.error(`Failed to toggle status: ${error.message}`)
      throw error
    }
  })
}

// Zod Schema
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional().or(z.literal('')),
  icon: z.string().min(1, 'Icon is required'),
  thumbnail: z.string().optional().or(z.literal('')),
  parentId: z.string().optional().or(z.literal('')).or(z.null()), // Allow empty string, null, or valid string
  status: z.enum(['published', 'draft'])
})

// Category Form Component
const CategoryForm = ({ category = null, parentCategory = null, onCancel }) => {
  // Custom hooks
  const { data: allCategories = [], isLoading: categoriesLoading } = useCategories()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '📁',
      thumbnail: '',
      parentId: '', // Changed from null to empty string
      status: 'published'
    }
  })

  // Initialize form data
  useEffect(() => {
    console.log('Form validation errors:', errors)

    if (category) {
      console.log('Editing category:', category)
      reset({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '📁',
        thumbnail: category.thumbnail || '',
        parentId: category.parentId || '', // Convert null to empty string
        status: category.status || 'published'
      })
    } else if (parentCategory) {
      console.log('Creating subcategory for parent:', parentCategory)
      reset({
        name: '',
        description: '',
        icon: '📁',
        thumbnail: '',
        parentId: parentCategory.id || '', // Ensure it's not null
        status: 'published'
      })
    } else {
      console.log('Creating new root category')
      reset({
        name: '',
        description: '',
        icon: '📁',
        thumbnail: '',
        parentId: '', // Empty string for root category
        status: 'published'
      })
    }
  }, [category, parentCategory, reset])

  // Get available parent categories (exclude current category and its children)
  const getAvailableParents = () => {
    if (!category) {
      return allCategories
    }

    const excludeIds = new Set([category.id])

    // Add all children IDs to exclude
    const addChildrenIds = (node) => {
      if (node.children && Array.isArray(node.children)) {
        node.children.forEach((child) => {
          excludeIds.add(child.id)
          addChildrenIds(child)
        })
      }
    }
    addChildrenIds(category)

    return allCategories?.filter((cat) => !excludeIds.has(cat.id)) || []
  }

  // Convert categories to select options
  const getParentOptions = () => {
    const options = [{ value: '', label: 'Root Category' }] // Changed from null to empty string

    const availableParents = getAvailableParents()
    if (Array.isArray(availableParents)) {
      availableParents.forEach((cat) => {
        options.push({
          value: cat.id,
          label: `${cat.icon || '📁'} ${cat.name}`
        })
      })
    }

    return options
  }

  const submitHandler = async (data) => {
    try {
      console.log('Form submitted with data:', data)

      const cleanData = {
        ...data,
        description: data.description || undefined,
        thumbnail: data.thumbnail || undefined,
        parentId: data.parentId === '' ? null : data.parentId // Convert empty string back to null for API
      }

      console.log('Cleaned data for API:', cleanData)

      if (category) {
        console.log('Updating category with ID:', category.id)
        await updateMutation.mutateAsync({ id: category.id, data: cleanData })
        console.log('Category updated successfully')
      } else {
        console.log('Creating new category')
        await createMutation.mutateAsync(cleanData)
        console.log('Category created successfully')
      }

      if (!category) {
        reset()
      }

      if (onCancel) {
        onCancel()
      }
    } catch (error) {
      console.error('Error in submitHandler:', error)
    }
  }

  const getFormTitle = () => {
    if (category) {
      return 'Edit Category'
    }
    if (parentCategory) {
      return `Add Subcategory to "${parentCategory.name}"`
    }
    return 'Create New Category'
  }

  const getFormDescription = () => {
    if (category) {
      return 'Update category information and settings'
    }
    if (parentCategory) {
      return 'Create a new subcategory under the selected parent'
    }
    return 'Create a new root category for your content organization'
  }

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting || categoriesLoading

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
              {category ? <FolderPlus className="h-5 w-5 text-indigo-400" /> : <Plus className="h-5 w-5 text-indigo-400" />}
            </div>
            <div>
              <CardTitle>{getFormTitle()}</CardTitle>
              <CardDescription>{getFormDescription()}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
          {/* Basic Info */}
          <div>
            <Label required>Category Name</Label>
            <Input {...register('name')} placeholder="Enter category name" disabled={isLoading} />
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} rows={3} placeholder="Enter category description" disabled={isLoading} />
            {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
          </div>

          {/* Icon */}
          <div>
            <Label required>Icon</Label>
            <IconPicker value={watch('icon')} onChange={(val) => setValue('icon', val)} disabled={isLoading} />
            {errors.icon && <p className="text-sm text-red-400">{errors.icon.message}</p>}
          </div>

          {/* Thumbnail */}
          <div>
            <Label>Thumbnail</Label>
            <FileUpload value={watch('thumbnail')} onChange={(val) => setValue('thumbnail', val)} disabled={isLoading} />
          </div>

          {/* Parent Category */}
          <div>
            <Label>Parent Category</Label>
            <Select
              options={getParentOptions()}
              value={watch('parentId') || ''} // Ensure empty string instead of null
              onChange={(val) => setValue('parentId', val || '')} // Handle null/undefined values
              disabled={isLoading}
              placeholder="Select parent category"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to create a root category</p>
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              options={[
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' }
              ]}
              value={watch('status')}
              onChange={(val) => setValue('status', val)}
              disabled={isLoading}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => reset()} disabled={isLoading}>
                Reset
              </Button>
              <Button type="button" variant="danger" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [parentForNew, setParentForNew] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Custom hooks
  const { data: categories = [], isLoading: treesLoading, error: treesError } = useCategoryTrees()
  const { data: allCategories = [], isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const deleteMutation = useDeleteCategory()
  const toggleStatusMutation = useToggleCategoryStatus()

  // Filter categories based on search
  const filteredCategories = Array.isArray(categories)
    ? categories.filter(
        (category) =>
          category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (category.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  // Get category statistics
  const getStats = () => {
    const validCategories = Array.isArray(allCategories) ? allCategories : []
    return {
      total: validCategories.length,
      published: validCategories.filter((cat) => cat.status === 'published').length,
      draft: validCategories.filter((cat) => cat.status === 'draft').length,
      roots: Array.isArray(categories) ? categories.length : 0
    }
  }

  const stats = getStats()

  // Handle category selection
  const handleSelectCategory = (category) => {
    console.log('Selected category:', category)
    setSelectedCategory(category)
    setEditingCategory(null)
    setParentForNew(null)
  }

  // Handle edit category
  const handleEditCategory = (category) => {
    console.log('Editing category:', category)
    setEditingCategory(category)
    setSelectedCategory(null)
    setParentForNew(null)
  }

  // Handle add child category
  const handleAddChild = (parentCategory) => {
    console.log('Adding child to:', parentCategory)
    setParentForNew(parentCategory)
    setEditingCategory(null)
    setSelectedCategory(null)
  }

  // Handle create new root category
  const handleCreateNew = () => {
    console.log('Creating new root category')
    setParentForNew(null)
    setEditingCategory(null)
    setSelectedCategory(null)
  }

  // Handle delete category
  const handleDeleteCategory = (category) => {
    console.log('Preparing to delete category:', category)
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  // Handle toggle status
  const handleToggleStatus = async (category) => {
    try {
      console.log('Toggling status for category:', category.id, 'Current status:', category.status)
      await toggleStatusMutation.mutateAsync({ category })
      console.log('Status toggle successful')
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        console.log('Confirming delete for category:', categoryToDelete.id)
        await deleteMutation.mutateAsync(categoryToDelete.id)
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
        setSelectedCategory(null)
        console.log('Category deleted successfully')
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  // Cancel form
  const handleCancelForm = () => {
    console.log('Cancelling form')
    setEditingCategory(null)
    setParentForNew(null)
  }

  // Show loading state
  if (treesLoading || categoriesLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-white">Loading categories...</div>
          <div className="text-sm text-gray-400">Please wait while we fetch your data</div>
        </div>
      </div>
    )
  }

  // Show error state
  if (treesError || categoriesError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-400">Error loading categories</div>
          <div className="text-sm text-gray-400">{treesError?.message || categoriesError?.message || 'Please try again later'}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-white">Category Management</h1>
          <p className="mt-2 text-gray-400">Organize your content with hierarchical categories</p>
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
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: 'Total Categories', value: stats.total, color: 'indigo', icon: '📁' },
          { label: 'Published', value: stats.published, color: 'green', icon: '✅' },
          { label: 'Draft', value: stats.draft, color: 'yellow', icon: '📝' },
          { label: 'Root Categories', value: stats.roots, color: 'purple', icon: '🌳' }
        ].map((stat, index) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="py-4">
                    <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                    <p className="mt-1 text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div className="text-2xl">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Side - Category Tree */}
        <div>
          <Card className="h-full overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Category Tree</CardTitle>
                  <CardDescription>Browse and manage your category hierarchy</CardDescription>
                </div>
                <Badge size="sm" className="w-24 md:w-fit" variant="secondary">
                  {stats.total} items
                </Badge>
              </div>

              {/* Search */}
              <div className="pt-4">
                <Input
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="h-4 w-4" />}
                />
              </div>
            </CardHeader>

            <CardContent className="p-4">
              {filteredCategories.length === 0 ? (
                <div className="flex h-32 items-center justify-center">
                  <div className="text-center text-gray-400">
                    {searchQuery ? 'No categories found matching your search' : 'No categories available'}
                  </div>
                </div>
              ) : (
                <TreeView
                  data={filteredCategories}
                  selectedId={selectedCategory?.id || editingCategory?.id}
                  onSelect={handleSelectCategory}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  onAddChild={handleAddChild}
                  onToggleStatus={handleToggleStatus}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Form or Details */}
        <div>
          {editingCategory || parentForNew || (!selectedCategory && !editingCategory) ? (
            <CategoryForm category={editingCategory} parentCategory={parentForNew} onCancel={handleCancelForm} />
          ) : (
            selectedCategory && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{selectedCategory.icon}</div>
                      <div>
                        <CardTitle>{selectedCategory.name}</CardTitle>
                        <CardDescription>Category Details</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedCategory.status === 'published' ? 'success' : 'warning'}>{selectedCategory.status}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(selectedCategory)}>
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(selectedCategory)}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {toggleStatusMutation.isPending ? 'Updating...' : 'Toggle Status'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Description */}
                  {selectedCategory.description && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-300">Description</h4>
                      <p className="text-gray-400">{selectedCategory.description}</p>
                    </div>
                  )}

                  {/* Thumbnail */}
                  {selectedCategory.thumbnail && (
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-300">Thumbnail</h4>
                      <img
                        src={selectedCategory.thumbnail || '/placeholder.svg'}
                        alt={selectedCategory.name}
                        className="h-32 w-32 rounded-lg border border-indigo-500/20 object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder.svg'
                        }}
                      />
                    </div>
                  )}

                  {/* Hierarchy Info */}
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-gray-300">Hierarchy</h4>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div>ID: {selectedCategory.id}</div>
                      <div>Parent ID: {selectedCategory.parentId || 'Root'}</div>
                      <div>Children: {selectedCategory.children?.length || 0}</div>
                      <div>Level: {selectedCategory.parentId ? 'Subcategory' : 'Root Category'}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 border-t border-indigo-500/20 pt-4">
                    <Button variant="outline" onClick={() => handleEditCategory(selectedCategory)}>
                      Edit
                    </Button>
                    <Button variant="outline" onClick={() => handleAddChild(selectedCategory)}>
                      Add Sub
                    </Button>
                    <Button variant="outline" onClick={() => handleDeleteCategory(selectedCategory)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={
          categoryToDelete
            ? `Are you sure you want to delete "${categoryToDelete.name}"? This will also delete all subcategories. This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}

export default CategoriesPage
