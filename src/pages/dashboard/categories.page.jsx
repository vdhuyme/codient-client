import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Download, Upload, Trash2 } from 'lucide-react'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import TreeView from '@/components/ui/tree-view'
import CategoryForm from '@/components/ui/category-form'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import Badge from '@/components/ui/badge'
import Tooltip from '@/components/ui/tooltip'

// Mock data
const mockCategories = [
  {
    id: 1,
    name: 'Technology',
    description: 'All things tech related',
    icon: '💻',
    thumbnail: '/placeholder.svg?height=100&width=100',
    parentId: null,
    status: 'published',
    children: [
      {
        id: 2,
        name: 'Frontend',
        description: 'Everything about UI development and frameworks',
        icon: '🖥️',
        thumbnail: '',
        parentId: 1,
        status: 'published',
        children: [
          {
            id: 3,
            name: 'React',
            description: 'React.js framework and ecosystem',
            icon: '⚛️',
            thumbnail: '',
            parentId: 2,
            status: 'published',
            children: []
          },
          {
            id: 4,
            name: 'Vue.js',
            description: 'Vue.js framework and tools',
            icon: '💚',
            thumbnail: '',
            parentId: 2,
            status: 'draft',
            children: []
          }
        ]
      },
      {
        id: 5,
        name: 'Backend',
        description: 'Server-side development and APIs',
        icon: '⚙️',
        thumbnail: '',
        parentId: 1,
        status: 'published',
        children: [
          {
            id: 6,
            name: 'Node.js',
            description: 'JavaScript runtime for backend',
            icon: '🟢',
            thumbnail: '',
            parentId: 5,
            status: 'published',
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'Design',
    description: 'UI/UX design and creative resources',
    icon: '🎨',
    thumbnail: '/placeholder.svg?height=100&width=100',
    parentId: null,
    status: 'published',
    children: [
      {
        id: 8,
        name: 'UI Design',
        description: 'User interface design principles',
        icon: '🖼️',
        thumbnail: '',
        parentId: 7,
        status: 'published',
        children: []
      }
    ]
  },
  {
    id: 9,
    name: 'Business',
    description: 'Business strategy and management',
    icon: '💼',
    thumbnail: '',
    parentId: null,
    status: 'draft',
    children: []
  }
]

const CategoriesPage = () => {
  const [categories, setCategories] = useState(mockCategories)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [parentForNew, setParentForNew] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)

  // Filter categories based on search
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) || category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get flat list of all categories for form parent selection
  const getFlatCategories = (cats = categories) => {
    let flat = []
    cats.forEach((cat) => {
      flat.push(cat)
      if (cat.children) {
        flat = flat.concat(getFlatCategories(cat.children))
      }
    })
    return flat
  }

  // Get category statistics
  const getStats = () => {
    const flat = getFlatCategories()
    return {
      total: flat.length,
      published: flat.filter((cat) => cat.status === 'published').length,
      draft: flat.filter((cat) => cat.status === 'draft').length,
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

  // Handle toggle status
  const handleToggleStatus = (category) => {
    const updateCategoryInTree = (cats) => {
      return cats.map((cat) => {
        if (cat.id === category.id) {
          return {
            ...cat,
            status: cat.status === 'published' ? 'draft' : 'published'
          }
        }
        if (cat.children) {
          return {
            ...cat,
            children: updateCategoryInTree(cat.children)
          }
        }
        return cat
      })
    }

    setCategories(updateCategoryInTree(categories))
  }

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingCategory) {
        // Update existing category
        const updateCategoryInTree = (cats) => {
          return cats.map((cat) => {
            if (cat.id === editingCategory.id) {
              return { ...cat, ...formData }
            }
            if (cat.children) {
              return {
                ...cat,
                children: updateCategoryInTree(cat.children)
              }
            }
            return cat
          })
        }

        setCategories(updateCategoryInTree(categories))
        setEditingCategory(null)
      } else {
        // Create new category
        const newCategory = {
          ...formData,
          id: Date.now(),
          children: []
        }

        if (formData.parentId) {
          // Add as child
          const addToParent = (cats) => {
            return cats.map((cat) => {
              if (cat.id === formData.parentId) {
                return {
                  ...cat,
                  children: [...(cat.children || []), newCategory]
                }
              }
              if (cat.children) {
                return {
                  ...cat,
                  children: addToParent(cat.children)
                }
              }
              return cat
            })
          }

          setCategories(addToParent(categories))
        } else {
          // Add as root
          setCategories([...categories, newCategory])
        }

        setParentForNew(null)
      }
    } catch (error) {
      console.error('Failed to save category:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const removeCategoryFromTree = (cats) => {
        return cats.filter((cat) => {
          if (cat.id === categoryToDelete.id) {
            return false
          }
          if (cat.children) {
            cat.children = removeCategoryFromTree(cat.children)
          }
          return true
        })
      }

      setCategories(removeCategoryFromTree(categories))
      setDeleteDialogOpen(false)
      setCategoryToDelete(null)

      // Clear selection if deleted category was selected
      if (selectedCategory?.id === categoryToDelete.id) {
        setSelectedCategory(null)
      }
      if (editingCategory?.id === categoryToDelete.id) {
        setEditingCategory(null)
      }
    } catch (error) {
      console.error('Failed to delete category:', error)
    } finally {
      setLoading(false)
    }
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
          <Tooltip content="Import Categories">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Export Categories">
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
                  <div>
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
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="flex h-[600px] flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Category Tree</CardTitle>
                  <CardDescription>Browse and manage your category hierarchy</CardDescription>
                </div>
                <Badge variant="secondary">{stats.total} items</Badge>
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

            <CardContent className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto">
                <TreeView
                  data={filteredCategories}
                  selectedId={selectedCategory?.id || editingCategory?.id}
                  onSelect={handleSelectCategory}
                  onEdit={handleEditCategory}
                  onDelete={handleDeleteCategory}
                  onAddChild={handleAddChild}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Side - Form or Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          {editingCategory || parentForNew || (!selectedCategory && !editingCategory) ? (
            <CategoryForm
              category={editingCategory}
              parentCategory={parentForNew}
              categories={getFlatCategories()}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setEditingCategory(null)
                setParentForNew(null)
              }}
              loading={loading}
            />
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
                      Edit Category
                    </Button>
                    <Button variant="outline" onClick={() => handleAddChild(selectedCategory)}>
                      Add Subcategory
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
        </motion.div>
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
        loading={loading}
      />
    </div>
  )
}

export default CategoriesPage
