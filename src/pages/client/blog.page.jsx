import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, User, Clock, ChevronRight, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', 'Technology', 'Design', 'Development', 'Career']
  const blogPosts = [
    {
      id: 1,
      title: 'Building Responsive Interfaces with Tailwind CSS',
      excerpt:
        'Learn how to create beautiful, responsive user interfaces using Tailwind CSS, a utility-first CSS framework that can speed up your development workflow.',
      category: 'Design',
      author: 'Vo Duc Huy',
      date: 'May 15, 2023',
      readTime: '5 min read',
      image: '/placeholder.svg?height=400&width=600',
      slug: 'building-responsive-interfaces-with-tailwind-css'
    },
    {
      id: 2,
      title: 'Getting Started with Next.js and Server Components',
      excerpt:
        'Explore the power of Next.js 13 with Server Components and learn how to build faster, more efficient React applications with improved SEO.',
      category: 'Development',
      author: 'Vo Duc Huy',
      date: 'April 28, 2023',
      readTime: '8 min read',
      image: '/placeholder.svg?height=400&width=600',
      slug: 'getting-started-with-nextjs-and-server-components'
    },
    {
      id: 3,
      title: 'The Future of Web Development: AI-Assisted Coding',
      excerpt:
        'Discover how AI tools are transforming the way developers write code, from intelligent code completion to automated testing and debugging.',
      category: 'Technology',
      author: 'Vo Duc Huy',
      date: 'April 10, 2023',
      readTime: '6 min read',
      image: '/placeholder.svg?height=400&width=600',
      slug: 'the-future-of-web-development-ai-assisted-coding'
    },
    {
      id: 4,
      title: 'Mastering TypeScript: Tips and Best Practices',
      excerpt:
        'Take your TypeScript skills to the next level with advanced techniques, best practices, and patterns that will make your code more robust and maintainable.',
      category: 'Development',
      author: 'Vo Duc Huy',
      date: 'March 22, 2023',
      readTime: '7 min read',
      image: '/placeholder.svg?height=400&width=600',
      slug: 'mastering-typescript-tips-and-best-practices'
    },
    {
      id: 5,
      title: 'From Junior to Senior Developer: A Career Roadmap',
      excerpt:
        'Navigate your career path from junior to senior developer with this comprehensive guide covering technical skills, soft skills, and career strategies.',
      category: 'Career',
      author: 'Vo Duc Huy',
      date: 'March 5, 2023',
      readTime: '10 min read',
      image: '/placeholder.svg?height=400&width=600',
      slug: 'from-junior-to-senior-developer-a-career-roadmap'
    }
  ]

  const filteredPosts = activeCategory === 'All' ? blogPosts : blogPosts.filter((post) => post.category === activeCategory)

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
              <select className="rounded-md border border-indigo-500/30 bg-slate-900/80 px-2 py-1 text-sm text-white backdrop-blur-sm focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                <option>Latest</option>
                <option>Popular</option>
                <option>Oldest</option>
              </select>
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
                className={`rounded-full px-4 py-1 text-sm font-medium transition-all ${
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
    <Link href={`/posts/${post.slug}`}>
      <div className="relative h-48 overflow-hidden">
        <motion.div className="absolute inset-0 bg-indigo-900/20" whileHover={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        <motion.img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-4">
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">{post.category}</span>
        </div>
      </div>

      <div className="p-6">
        <h2 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-indigo-300">{post.title}</h2>
        <p className="mb-4 text-sm text-gray-300">{post.excerpt}</p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <User className="mr-1 h-3 w-3" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{post.date}</span>
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
