import { useState, useCallback, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Select from '@/components/ui/select'
import TreeView from '@/components/ui/tree-view'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import { useCategoryMutations, useCategoryTrees } from '@/hooks/use.categories'
import { CATEGORY_SCHEMA } from './schema/category.schema'
import FileUpload from '@/components/ui/file-upload'

const FormField = ({ label, required, error, children }) => (
  <div className="space-y-2">
    <Label required={required}>{label}</Label>
    {children}
    {error && <p className="text-sm text-red-400">{error.message}</p>}
  </div>
)

const getAllChildIds = (category, allCategories) => {
  let childIds = []
  const children = allCategories.filter((cat) => cat.parentId === category.id)
  children.forEach((child) => {
    childIds.push(child.id)
    childIds = childIds.concat(getAllChildIds(child, allCategories))
  })
  return childIds
}

const CategoryForm = ({ defaultValues, onSubmit, isEdit = false, loading = false, categories = [], parentId = null }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(CATEGORY_SCHEMA),
    defaultValues: {
      name: '',
      description: '',
      thumbnail: '',
      icon: '📁',
      parentId,
      status: 'published',
      ...defaultValues
    },
    mode: 'onChange'
  })

  // Reset form when defaultValues change
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues)
    } else {
      reset({
        name: '',
        description: '',
        thumbnail: '',
        icon: '📁',
        parentId,
        status: 'published'
      })
    }
  }, [defaultValues, reset, parentId])

  const handleFormSubmit = async (data) => {
    onSubmit(data)
    reset()
  }

  // Get available parent categories
  const availableParentCategories = useMemo(() => {
    if (!isEdit || !defaultValues?.id) {
      return categories
    }

    const childIds = getAllChildIds(defaultValues, categories)

    // Filter out current category and its children
    return categories.filter((cat) => cat.id !== defaultValues.id && !childIds.includes(cat.id))
  }, [categories, defaultValues, isEdit])

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {/* Name */}
        <FormField label="Name" required error={errors.name}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter category name" className={errors.name ? 'border-red-500' : ''} />}
          />
        </FormField>

        {/* Description */}
        <FormField label="Description" required error={errors.description}>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Enter category description" className={errors.description ? 'border-red-500' : ''} />
            )}
          />
        </FormField>

        {/* Thumbnail */}
        <FormField label="Thumbnail" error={errors.thumbnail}>
          <Controller
            name="thumbnail"
            control={control}
            render={({ field }) => <FileUpload value={field.value} onChange={field.onChange} placeholder="Upload category thumbnail" />}
          />
        </FormField>

        {/* Icon */}
        <FormField label="Icon" required error={errors.icon}>
          <Controller
            name="icon"
            control={control}
            render={({ field }) => <Input {...field} placeholder="Enter icon emoji" className={errors.icon ? 'border-red-500' : ''} />}
          />
        </FormField>

        {/* Parent Category */}
        <FormField label="Parent Category" error={errors.parentId}>
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                options={[{ value: null, label: 'None' }, ...availableParentCategories.map((cat) => ({ value: cat.id, label: cat.name }))]}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select parent category"
                className={errors.parentId ? 'border-red-500' : ''}
              />
            )}
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
          {isEdit ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
}

const flattenCategories = (tree) => {
  const result = []

  function traverse(nodes) {
    for (const node of nodes) {
      result.push({ ...node, children: undefined })
      if (node.children && node.children.length > 0) {
        traverse(node.children)
      }
    }
  }

  traverse(tree)
  return result
}

const CategoriesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useCategoryTrees()
  const mutations = useCategoryMutations()

  const handleCreate = useCallback(() => {
    setSelectedCategory(null)
    setIsCreating(true)
  }, [])

  const handleEdit = useCallback((category) => {
    setSelectedCategory(category)
    setIsCreating(false)
  }, [])

  const handleDelete = useCallback((category) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }, [])

  const handleAddChild = useCallback((category) => {
    setSelectedCategory(null)
    setIsCreating(true)
  }, [])

  const handleFormSubmit = useCallback(
    async (data) => {
      try {
        if (selectedCategory) {
          await mutations.updateCategory.mutateAsync({ id: selectedCategory.id, data })
          setSelectedCategory(null)
        } else {
          await mutations.createCategory.mutateAsync(data)
          setIsCreating(false)
        }
      } catch (error) {
        console.error('Failed to save category:', error)
      }
    },
    [selectedCategory, mutations]
  )

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await mutations.deleteCategory.mutateAsync(selectedCategory.id)
      setDeleteDialogOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error('Failed to delete category:', error)
    }
  }, [selectedCategory, mutations])

  const findParentById = (tree, targetId) => {
    for (const node of tree) {
      if (node.children?.some((child) => child.id === targetId)) {
        return node
      }

      if (node.children && node.children.length > 0) {
        const parent = findParentById(node.children, targetId)
        if (parent) {
          return parent
        }
      }
    }

    return null
  }

  const editDefaultValues = useMemo(() => {
    return selectedCategory
      ? {
          name: selectedCategory.name,
          description: selectedCategory.description,
          thumbnail: selectedCategory.thumbnail,
          icon: selectedCategory.icon,
          parentId: findParentById(categories, selectedCategory.id)?.id?.toString(),
          status: selectedCategory.status
        }
      : null
  }, [selectedCategory])

  if (categoriesError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-400">Error loading categories</h3>
          <p className="text-gray-400">{categoriesError.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories Management</h1>
          <p className="mt-2 text-gray-400">Create, edit, and manage your blog categories</p>
        </div>

        <Button onClick={handleCreate} disabled={mutations.createCategory.isPending}>
          <Plus className="mr-2 h-4 w-4" />
          Create Category
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tree View */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Category Structure</CardTitle>
              <CardDescription>View and manage your category hierarchy</CardDescription>
            </CardHeader>
            <CardContent>
              <TreeView
                data={categories}
                onSelect={handleEdit}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddChild={handleAddChild}
                selectedId={selectedCategory?.id}
                loading={categoriesLoading}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle>{selectedCategory ? 'Edit Category' : 'Create Category'}</CardTitle>
              <CardDescription>{selectedCategory ? 'Update the category details' : 'Fill in the details to create a new category'}</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryForm
                defaultValues={editDefaultValues}
                onSubmit={handleFormSubmit}
                isEdit={!!selectedCategory}
                loading={selectedCategory ? mutations.updateCategory.isPending : mutations.createCategory.isPending}
                categories={flattenCategories(categories)}
                parentId={selectedCategory?.parentId}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Category"
        description={`Are you sure you want to delete "${selectedCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        loading={mutations.deleteCategory.isPending}
      />
    </div>
  )
}

export default CategoriesPage
