import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import './category.css'
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryDetail } from '@/api/category'
import slugify from 'slugify'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema } from './schema'
import { toast } from 'react-hot-toast'

const getCategoryDescendantIds = (categories, parentId, result = []) => {
  const children = categories.filter((cat) => cat.parent?.id === parentId)

  children.forEach((child) => {
    result.push(child.id)
    getCategoryDescendantIds(categories, child.id, result)
  })

  return result
}

const Index = () => {
  const [categories, setCategories] = useState([])
  const [treeCategories, setTreeCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formMode, setFormMode] = useState('view') // 'view', 'edit', 'create'

  const {
    control,
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      parent: '',
      description: ''
    }
  })

  const watchName = watch('name')
  const watchSlug = watch('slug')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const { categories } = await getCategories()
      setCategories(categories)
      setTreeCategories(categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Auto-generate slug based on name
    if (watchName && (formMode === 'create' || !watchSlug || (formMode === 'edit' && isDirty))) {
      const slug = slugify(watchName || '', {
        lower: true,
        strict: true,
        trim: true
      })
      setValue('slug', slug)
    }
  }, [watchName, setValue, formMode, watchSlug, isDirty])

  const handleSelectCategory = async (category) => {
    setIsLoading(true)
    try {
      const { category: categoryResponse } = await getCategoryDetail(category.id)
      setSelectedCategory(categoryResponse)
      setFormMode('view')

      reset({
        name: categoryResponse.name || '',
        slug: categoryResponse.slug || '',
        parent: categoryResponse.parent?.id.toString() || '',
        description: categoryResponse.description || ''
      })
    } catch (error) {
      console.error('Error fetching category detail:', error)
      toast.error('Failed to fetch category detail')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateMode = () => {
    setSelectedCategory(null)
    setFormMode('create')
    reset({
      name: '',
      slug: '',
      parent: '',
      description: ''
    })
  }

  const handleEditMode = () => {
    if (selectedCategory) {
      setFormMode('edit')
    }
  }

  const handleCancelEdit = () => {
    setFormMode('view')
    const category = selectedCategory ?? {
      name: '',
      slug: '',
      parent: '',
      description: ''
    }
    reset({
      name: category.name || '',
      slug: category.slug || '',
      parent: category.parent?.toString() || '',
      description: category.description || ''
    })
  }

  const handleCreateSubmit = async (data) => {
    setIsLoading(true)
    try {
      const category = {
        name: data.name,
        slug: data.slug,
        parent: data.parent ? Number(data.parent) : null,
        description: data.description || ''
      }

      await createCategory(category)
      await fetchCategories()
      setFormMode('view')
      toast.success('Category created successfully')
    } catch (error) {
      console.error('Error creating category:', error)
      toast.error(error.data.message ?? 'Failed to create category')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSubmit = async (data) => {
    setIsLoading(true)
    try {
      const category = {
        name: data.name,
        slug: data.slug,
        parent: data.parent ? Number(data.parent) : null,
        description: data.description || ''
      }

      await updateCategory(selectedCategory.id, category)
      await fetchCategories()

      setFormMode('view')
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error(error.data.message ?? 'Failed to update category')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    setIsLoading(true)
    try {
      await deleteCategory(categoryId)
      await fetchCategories()

      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error(error.data.message ?? 'Failed to delete category')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    if (formMode === 'create') {
      handleCreateSubmit(data)
    } else if (formMode === 'edit') {
      handleUpdateSubmit(data)
    }
  }

  // Filter categories to avoid circular parent-child relationships
  const getAvailableParentCategories = () => {
    if (!selectedCategory) {
      return categories
    }

    // Get all descendant IDs
    const descendantIds = getCategoryDescendantIds(categories, selectedCategory.id)

    // Filter out the selected category and all its descendants
    return categories.filter((cat) => cat.id !== selectedCategory.id && !descendantIds.includes(cat.id))
  }

  const availableParentCategories = getAvailableParentCategories()
  const flattenCategories = (categories, depth = 0) => {
    return categories.flatMap((cat) => [{ ...cat, depth }, ...flattenCategories(cat.children || [], depth + 1)])
  }

  return (
    <>
      <div className="content__header">
        <h1>Dashboard</h1>
        <ol className="breadcrumb">
          <li className="breadcrumb__item">
            <a href="#">Home</a>
          </li>
          <li className="breadcrumb__item active">Category</li>
        </ol>
      </div>

      <div className="category-management">
        <div className="info-box">
          <i className="bx bx-info-circle"></i>
          <p>
            Categories help organize your content and make it easier for users to find related information. You can create a hierarchical structure by
            setting parent-child relationships.
          </p>
        </div>

        <div className="category-management__grid">
          <div className="category-list-container">
            <div className="category-list__actions">
              <button className="btn btn-primary" onClick={handleCreateMode} disabled={isLoading}>
                <i className="bx bx-plus"></i> Create
              </button>
            </div>

            {isLoading && !categories.length ? (
              <div className="loading-state">
                <i className="bx bx-loader-alt bx-spin"></i>
                <p>Loading categories...</p>
              </div>
            ) : (
              <CategoryTree categories={treeCategories} onSelectCategory={handleSelectCategory} onDeleteCategory={handleDeleteCategory} />
            )}
          </div>

          <div className="category-editor-container">
            <div className="editor-header flex justify-between">
              {formMode === 'create' ? (
                <h3>Create New Category</h3>
              ) : formMode === 'edit' ? (
                <h3>Edit Category: {selectedCategory?.name}</h3>
              ) : selectedCategory ? (
                <h3>Category Details: {selectedCategory.name}</h3>
              ) : (
                <h3>Select a category or create a new one</h3>
              )}

              {formMode === 'view' && selectedCategory && (
                <button className="btn btn-secondary" onClick={handleEditMode} disabled={isLoading}>
                  <i className="bx bx-edit"></i> Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="categoryName">
                  Name <span className="required">*</span>
                </label>
                <input
                  id="categoryName"
                  {...register('name')}
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  disabled={formMode === 'view' || isLoading}
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="categorySlug">
                  Permalink <span className="required">*</span>
                </label>
                <input
                  id="categorySlug"
                  {...register('slug')}
                  className={`form-control ${errors.slug ? 'is-invalid' : ''}`}
                  disabled={formMode === 'view' || isLoading}
                />
                {errors.slug && <div className="invalid-feedback">{errors.slug.message}</div>}
                <p className="form-text">
                  Preview: <span id="permalinkPreview">{`${import.meta.env.VITE_CLIENT_DOMAIN}/categories/${watch('slug')}`}</span>
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="categoryParent">Parent</label>
                <select id="categoryParent" {...register('parent')} className="form-select" disabled={formMode === 'view' || isLoading}>
                  <option value="">None (Top Level)</option>
                  {flattenCategories(availableParentCategories)
                    .filter((cat) => cat.id !== selectedCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {'—'.repeat(cat.depth)} {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <ReactQuill
                      theme="snow"
                      value={field.value || ''}
                      onChange={field.onChange}
                      readOnly={formMode === 'view'}
                      modules={{
                        toolbar: formMode !== 'view' && {
                          container: [
                            [{ header: [1, 2, 3, false] }],
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            [{ indent: '-1' }, { indent: '+1' }],
                            [{ align: [] }],
                            ['link', 'image'],
                            ['clean']
                          ]
                        }
                      }}
                    />
                  )}
                />
              </div>

              <div className="form-actions">
                {formMode !== 'view' && (
                  <>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit} disabled={isLoading}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <i className="bx bx-loader-alt bx-spin"></i> Saving...
                        </>
                      ) : formMode === 'create' ? (
                        'Create Category'
                      ) : (
                        'Update Category'
                      )}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Index

const CategoryTree = ({ categories, onSelectCategory, onDeleteCategory }) => {
  const [expandedCategories, setExpandedCategories] = useState({})
  const [selectedId, setSelectedId] = useState(null)

  // Initialize with all categories expanded
  useEffect(() => {
    const initExpanded = {}

    const expandAll = (cats) => {
      cats.forEach((cat) => {
        initExpanded[cat.id] = true
        if (cat.children && cat.children.length > 0) {
          expandAll(cat.children)
        }
      })
    }

    expandAll(categories)
    setExpandedCategories(initExpanded)
  }, [categories])

  const handleToggle = (categoryId) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const handleSelect = (category) => {
    setSelectedId(category.id)
    if (onSelectCategory) {
      onSelectCategory(category)
    }
  }

  const handleDelete = (e, categoryId) => {
    e.stopPropagation()
    if (onDeleteCategory) {
      onDeleteCategory(categoryId)
    }
  }

  const renderCategory = (category, level = 0) => {
    const isSelected = selectedId === category.id
    const isExpanded = expandedCategories[category.id]
    const hasChildren = category.children && category.children.length > 0

    return (
      <div key={category.id}>
        <div className={`category-item ${isSelected ? 'active' : ''}`} style={{ marginLeft: `${level * 20}px` }}>
          <button
            className="category-toggle"
            onClick={(e) => {
              e.stopPropagation()
              handleToggle(category.id)
            }}
          >
            {hasChildren ? (
              isExpanded ? (
                <i className="bx bx-chevron-down"></i>
              ) : (
                <i className="bx bx-chevron-right"></i>
              )
            ) : (
              <span style={{ width: '24px' }}></span>
            )}
          </button>

          <i className={`category-icon bx ${hasChildren ? 'bx-folder' : 'bx-file'}`}></i>

          <div className="category-content" onClick={() => handleSelect(category)}>
            <span className="category-name">{category.name}</span>
            <span className="category-count">({category.postCount || 0})</span>
          </div>

          <button className="category-action-delete" onClick={(e) => handleDelete(e, category.id)} title="Delete category">
            <i className="bx bx-trash"></i>
          </button>
        </div>

        {isExpanded && hasChildren && <div className="category-children">{category.children.map((child) => renderCategory(child, level + 1))}</div>}
      </div>
    )
  }

  return (
    <div className="category-list">
      {!categories || categories.length === 0 ? (
        <div className="category-empty">No categories found</div>
      ) : (
        categories.map((category) => renderCategory(category))
      )}
    </div>
  )
}
