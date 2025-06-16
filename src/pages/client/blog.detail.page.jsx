import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import {
  Calendar,
  User,
  Clock,
  Facebook,
  Linkedin,
  LinkIcon,
  ChevronLeft,
  Loader,
  SendHorizonal,
  FlagIcon,
  Twitter,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TextareaField } from '@/components/customs/form.field'
import { Button } from '@/components/customs/button'
import { dateFormat } from '@/utils/date'
import { useBlogDetail } from '@/hooks/use.blog.detail'
import { usePublishedComments, usePublishedCommentMutations } from '@/hooks/use.published.comments'
import toast from 'react-hot-toast'
import NotFoundPage from '@/pages/error/not.found.page'
import LoadingOverlay from '@/components/customs/loading.overlay'
import { useState } from 'react'
import Pagination from '@/components/ui/pagination'
import { COMMENT_SCHEMA } from './schema/comment.schema'

const BlogDetailPage = () => {
  const { id } = useParams()
  const [relatedPostCarouselRef] = useEmblaCarousel()
  const [commentPage, setCommentPage] = useState(1)
  const [commentSort, setCommentSort] = useState({ sortBy: 'createdAt', orderBy: 'DESC' })

  const methods = useForm({
    resolver: zodResolver(COMMENT_SCHEMA)
  })
  const { reset } = methods

  const { post, relatedPosts = [], isLoading } = useBlogDetail(id)
  const { data: commentsData, isLoading: commentsLoading } = usePublishedComments(id, {
    page: commentPage,
    limit: 5,
    ...commentSort
  })
  const { createComment } = usePublishedCommentMutations(id)

  const handleSubmitComment = async (data) => {
    try {
      await createComment.mutateAsync({ content: data.content, id })
      reset()
    } catch (error) {
      console.error('Failed to submit comment:', error)
    }
  }

  const handlePageChange = (page) => {
    setCommentPage(page)
  }

  const handleSortChange = () => {
    setCommentSort((prev) => ({
      sortBy: 'createdAt',
      orderBy: prev.orderBy === 'DESC' ? 'ASC' : 'DESC'
    }))
    setCommentPage(1)
  }

  const postUrl = typeof window !== 'undefined' ? window.location.href : ''

  if (isLoading) {
    return <LoadingOverlay />
  }

  if (!post) {
    return <NotFoundPage />
  }

  return (
    post && (
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

        <div className="relative z-10 container mx-auto max-w-4xl px-4 py-12">
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
                <span>{dateFormat(post?.createdAt || new Date())}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4 text-indigo-400" />
                <span>{post?.readTime} minute(s)</span>
              </div>
            </motion.div>
          </header>

          {/* Article Content and Additional Info */}
          <div className="space-y-8">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="prose prose-invert prose-indigo scrollbar-hide max-w-full overflow-x-auto rounded-lg border border-indigo-500/20 bg-slate-900/50 p-6 break-words text-gray-400 backdrop-blur-sm [&_img]:max-w-full [&_pre]:break-words [&_table]:block [&_table]:overflow-x-auto"
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
                  <SocialShareButton type="facebook" url={postUrl} icon={<Facebook className="h-4 w-4" />} />
                  <SocialShareButton type="linkedin" url={postUrl} icon={<Linkedin className="h-4 w-4" />} />
                  <SocialShareButton type="twitter" url={postUrl} icon={<Twitter className="h-4 w-4" />} />
                  <SocialShareButton type="copy" url={postUrl} icon={<LinkIcon className="h-4 w-4" />} />
                </div>
              </div>

              {/* Author */}
              <div className="p-6">
                <h3 className="mb-4 text-lg font-medium text-white">About the Author</h3>
                <div className="flex items-center">
                  <div className="mr-2 h-16 w-16">
                    <img
                      src={
                        post?.author.avatar ||
                        `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${post?.author.name}&bold=true&background=random`
                      }
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
              <div ref={relatedPostCarouselRef} className="scrollbar-hide overflow-x-auto pb-4">
                <div className="flex min-w-[20rem] space-x-6">
                  {relatedPosts.length > 0 ? (
                    relatedPosts?.map((post, index) => (
                      <div key={`${post.id}-${index}`} className="w-72 flex-none">
                        <RelatedPostCard post={post} index={index} />
                      </div>
                    ))
                  ) : (
                    <div className="text-center font-semibold text-white">Not found related posts</div>
                  )}
                </div>
              </div>
              <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-12 rounded-lg border border-indigo-500/20 bg-slate-900/50 p-6 backdrop-blur-sm"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Comments</h2>
              <div onClick={handleSortChange} className="flex cursor-pointer items-center space-x-1 text-sm text-gray-400 hover:text-white">
                <span>Sort by Date</span>
                {commentSort.orderBy === 'DESC' ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </div>
            </div>

            <div className="space-y-6">
              {commentsData?.items?.map((comment, index) => (
                <CommentCard
                  key={`comment-${index}`}
                  user={comment?.user?.name}
                  date={comment.createdAt}
                  content={comment.content}
                  avatar={
                    comment?.user?.avatar ??
                    `https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${comment?.user?.name}&bold=true&background=random`
                  }
                />
              ))}

              {commentsLoading && (
                <div className="flex justify-center py-4">
                  <Loader className="h-6 w-6 animate-spin text-indigo-400" />
                </div>
              )}

              {commentsData?.meta && commentsData.meta.totalPages > 1 && (
                <div className="mt-6">
                  <Pagination currentPage={commentsData.meta.currentPage} totalPages={commentsData.meta.totalPages} onPageChange={handlePageChange} />
                </div>
              )}
            </div>

            {/* Comment Form */}
            <div className="mt-8">
              <h3 className="mb-4 text-lg font-medium text-white">Leave a comment</h3>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSubmitComment)}>
                  <div className="mb-4">
                    <TextareaField name="content" label="Your Comment" placeholder={'Share your thoughts...'} />
                  </div>
                  <Button
                    disabled={createComment.isPending}
                    icon={
                      createComment.isPending ? (
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
    )
  )
}

const SocialShareButton = ({ icon, type, url }) => {
  const shareHandlers = {
    facebook: (url) => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'),
    linkedin: (url) => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank'),
    twitter: (url) => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank'),
    copy: (url) => {
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleClick = () => {
    const handler = shareHandlers[type]
    if (handler) handler(url)
  }

  return (
    <motion.button
      onClick={handleClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-300 transition-colors hover:bg-indigo-500/20"
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
    >
      {icon}
    </motion.button>
  )
}

const RelatedPostCard = ({ post, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 + (index % 3) * 0.1 }}
    className="group h-full overflow-hidden rounded-lg border border-indigo-500/20 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-indigo-500/40"
  >
    <Link to={`/posts/${post.id}/${post.slug}`}>
      <div className="relative h-40 overflow-hidden">
        <motion.div className="absolute inset-0 bg-indigo-900/20" whileHover={{ opacity: 0 }} transition={{ duration: 0.3 }} />
        <motion.img
          src={post.thumbnail}
          alt={post.title}
          className="h-full w-full object-cover transition-transform"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-slate-900 to-transparent p-3">
          <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs font-medium text-indigo-300">{post.category.name}</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="mb-2 text-base font-bold text-white transition-colors group-hover:text-indigo-300">{post.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3 w-3" />
            <span>{dateFormat(post.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1 h-3 w-3" />
            <span>{post.readTime} minute(s)</span>
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
        <p className="text-xs text-gray-400">{dateFormat(date)}</p>
      </div>
    </div>
    <p className="text-sm text-gray-300">{content}</p>
    <div className="mt-2 flex space-x-4">
      <button className="text-xs text-red-500 hover:text-red-300" role="button" onClick={() => toast.error('This feature is under development')}>
        <div className="flex items-center">
          Report <FlagIcon className="mx-2 h-3 w-3" />
        </div>
      </button>
    </div>
  </div>
)

export default BlogDetailPage
