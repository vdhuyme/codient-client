import { useEffect, useState } from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { getCategories } from '@/api/category'
import FormInput from '@/components/layouts/ui/form-input'
import FormEditor from '@/components/layouts/ui/form-editor'

const flattenCategories = (categories, depth = 0) => {
  return categories.flatMap((cat) => [{ ...cat, depth }, ...flattenCategories(cat.children || [], depth + 1)])
}

const PostForm = ({ post = null, isEdit = false }) => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.slug || '',
      content: post?.content || '',
      categories: post?.categories?.map((c) => c.id) || [] // Mảng ID
    }
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors }
  } = methods

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      try {
        const { categories } = await getCategories()
        setCategories(categories)
      } catch (error) {
        setCategories([])
        console.log('Failed to fetch categories, ', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const onSubmit = (data) => {
    console.log('Submit Post:', data)
    // TODO: send to API
  }

  const handleCategoryToggle = (id, checked, value) => {
    const current = [...value]
    if (checked) {
      if (!current.includes(id)) {
        current.push(id)
      }
    } else {
      const index = current.indexOf(id)
      if (index > -1) {
        current.splice(index, 1)
      }
    }
    return current
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid">
          <div className="form-group mb-4">
            <FormInput name="title" label="Tiêu đề" control={control} register={register('name')} error={errors.name} />
          </div>
          <div className="form-group mb-4">
            <FormInput name="slug" label="Slug" control={control} register={register('slug')} error={errors.slug} />
          </div>

          <div className="form-group mb-4">
            <FormEditor name="content" label="Nội dung" control={control} register={register('content')} error={errors.content} />
          </div>

          <div>
            <label className="font-semibold">Danh mục</label>
            {isLoading ? (
              <p>Đang tải danh mục...</p>
            ) : (
              <Controller
                control={control}
                name="categories"
                render={({ field: { value, onChange } }) => (
                  <div className="category-tree-checkboxes">
                    {flattenCategories(categories).map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2" style={{ marginLeft: cat.depth * 20 }}>
                        <input
                          type="checkbox"
                          checked={value?.includes(cat.id)}
                          onChange={(e) => onChange(handleCategoryToggle(cat.id, e.target.checked, value))}
                        />
                        {cat.name}
                      </label>
                    ))}
                  </div>
                )}
              />
            )}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {isEdit ? 'Cập nhật bài viết' : 'Tạo bài viết'}
        </button>
      </form>
    </FormProvider>
  )
}

export default PostForm
