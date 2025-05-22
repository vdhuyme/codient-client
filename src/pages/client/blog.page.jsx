import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, User, Clock, ChevronRight, Filter, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getPublishedCategories } from '@/api/published.categories'
import { getPublishedPosts } from '@/api/published.post'
import { format } from 'date-fns'

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
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

  const defaultCategories = ['All', 'Technology', 'Design', 'Development', 'Career']

  useEffect(() => {
    const fetchPublishedCategories = async () => {
      try {
        const { categories } = await getPublishedCategories()
        setCategories(categories.length > 0 ? ['All', ...categories.map((category) => category.name)] : defaultCategories)
      } catch (error) {
        setCategories(defaultCategories)
        console.log('Failed to fetch categories')
      }
    }

    const fetchPublishedPosts = async () => {
      try {
        const { posts } = await getPublishedPosts()
        setPosts(posts.length > 0 ? posts : defaultPosts)
      } catch (error) {
        setPosts(defaultPosts)
        console.log('Failed to fetch categories')
      }
    }

    fetchPublishedPosts()
    fetchPublishedCategories()
  }, [])

  const filteredPosts = activeCategory === 'All' ? posts : posts.filter((post) => post.category.name === activeCategory)

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
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
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
              <span className="mr-2 text-sm text-gray-300">Filter:</span>
              <div className="relative inline-block">
                <select className="appearance-none rounded-md border border-indigo-500/30 bg-slate-900/80 px-6 py-2 pl-2 text-white placeholder-gray-400 backdrop-blur-sm focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                  <option>Latest</option>
                  <option>Popular</option>
                  <option>Oldest</option>
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
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-1 text-sm font-medium transition-all cursor-pointer ${
                  activeCategory === category
                    ? 'bg-indigo-500/20 text-indigo-300'
                    : 'bg-slate-800/50 text-gray-400 hover:bg-slate-800 hover:text-gray-300'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </header>

        {/* Blog Posts */}
        <div className="grid gap-8 md:grid-cols-2">
          {filteredPosts.map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-12 flex justify-center"
        >
          <button className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-indigo-500/20">
            Load More
          </button>
        </motion.div>
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
