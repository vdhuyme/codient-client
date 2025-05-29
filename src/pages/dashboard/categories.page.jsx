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

const fetchCategories = async () => {
  try {
    const { categories } = await getCategories()
    return categories
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
}

const fetchCategoryTrees = async () => {
  try {
    const data = await getCategoryTrees()
    return data
  } catch (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`)
  }
}

// Custom Hooks
const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000 // 10 minutes
  })
}

const useCategoryTrees = () => {
  return useQuery({
    queryKey: ['categoryTrees'],
    queryFn: fetchCategoryTrees,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000
  })
}

const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTrees'] })
    },
    onError: (error) => {
      console.error('Error creating category:', error)
      throw error // Re-throw để form có thể catch được
    }
  })
}

const useUpdateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTrees'] })
    },
    onError: (error) => {
      console.error('Error updating category:', error)
      throw error // Re-throw để form có thể catch được
    }
  })
}

const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTrees'] })
    },
    onError: (error) => {
      console.error('Error deleting category:', error)
      throw error
    }
  })
}

const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ category }) => {
      const newStatus = category.status === 'published' ? 'draft' : 'published'
      // Sử dụng ID thay vì toàn bộ object category
      return updateCategory(category.id, { status: newStatus })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['categoryTrees'] })
    },
    onError: (error) => {
      console.error('Error toggling category status:', error)
      throw error
    }
  })
}

// Zod Schema
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  icon: z.string().min(1, 'Icon is required'),
  thumbnail: z.string().optional(),
  parentId: z.string().nullable(),
  status: z.enum(['published', 'draft'])
})

// Category Form Component
const CategoryForm = ({ category = null, parentCategory = null, onCancel }) => {
  // Custom hooks
  const { data: allCategories = [] } = useCategories()
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
      parentId: parentCategory?.id || null,
      status: 'published'
    }
  })

  // Initialize form data
  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '📁',
        thumbnail: category.thumbnail || '',
        parentId: category.parentId || null,
        status: category.status || 'published'
      })
    } else if (parentCategory) {
      reset({
        name: '',
        description: '',
        icon: '📁',
        thumbnail: '',
        parentId: parentCategory.id,
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
      if (node.children) {
        node.children.forEach((child) => {
          excludeIds.add(child.id)
          addChildrenIds(child)
        })
      }
    }
    addChildrenIds(category)

    return allCategories?.filter((cat) => !excludeIds.has(cat.id))
  }

  // Convert categories to select options
  const getParentOptions = () => {
    const options = [{ value: null, label: 'Root Category' }]

    const availableParents = getAvailableParents()
    availableParents.forEach((cat) => {
      options.push({
        value: cat.id,
        label: `${cat.icon || '📁'} ${cat.name}`
      })
    })

    return options
  }

  const submitHandler = async (data) => {
    try {
      console.log('Form submitted with data:', data) // Debug log

      if (category) {
        console.log('Updating category with ID:', category.id) // Debug log
        await updateMutation.mutateAsync({ id: category.id, data })
        console.log('Category updated successfully') // Debug log
      } else {
        console.log('Creating new category') // Debug log
        await createMutation.mutateAsync(data)
        console.log('Category created successfully') // Debug log
      }

      // Reset form after successful submission
      if (!category) {
        reset()
      }

      // Call onCancel to close the form
      onCancel?.()
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

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting

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
            <Input {...register('name')} placeholder="Enter category name" />
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea {...register('description')} rows={3} placeholder="Enter category description" />
            {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
          </div>

          {/* Icon */}
          <div>
            <Label required>Icon</Label>
            <IconPicker value={watch('icon')} onChange={(val) => setValue('icon', val)} />
            {errors.icon && <p className="text-sm text-red-400">{errors.icon.message}</p>}
          </div>

          {/* Thumbnail */}
          <div>
            <Label>Thumbnail</Label>
            <FileUpload value={watch('thumbnail')} onChange={(val) => setValue('thumbnail', val)} />
          </div>

          {/* Parent Category */}
          <div>
            <Label>Parent Category</Label>
            <Select options={getParentOptions()} value={watch('parentId')} onChange={(val) => setValue('parentId', val)} />
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
  const { data: categories = [], isLoading: treesLoading } = useCategoryTrees()
  const { data: allCategories = [] } = useCategories()
  const deleteMutation = useDeleteCategory()
  const toggleStatusMutation = useToggleCategoryStatus()

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get category statistics
  const getStats = () => {
    return {
      total: allCategories.length,
      published: allCategories?.filter((cat) => cat.status === 'published').length,
      draft: allCategories?.filter((cat) => cat.status === 'draft').length,
      roots: categories.length
    }
  }

  const stats = getStats()

  // Handle category selection
  const handleSelectCategory = (category) => {
    setSelectedCategory(category)
    setEditingCategory(null)
    setParentForNew(null)
  }

  // Handle edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setSelectedCategory(null)
    setParentForNew(null)
  }

  // Handle add child category
  const handleAddChild = (parentCategory) => {
    setParentForNew(parentCategory)
    setEditingCategory(null)
    setSelectedCategory(null)
  }

  // Handle create new root category
  const handleCreateNew = () => {
    setParentForNew(null)
    setEditingCategory(null)
    setSelectedCategory(null)
  }

  // Handle delete category
  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category)
    setDeleteDialogOpen(true)
  }

  // Handle toggle status - Fixed function
  const handleToggleStatus = async (category) => {
    try {
      console.log('Toggling status for category:', category.id, 'Current status:', category.status) // Debug log
      await toggleStatusMutation.mutateAsync({ category })
      console.log('Status toggle successful') // Debug log
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Failed to toggle category status')
    }
  }

  // Handle delete confirm - Fixed to use correct identifier
  const handleDeleteConfirm = async () => {
    if (categoryToDelete) {
      try {
        // Use ID instead of id if your API expects ID
        await deleteMutation.mutateAsync(categoryToDelete.id) // Changed from id to id
        setDeleteDialogOpen(false)
        setCategoryToDelete(null)
        setSelectedCategory(null)
        console.log('Category deleted successfully') // Debug log
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('Failed to delete category')
      }
    }
  }

  // Cancel form
  const handleCancelForm = () => {
    setEditingCategory(null)
    setParentForNew(null)
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
          <Card className="flex h-[600px] flex-col">
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

            <CardContent className="min-h-0 flex-1">
              <div className="scrollbar-hide max-h-[70vh] overflow-y-auto">
                {treesLoading ? (
                  <div className="flex h-32 items-center justify-center">
                    <div className="text-gray-400">Loading categories...</div>
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
              </div>
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
