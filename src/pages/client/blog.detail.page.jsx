'use client'

import { motion } from 'framer-motion'
import { Calendar, User, Clock, Facebook, Twitter, Linkedin, LinkIcon, ChevronLeft, MessageCircle, ThumbsUp, Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'

const BlogDetailPage = () => {
  const post = {
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
    category: 'Design',
    author: 'Vo Duc Huy',
    authorImage: '/placeholder.svg?height=100&width=100',
    authorBio: 'Vo Duc Huy is a senior frontend developer with over 5 years of experience in building responsive web applications.',
    date: 'May 15, 2023',
    readTime: '5 min read',
    image: '/placeholder.svg?height=600&width=1200',
    tags: ['Tailwind CSS', 'CSS', 'Frontend', 'Responsive Design', 'Web Development']
  }

  // Related posts
  const relatedPosts = [
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
    }
  ]

  const scrollbarHideStyle = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <style jsx global>
        {scrollbarHideStyle}
      </style>
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
          <Link href="/blog" className="inline-flex items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Blog
          </Link>
        </motion.div>

        {/* Article Header */}
        <header className="mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-4">
            <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">{post.category}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl"
          >
            {post.title}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 flex flex-wrap items-center gap-4 text-sm text-gray-400"
          >
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4 text-indigo-400" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4 text-indigo-400" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4 text-indigo-400" />
              <span>{post.readTime}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative mb-8 h-64 overflow-hidden rounded-lg sm:h-96"
          >
            <img src={post.image || '/placeholder.svg'} alt={post.title} className="h-full w-full object-cover" />
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
            className="prose prose-invert prose-indigo max-w-none rounded-lg border border-indigo-500/20 bg-slate-900/50 p-6 backdrop-blur-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Additional Info Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm"
          >
            {/* Article Actions */}
            <div className="flex justify-between border-b border-indigo-500/10 p-4">
              <button className="flex items-center text-sm text-gray-400 transition-colors hover:text-indigo-300">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>Like</span>
              </button>
              <button className="flex items-center text-sm text-gray-400 transition-colors hover:text-indigo-300">
                <MessageCircle className="mr-1 h-4 w-4" />
                <span>Comment</span>
              </button>
              <button className="flex items-center text-sm text-gray-400 transition-colors hover:text-indigo-300">
                <Bookmark className="mr-1 h-4 w-4" />
                <span>Save</span>
              </button>
            </div>

            {/* Tags */}
            <div className="border-b border-indigo-500/10 p-6">
              <h3 className="mb-4 text-lg font-medium text-white">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                    {tag}
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
                <img
                  src={post.authorImage || '/placeholder.svg'}
                  alt={post.author}
                  className="mr-4 h-16 w-16 rounded-full border border-indigo-500/20"
                />
                <div>
                  <h4 className="font-medium text-indigo-300">{post.author}</h4>
                  <p className="text-sm text-gray-400">{post.authorBio}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Posts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1 }} className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-white">Related Articles</h2>
          <div className="relative">
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex w-max space-x-6">
                {[...relatedPosts, ...relatedPosts, ...relatedPosts].map((post, index) => (
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
          <h2 className="mb-6 text-2xl font-bold text-white">Comments (3)</h2>
          <div className="space-y-6">
            <CommentCard
              author="Alex Johnson"
              date="May 16, 2023"
              content="Great article! I've been using Tailwind CSS for a few months now and it has significantly improved my workflow. The utility-first approach makes so much sense once you get used to it."
              avatar="/placeholder.svg?height=50&width=50"
            />
            <CommentCard
              author="Sarah Miller"
              date="May 17, 2023"
              content="Thanks for the detailed explanation. I was skeptical about Tailwind at first, but after reading this I'm going to give it a try on my next project."
              avatar="/placeholder.svg?height=50&width=50"
            />
            <CommentCard
              author="David Chen"
              date="May 18, 2023"
              content="I'd love to see a follow-up article about integrating Tailwind with component libraries like Headless UI or Radix. That combination is really powerful for building accessible interfaces quickly."
              avatar="/placeholder.svg?height=50&width=50"
            />
          </div>

          {/* Comment Form */}
          <div className="mt-8">
            <h3 className="mb-4 text-lg font-medium text-white">Leave a comment</h3>
            <div className="mb-4">
              <textarea
                className="w-full rounded-md border border-indigo-500/30 bg-slate-900/80 p-3 text-white placeholder-gray-400 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
                rows="4"
                placeholder="Share your thoughts..."
              ></textarea>
            </div>
            <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
              Post Comment
            </button>
          </div>
        </motion.div>
      </div>
    </div>
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
    <Link href={`/blog/${post.slug}`}>
      <div className="relative h-40 overflow-hidden">
        <motion.div className="absolute inset-0 bg-indigo-900/20" whileHover={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        <motion.img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-transparent p-3">
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">{post.category}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-base font-bold text-white transition-colors group-hover:text-indigo-300">{post.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{post.date}</span>
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

const CommentCard = ({ author, date, content, avatar }) => (
  <div className="border-b border-slate-800 pb-6 last:border-0 last:pb-0">
    <div className="mb-2 flex items-start">
      <img src={avatar || '/placeholder.svg'} alt={author} className="mr-3 h-10 w-10 rounded-full" />
      <div>
        <h4 className="font-medium text-white">{author}</h4>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </div>
    <p className="text-sm text-gray-300">{content}</p>
    <div className="mt-2 flex space-x-4">
      <button className="text-xs text-gray-400 hover:text-indigo-300">Reply</button>
      <button className="text-xs text-gray-400 hover:text-indigo-300">Like</button>
    </div>
  </div>
)

export default BlogDetailPage
