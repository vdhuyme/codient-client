import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, User, Clock, ChevronRight, Filter, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getPublishedCategories } from '@/api/published.categories'
import { getPublishedPosts } from '@/api/published.post'
import { useDebounce } from '@/hooks/use.debounce'
import { dateFormat } from '@/utils/date'

const BlogPage = () => {
  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('DESC')
  const [limit] = useState(15)
  const observerRef = useRef()

  const debouncedSearch = useDebounce(searchInput, 500)

  const handleSearchChange = (e) => setSearchInput(e.target.value)
  const handleSortChange = (e) => setSort(e.target.value)
  const handleCategoryChange = (categoryId) => setActiveCategoryId(categoryId)

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await getPublishedCategories({
        page: 1,
        limit: 15,
        query: '',
        sortBy: 'createdAt',
        orderBy: 'DESC'
      })

      return [{ id: null, name: 'All' }, ...data.items]
    },
    staleTime: 1 * 60 * 1000
  })

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPostsLoading,
    isError: isPostsError
  } = useInfiniteQuery({
    queryKey: ['posts', debouncedSearch, sort, activeCategoryId],
    queryFn: async ({ pageParam = 1 }) => {
      return await getPublishedPosts({
        page: pageParam,
        limit,
        query: debouncedSearch.trim(),
        sort,
        categoryId: activeCategoryId
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasMore !== undefined) {
        return lastPage.hasMore ? allPages.length + 1 : undefined
      }
      if (lastPage.posts?.length < limit) {
        return undefined
      }
      return allPages.length + 1
    },
    enabled: !!categories,
    staleTime: 1 * 60 * 1000,
    gcTime: 1 * 60 * 1000
  })

  const posts = postsData?.pages?.flatMap((page) => page.posts || []) || []
  const totalPosts = postsData?.pages?.[0]?.total || posts.length

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '500px'
      }
    )

    const current = observerRef.current
    if (current) {
      observer.observe(current)
    }

    return () => {
      if (current) {
        observer.unobserve(current)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(79,70,229,0.3),rgba(15,23,42,0.9))]" />
      </div>

      {/* Subtle particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.3 + 0.2,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear'
            }}
            style={{
              boxShadow: `0 0 ${Math.random() * 5 + 2}px ${Math.random() * 1 + 0.5}px rgba(79, 70, 229, 0.3)`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-4 py-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Link to={'/'} className="inline-flex items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        {/* Header */}
        <header className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4 text-4xl font-bold text-white md:text-5xl"
          >
            <motion.span
              initial={{ backgroundPosition: '0% 0%' }}
              animate={{ backgroundPosition: '100% 0%' }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse' }}
              style={{
                backgroundImage: 'linear-gradient(90deg, #fff, #a5b4fc, #fff)',
                backgroundSize: '200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Blog & Insights
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-8 max-w-2xl text-gray-300"
          >
            Explore the latest articles, tutorials, and insights on web development, design, and technology.
          </motion.p>

          {/* Search and Filter */}
          <div className="mx-auto mb-8 flex max-w-2xl flex-col items-center justify-between gap-4 sm:flex-row">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-md"
            >
              <input
                type="search"
                placeholder="Search articles..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-indigo-500/30 bg-slate-900/80 px-4 py-2 pl-10 text-white placeholder-gray-400 backdrop-blur-sm focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none"
              />
              <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex items-center"
            >
              <Filter className="mr-2 h-4 w-4 text-indigo-400" />
              <span className="mr-2 text-sm text-gray-300">Sort:</span>
              <div className="relative inline-block">
                <select
                  value={sort}
                  onChange={handleSortChange}
                  className="appearance-none rounded-md border border-indigo-500/30 bg-slate-900/80 px-10 py-2 pl-6 text-white placeholder-gray-400 backdrop-blur-sm focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none"
                >
                  <option value="DESC">Latest</option>
                  <option value="ASC">Oldest</option>
                </select>

                <div className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-indigo-400">
                  <svg className="mr-1 h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Categories */}
          {categories && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-2"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={`${category.id}-${category.name}-${index}`}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`cursor-pointer rounded-full px-4 py-1 text-sm font-medium transition-all ${
                    activeCategoryId === category.id
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-gray-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                >
                  {category.icon && <span className="mr-1">{category.icon}</span>}
                  {category.name}
                </motion.button>
              ))}
            </motion.div>
          )}
          {/* Results count */}
          {debouncedSearch && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-gray-400">
              {posts.length > 0
                ? `Found ${posts.length} article${posts.length !== 1 ? 's' : ''} for "${debouncedSearch}"`
                : `No articles found for "${debouncedSearch}"`}
            </motion.p>
          )}

          {/* Loading indicator for initial load */}
          {isPostsLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>
            </motion.div>
          )}
        </header>

        {/* Blog Posts */}
        {posts.length > 0 ? (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              {posts.map((post, index) => (
                <BlogPostCard key={`${post.id}-${index}`} post={post} index={index} />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerRef} className="mt-8 flex justify-center">
              {isFetchingNextPage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-indigo-400">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>
                  <span className="text-sm">Loading more articles...</span>
                </motion.div>
              )}
              {!hasNextPage && posts.length > limit && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-gray-400">
                  You've reached the end of articles
                </motion.p>
              )}
            </div>
          </>
        ) : (
          !isPostsLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center">
              <div className="mb-4 text-gray-400">
                <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
                <h3 className="mb-2 text-xl font-semibold">No articles found</h3>
                <p>Try adjusting your search terms or browse different categories.</p>
              </div>
            </motion.div>
          )
        )}

        {/* Posts count info */}
        {posts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center text-sm text-gray-400">
            Showing {posts.length} of {totalPosts} articles
          </motion.div>
        )}

        {/* Error handling */}
        {isPostsError && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center">
            <div className="mb-4 text-red-400">
              <h3 className="mb-2 text-xl font-semibold">Failed to load articles</h3>
              <p>Please try again later or check your connection.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

const BlogPostCard = ({ post, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
    className="group overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-indigo-500/40"
  >
    <Link to={`/posts/${post.slug}`}>
      <div className="relative h-48 overflow-hidden">
        <motion.div className="absolute inset-0 bg-indigo-900/20" whileHover={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        <motion.img
          src={post.thumbnail}
          alt={post.title}
          className="h-full w-full object-cover transition-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">{post.category.name}</span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-indigo-300">{post.title}</h2>
        <p className="mb-4 line-clamp-4 text-sm text-gray-300">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{dateFormat(post.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>{post.readTime} minute(s)</span>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm font-medium text-indigo-400 transition-colors group-hover:text-indigo-300">
          Read More <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  </motion.article>
)

export default BlogPage
