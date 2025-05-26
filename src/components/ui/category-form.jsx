import { useState, useEffect } from 'react'
import { Save, X, Plus, FolderPlus } from 'lucide-react'
import Button from './button'
import Input from './input'
import Label from './label'
import Textarea from './textarea'
import Select from './select'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from './card'
import IconPicker from './icon-picker'
import FileUpload from './file-upload'

const CategoryForm = ({ category = null, parentCategory = null, categories = [], onSubmit, onCancel, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    thumbnail: '',
    parentId: null,
    status: 'published'
  })

  const [errors, setErrors] = useState({})

  // Initialize form data
  useEffect(() => {
    if (category) {
      // Edit mode
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '📁',
        thumbnail: category.thumbnail || '',
        parentId: category.parentId || null,
        status: category.status || 'published'
      })
    } else if (parentCategory) {
      // Add child mode
      setFormData({
        name: '',
        description: '',
        icon: '📁',
        thumbnail: '',
        parentId: parentCategory.id,
        status: 'published'
      })
    } else {
      // Add new root category
      setFormData({
        name: '',
        description: '',
        icon: '📁',
        thumbnail: '',
        parentId: null,
        status: 'published'
      })
    }
  }, [category, parentCategory])

  // Get available parent categories (exclude current category and its children)
  const getAvailableParents = () => {
    if (!category) return categories

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

    // Filter categories
    const filterCategories = (cats) => {
      return cats
        .filter((cat) => !excludeIds.has(cat.id))
        .map((cat) => ({
          ...cat,
          children: cat.children ? filterCategories(cat.children) : []
        }))
    }

    return filterCategories(categories)
  }

  // Convert tree to flat options for select
  const getParentOptions = () => {
    const options = [{ value: null, label: 'Root Category' }]

    const addOptions = (cats, level = 0) => {
      cats.forEach((cat) => {
        options.push({
          value: cat.id,
          label: `${'  '.repeat(level)}${cat.icon} ${cat.name}`
        })
        if (cat.children) {
          addOptions(cat.children, level + 1)
        }
      })
    }

    addOptions(getAvailableParents())
    return options
  }

  const statusOptions = [
    { value: 'published', label: 'Published' },
    { value: 'draft', label: 'Draft' }
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }

    if (formData.name.length > 100) {
      newErrors.name = 'Category name must be less than 100 characters'
    }

    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const submitData = {
      ...formData,
      id: category?.id || Date.now() // Generate ID for new categories
    }

    onSubmit(submitData)
  }

  const handleReset = () => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        icon: category.icon || '📁',
        thumbnail: category.thumbnail || '',
        parentId: category.parentId || null,
        status: category.status || 'published'
      })
    } else {
      setFormData({
        name: '',
        description: '',
        icon: '📁',
        thumbnail: '',
        parentId: parentCategory?.id || null,
        status: 'published'
      })
    }
    setErrors({})
  }

  const getFormTitle = () => {
    if (category) return 'Edit Category'
    if (parentCategory) return `Add Subcategory to "${parentCategory.name}"`
    return 'Create New Category'
  }

  const getFormDescription = () => {
    if (category) return 'Update category information and settings'
    if (parentCategory) return 'Create a new subcategory under the selected parent'
    return 'Create a new root category for your content organization'
  }

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
          {category && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label required>Category Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter category name"
                error={!!errors.name}
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this category..."
                rows={3}
                error={!!errors.description}
              />
              {errors.description && <p className="mt-1 text-sm text-red-400">{errors.description}</p>}
            </div>
          </div>

          {/* Visual Elements */}
          <div className="space-y-4">
            <div>
              <Label>Icon</Label>
              <IconPicker value={formData.icon} onChange={(icon) => setFormData({ ...formData, icon })} />
            </div>

            <div>
              <Label>Thumbnail</Label>
              <FileUpload
                value={formData.thumbnail}
                onChange={(thumbnail) => setFormData({ ...formData, thumbnail })}
                placeholder="Upload category thumbnail"
              />
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <div>
              <Label>Parent Category</Label>
              <Select
                options={getParentOptions()}
                value={formData.parentId}
                onChange={(parentId) => setFormData({ ...formData, parentId })}
                placeholder="Select parent category"
              />
              {parentCategory && (
                <p className="mt-1 text-sm text-gray-400">
                  Creating subcategory under: {parentCategory.icon} {parentCategory.name}
                </p>
              )}
            </div>

            <div>
              <Label>Status</Label>
              <Select options={statusOptions} value={formData.status} onChange={(status) => setFormData({ ...formData, status })} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-indigo-500/20 pt-4">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={handleReset} disabled={loading}>
                Reset
              </Button>
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
                  Cancel
                </Button>
              )}
            </div>

            <Button type="submit" loading={loading} disabled={!formData.name.trim()}>
              <Save className="mr-2 h-4 w-4" />
              {category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default CategoryForm
