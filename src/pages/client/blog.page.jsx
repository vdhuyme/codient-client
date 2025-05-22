import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, User, Clock, ChevronRight, Filter, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPublishedCategories } from '@/api/published.categories'
import { getPublishedPosts } from '@/api/published.post'
import { format } from 'date-fns'
import LoadingOverlay from '@/components/customs/loading.overlay'
import { useDebounce } from '@/hooks/use.debounce'

const defaultPosts = [
  {
    id: 1,
    title: 'Building Responsive Interfaces with Tailwind CSS',
    excerpt:
      'Learn how to create beautiful, responsive user interfaces using Tailwind CSS, a utility-first CSS framework that can speed up your development workflow.',
    category: {
      name: 'Design'
    },
    author: {
      name: 'Vo Duc Huy'
    },
    readTime: '10 min read',
    thumbnail: 'https://placehold.co/600x400/1c2d61/ffffff?text=tailwindcss',
    slug: 'building-responsive-interfaces-with-tailwind-css',
    createdAt: '2025-05-21T20:25:56.063Z',
    updatedAt: '2025-05-21T20:25:56.063Z'
  },
  {
    id: 2,
    title: 'Getting Started with Next.js and Server Components',
    excerpt:
      'Explore the power of Next.js 13 with Server Components and learn how to build faster, more efficient React applications with improved SEO.',
    category: {
      name: 'Development'
    },
    author: {
      name: 'Vo Duc Huy'
    },
    readTime: '8 min read',
    thumbnail: 'https://placehold.co/600x400/1c2d61/ffffff?text=nextjs',
    slug: 'getting-started-with-nextjs-and-server-components',
    createdAt: '2025-05-21T20:25:56.063Z',
    updatedAt: '2025-05-21T20:25:56.063Z'
  },
  {
    id: 3,
    title: 'The Future of Web Development: AI-Assisted Coding',
    excerpt:
      'Discover how AI tools are transforming the way developers write code, from intelligent code completion to automated testing and debugging.',
    category: {
      name: 'Technology'
    },
    author: {
      name: 'Vo Duc Huy'
    },
    readTime: '10 min read',
    thumbnail: 'https://placehold.co/600x400/1c2d61/ffffff?text=AI',
    slug: 'the-future-of-web-development-ai-assisted-coding',
    createdAt: '2025-05-21T20:25:56.063Z',
    updatedAt: '2025-05-21T20:25:56.063Z'
  },
  {
    id: 4,
    title: 'Mastering TypeScript: Tips and Best Practices',
    excerpt:
      'Take your TypeScript skills to the next level with advanced techniques, best practices, and patterns that will make your code more robust and maintainable.',
    category: {
      name: 'Development'
    },
    author: {
      name: 'Vo Duc Huy'
    },
    readTime: '7 min read',
    thumbnail: 'https://placehold.co/600x400/1c2d61/ffffff?text=typescript',
    slug: 'mastering-typescript-tips-and-best-practices',
    createdAt: '2025-05-21T20:25:56.063Z',
    updatedAt: '2025-05-21T20:25:56.063Z'
  },
  {
    id: 5,
    title: 'From Junior to Senior Developer: A Career Roadmap',
    excerpt:
      'Navigate your career path from junior to senior developer with this comprehensive guide covering technical skills, soft skills, and career strategies.',
    category: {
      name: 'Career'
    },
    author: {
      name: 'Vo Duc Huy'
    },
    readTime: '10 min read',
    thumbnail: 'https://placehold.co/600x400/1c2d61/ffffff?text=roadmap',
    slug: 'from-junior-to-senior-developer-a-career-roadmap',
    createdAt: '2025-05-21T20:25:56.063Z',
    updatedAt: '2025-05-21T20:25:56.063Z'
  }
]

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [limit] = useState(2)
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sort, setSort] = useState('DESC')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [totalPosts, setTotalPosts] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  const debouncedSearch = useDebounce(searchInput, 750)

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value)
  }

  useEffect(() => {
    setQuery(debouncedSearch)
  }, [debouncedSearch])

  // Handle sort change
  const handleSortChange = (e) => {
    const newSort = e.target.value
    setSort(newSort)
  }

  // Handle category change
  const handleCategoryChange = (categoryName) => {
    setActiveCategory(categoryName)
  }

  // Get category ID from category name
  const getCategoryId = useCallback(
    (categoryName) => {
      if (categoryName === 'All') return undefined
      const category = categories.find((cat) => cat.name === categoryName)
      return category?.id
    },
    [categories]
  )

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const { categories: fetchedCategories } = await getPublishedCategories({
        page: 1,
        limit: 100,
        query: '',
        sort: 'ASC'
      })

      if (fetchedCategories && fetchedCategories.length > 0) {
        setCategories([{ id: null, name: 'All' }, ...fetchedCategories])
      } else {
        // Fallback categories with mock IDs
        setCategories([
          { id: null, name: 'All' },
          { id: 1, name: 'Technology' },
          { id: 2, name: 'Design' },
          { id: 3, name: 'Development' },
          { id: 4, name: 'Career' }
        ])
      }
    } catch (error) {
      // Fallback categories with mock IDs
      setCategories([
        { id: null, name: 'All' },
        { id: 1, name: 'Technology' },
        { id: 2, name: 'Design' },
        { id: 3, name: 'Development' },
        { id: 4, name: 'Career' }
      ])
      console.log('Failed to fetch categories')
    }
  }, [])

  // Fetch posts with parameters
  const fetchPosts = useCallback(
    async (pageNum = 1, isLoadMore = false) => {
      if (isLoadMore) {
        setIsLoadingMore(true)
      } else {
        setIsLoading(true)
      }

      try {
        const params = {
          page: pageNum,
          limit,
          query: query.trim(),
          sort,
          categoryId: getCategoryId(activeCategory)
        }

        console.log('Fetching posts with params:', params) // Debug log

        const response = await getPublishedPosts(params)
        console.log('API response:', response) // Debug log

        const { posts: newPosts, total, hasMore: moreAvailable } = response

        if (newPosts && Array.isArray(newPosts) && newPosts.length > 0) {
          if (isLoadMore) {
            // Append new posts to existing ones
            setPosts((prevPosts) => {
              const combinedPosts = [...prevPosts, ...newPosts]
              console.log('Updated posts (load more):', combinedPosts) // Debug log
              return combinedPosts
            })
          } else {
            // Replace posts with new results
            console.log('Setting new posts:', newPosts) // Debug log
            setPosts(newPosts)
          }

          setTotalPosts(total || newPosts.length)

          // Update hasMore based on API response or fallback logic
          if (moreAvailable !== undefined) {
            setHasMore(moreAvailable)
          } else {
            // Fallback: if we got fewer posts than limit, no more posts available
            setHasMore(newPosts.length === limit)
          }
        } else {
          if (!isLoadMore) {
            // If no posts from API and it's not a load more operation
            if (isInitialLoad) {
              // Use default posts only on initial load if API fails
              console.log('Using default posts on initial load')
              setPosts(defaultPosts)
              setTotalPosts(defaultPosts.length)
              setHasMore(false)
            } else {
              // For filter operations, show empty array
              console.log('No posts found for current filters')
              setPosts([])
              setTotalPosts(0)
              setHasMore(false)
            }
          } else {
            // If loading more but no posts returned, no more posts available
            setHasMore(false)
          }
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)

        if (!isLoadMore) {
          if (isInitialLoad) {
            // Use default posts only on initial load if API fails
            setPosts(defaultPosts)
            setTotalPosts(defaultPosts.length)
            setHasMore(false)
          } else {
            // For filter operations, show empty array
            setPosts([])
            setTotalPosts(0)
            setHasMore(false)
          }
        } else {
          // If error while loading more, assume no more posts
          setHasMore(false)
        }
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
        if (isInitialLoad) {
          setIsInitialLoad(false)
        }
      }
    },
    [limit, query, sort, activeCategory, getCategoryId, isInitialLoad]
  )

  // Load more posts
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage, true)
    }
  }

  // Initial load
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Fetch posts when dependencies change (reset pagination)
  useEffect(() => {
    console.log('Dependencies changed, fetching posts...', { query, sort, activeCategory })
    setPage(1) // Reset page to 1
    setHasMore(true) // Reset hasMore when filters change
    fetchPosts(1, false)
  }, [query, sort, activeCategory, fetchPosts])

  return isLoading && isInitialLoad ? (
    <LoadingOverlay />
  ) : (
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

      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-12">
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
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full rounded-md border border-indigo-500/30 bg-slate-900/80 px-4 py-2 pl-10 text-white placeholder-gray-400 backdrop-blur-sm focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
                  className="appearance-none rounded-md border border-indigo-500/30 bg-slate-900/80 px-6 py-2 pl-2 text-white placeholder-gray-400 backdrop-blur-sm focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                >
                  <option value="DESC">Latest</option>
                  <option value="ASC">Oldest</option>
                </select>

                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id || category.name}
                onClick={() => handleCategoryChange(category.name)}
                className={`rounded-full px-4 py-1 text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === category.name
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-gray-300'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>

          {/* Results count */}
          {query && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm text-gray-400">
              {posts.length > 0 ? `Found ${posts.length} article${posts.length !== 1 ? 's' : ''} for "${query}"` : `No articles found for "${query}"`}
            </motion.p>
          )}

          {/* Loading indicator for filtering */}
          {isLoading && !isInitialLoad && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>
            </motion.div>
          )}
        </header>

        {/* Blog Posts */}
        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post, index) => (
              <BlogPostCard key={`${post.id}-${index}`} post={post} index={index} />
            ))}
          </div>
        ) : (
          !isLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                <p>Try adjusting your search terms or browse different categories.</p>
              </div>
            </motion.div>
          )
        )}

        {/* Load More Button */}
        {posts.length > 0 && hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 flex justify-center"
          >
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </motion.div>
        )}

        {/* Posts count info */}
        {posts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center text-sm text-gray-400">
            Showing {posts.length} of {totalPosts} articles
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">{post.category.name}</span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-indigo-300">{post.title}</h2>
        <p className="mb-4 text-sm text-gray-300">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            <span>{post.author.name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{format(post.createdAt, 'PPP')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>{post.readTime}</span>
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
