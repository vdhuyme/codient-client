import useEmblaCarousel from 'embla-carousel-react'
import './css/blog.detail.css'

import { motion } from 'framer-motion'
import { Calendar, User, Clock, Facebook, Twitter, Linkedin, LinkIcon, ChevronLeft, Loader, SendHorizonal } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPublishedPost, getPublishedRelatedPost } from '@/api/published.post'
import { format } from 'date-fns'
import { createComment, getPublishedCommentsByPost } from '@/api/published.comments'
import { useAuth } from '@/contexts/auth'
import toast from 'react-hot-toast'
import { TextareaField } from '@/components/customs/form.field'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/customs/button'
import NotFoundPage from '@/pages/error/not.found.page'
import LoadingOverlay from '@/components/customs/loading.overlay'

const BlogDetailPage = () => {
  const [relatedPostCarouselRef] = useEmblaCarousel()

  const defaultPost = {
    title: 'Building Responsive Interfaces with Tailwind CSS',
    excerpt:
      'Learn how to create beautiful, responsive user interfaces using Tailwind CSS, a utility-first CSS framework that can speed up your development workflow.',
    content: `
      <p>Tailwind CSS has revolutionized the way developers approach CSS. Instead of writing custom CSS for each component, Tailwind provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.</p>
      
      <h2>Why Tailwind CSS?</h2>
      
      <p>Traditional CSS frameworks like Bootstrap come with predefined components that often require customization to match your design. This customization can lead to overriding styles and increased CSS bundle size.</p>
      
      <p>Tailwind, on the other hand, gives you the building blocks to create your own designs from scratch, resulting in more unique interfaces without the bloat of unused CSS.</p>
      
      <h2>Getting Started</h2>
      
      <p>To get started with Tailwind CSS, you can install it via npm:</p>
      
      <pre><code>npm install tailwindcss</code></pre>
      
      <p>Then, create a configuration file:</p>
      
      <pre><code>npx tailwindcss init</code></pre>
      
      <h2>Responsive Design with Tailwind</h2>
      
      <p>One of Tailwind's strengths is its approach to responsive design. Instead of creating separate CSS files or complex media queries, you can use responsive prefixes directly in your HTML:</p>
      
      <pre><code>&lt;div class="w-full md:w-1/2 lg:w-1/3"&gt;
  Responsive content
&lt;/div&gt;</code></pre>
      
      <p>This creates an element that's full width on mobile, half width on medium screens, and one-third width on large screens.</p>
      
      <h2>Custom Components</h2>
      
      <p>While Tailwind doesn't provide pre-built components, you can easily create your own reusable components by combining utility classes:</p>
      
      <pre><code>&lt;button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"&gt;
  Button
&lt;/button&gt;</code></pre>
      
      <h2>Optimizing for Production</h2>
      
      <p>Tailwind can generate thousands of utility classes, but for production, you'll want to remove unused CSS. Tailwind integrates with PurgeCSS to scan your HTML and JavaScript files and remove unused styles:</p>
      
      <pre><code>// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  // ...
}</code></pre>
      
      <h2>Conclusion</h2>
      
      <p>Tailwind CSS offers a different approach to styling that can significantly speed up your development workflow. By providing low-level utility classes, it gives you the flexibility to create custom designs without writing custom CSS.</p>
      
      <p>Whether you're building a simple landing page or a complex web application, Tailwind's utility-first approach can help you create responsive, maintainable interfaces with ease.</p>
    `,
    category: {
      name: 'Design'
    },
    author: {
      name: 'Vo Duc Huy',
      avatar: 'https://ui-avatars.com/api/?background=0D8ABC&color=fff',
      email: 'voduchuy2001@gmail.com'
    },
    readTime: '5 min read',
    thumbnail: 'https://placehold.co/1920x1080/1c2d61/ffffff?text=tailwindcss',
    tags: [
      { id: 1, name: 'Tailwind CSS' },
      { id: 2, name: 'CSS' },
      { id: 3, name: 'Frontend' },
      { id: 4, name: 'Responsive Design' },
      { id: 5, name: 'Web Development' }
    ],
    createdAt: '2025-05-21T20:25:56.063Z',
    updatedAt: '2025-05-21T20:25:56.063Z'
  }

  const defaultRelatedPosts = [
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

  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [comments, setComments] = useState([])

  const { slug } = useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const schema = z.object({
    content: z.string().min(3, 'Content at least 3 characters')
  })

  const methods = useForm({
    resolver: zodResolver(schema)
  })
  const { reset } = methods

  const fetchComments = async () => {
    try {
      const { comments } = await getPublishedCommentsByPost(slug)
      setComments(comments)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const fetchPostAndRelated = async () => {
    setIsLoading(true)
    try {
      const [postResult, relatedPostsResult] = await Promise.all([getPublishedPost(slug), getPublishedRelatedPost(slug)])

      setPost(postResult.post || defaultPost)
      setRelatedPosts(relatedPostsResult.relatedPosts.length > 0 ? relatedPostsResult.relatedPosts : defaultRelatedPosts)
    } catch (error) {
      setPost(defaultPost)
      setRelatedPosts(defaultRelatedPosts)
      console.error('Failed to fetch post or related posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPostAndRelated()
    fetchComments()
  }, [slug])

  const onSubmit = async (data) => {
    setIsLoading(true)
    if (!isAuthenticated) {
      toast.error('Login to comment')
      return navigate('/login')
    }

    try {
      await createComment({ content: data.content, slug })
      toast.success('Your comment has been posted')

      await fetchComments()
    } catch (error) {
      console.error('Failed to comment:', error)
    } finally {
      reset()
      setIsLoading(false)
    }
  }

  return isLoading ? (
    <LoadingOverlay />
  ) : post ? (
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

      <div className="container relative z-10 mx-auto max-w-4xl px-4 py-12">
        {/* Back to blog */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <Link to={'/posts'} className="inline-flex items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <header className="mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-4">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">{post?.category.name}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl"
          >
            {post?.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-400"
          >
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4 text-indigo-400" />
              <span>{post?.author.name}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4 text-indigo-400" />
              <span>{format(post?.createdAt || new Date(), 'PPP')}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-indigo-400" />
              <span>{post?.readTime}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative mb-8 h-64 overflow-hidden rounded-lg sm:h-96"
          >
            <img
              src={post?.thumbnail || 'https://placehold.co/1920x1080/1c2d61/ffffff?text=AIGenerative'}
              alt={post?.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
          </motion.div>
        </header>

        {/* Article Content and Additional Info */}
        <div className="space-y-8">
          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="prose prose-invert prose-indigo rounded-lg border border-indigo-500/20 bg-slate-900/50 p-6 backdrop-blur-sm text-gray-400 max-w-full overflow-x-auto break-words [&_img]:max-w-full [&_pre]:break-words [&_table]:block [&_table]:overflow-x-auto scrollbar-hide"
            dangerouslySetInnerHTML={{ __html: post?.content }}
          />

          {/* Additional Info Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm"
          >
            {/* Tags */}
            <div className="border-b border-indigo-500/10 p-6">
              <h3 className="mb-4 text-lg font-medium text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post?.tags.map((tag, index) => (
                  <span
                    key={`tag-${index}`}
                    className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                  >
                    {tag?.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="border-b border-indigo-500/10 p-6">
              <h3 className="mb-4 text-lg font-medium text-white">Share this article</h3>
              <div className="flex space-x-2">
                <SocialShareButton icon={<Facebook className="h-4 w-4" />} />
                <SocialShareButton icon={<Twitter className="h-4 w-4" />} />
                <SocialShareButton icon={<Linkedin className="h-4 w-4" />} />
                <SocialShareButton icon={<LinkIcon className="h-4 w-4" />} />
              </div>
            </div>

            {/* Author */}
            <div className="p-6">
              <h3 className="mb-4 text-lg font-medium text-white">About the Author</h3>
              <div className="flex items-center">
                <div className="w-16 h-16 mr-2">
                  <img
                    src={post?.author.avatar || 'https://ui-avatars.com/api/?background=0D8ABC&color=fff'}
                    alt={post?.author.name}
                    className="mr-4 h-16 w-16 rounded-full border border-indigo-500/20"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-indigo-300">{post?.author.name}</h4>
                  <p className="text-sm text-gray-400">{post?.author.email}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Posts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }} className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Related Articles</h2>
          <div className="relative">
            <div ref={relatedPostCarouselRef} className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex min-w-[20rem] space-x-6">
                {relatedPosts?.map((post, index) => (
                  <div key={`${post.id}-${index}`} className="w-72 flex-none">
                    <RelatedPostCard post={post} index={index} />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="mt-12 rounded-lg border border-indigo-500/20 bg-slate-900/50 p-6 backdrop-blur-sm"
        >
          <h2 className="mb-6 text-2xl font-bold text-white">Comments</h2>
          <div className="space-y-6">
            {comments?.map((comment, index) => (
              <CommentCard
                key={`comment-${index}`}
                user={comment?.user?.name}
                date={comment.createdAt}
                content={comment.content}
                avatar={comment?.user?.avatar ?? 'https://ui-avatars.com/api/?background=0D8ABC&color=fff'}
              />
            ))}
          </div>

          {/* Comment Form */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-medium text-white">Leave a comment</h3>
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <TextareaField name="content" label="Your Comment" placeholder={isAuthenticated ? 'Share your thoughts...' : 'Login to comment'} />
                </div>
                <Button
                  disabled={isLoading}
                  icon={
                    isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <SendHorizonal className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )
                  }
                  type="submit"
                >
                  Post Comment
                </Button>
              </form>
            </FormProvider>
          </div>
        </motion.div>
      </div>
    </div>
  ) : (
    <NotFoundPage />
  )
}

const SocialShareButton = ({ icon }) => (
  <motion.button
    className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 transition-colors hover:bg-indigo-500/20"
    whileHover={{ y: -2 }}
    whileTap={{ y: 0 }}
  >
    {icon}
  </motion.button>
)

const RelatedPostCard = ({ post, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 + (index % 3) * 0.1 }}
    className="group h-full overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-indigo-500/40"
  >
    <Link to={`/posts/${post.slug}`}>
      <div className="relative h-40 overflow-hidden">
        <motion.div className="absolute inset-0 bg-indigo-900/20" whileHover={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        <motion.img
          src={post.thumbnail}
          alt={post.title}
          className="h-full w-full object-cover transition-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-3">
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">{post.category.name}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-base font-bold text-white transition-colors group-hover:text-indigo-300">{post.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{format(post.createdAt, 'PPP')}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.article>
)

const CommentCard = ({ user, date, content, avatar }) => (
  <div className="border-b border-slate-800 pb-6 last:border-0 last:pb-0">
    <div className="mb-2 flex items-start">
      <img src={avatar} alt={user} className="mr-3 h-10 w-10 rounded-full" />
      <div>
        <h4 className="font-medium text-white">{user}</h4>
        <p className="text-xs text-gray-400">{format(date, 'PPP')}</p>
      </div>
    </div>
    <p className="text-sm text-gray-300">{content}</p>
    <div className="mt-2 flex space-x-4">
      <button className="text-xs text-gray-400 hover:text-indigo-300" role="button">
        Report
      </button>
    </div>
  </div>
)

export default BlogDetailPage
