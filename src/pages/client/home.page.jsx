import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Github, Twitter, Facebook, Instagram, FileText, ExternalLink, FolderCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import avatar from '@/assets/profile.png'
import toast from 'react-hot-toast'
import { Lens } from '@/components/magicui/lens'

const HomePage = () => {
  const containerRef = useRef(null)
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [dominantColor, setDominantColor] = useState('rgba(79, 70, 229, 0.3)')

  useEffect(() => {
    setDominantColor('rgba(79, 70, 229, 0.3)')
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950" ref={containerRef}>
      {/* Subtle gradient background */}
      <div
        className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 to-slate-900"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, ${dominantColor}, rgba(15, 23, 42, 0.9))`
        }}
      />
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
      {/* Main content */}
      <div className="relative z-10 container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-20 md:flex-row md:items-center md:justify-between md:gap-12 lg:px-8">
        {/* Profile image section with automatic elegant effect */}
        <motion.div
          className="mb-10 md:mb-0 md:w-2/5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative mx-auto">
            {/* Elegant Avatar Design with Automatic Effects */}
            <div className="relative mx-auto h-48 w-48 md:h-72 md:w-72">
              {/* Subtle background glow with automatic animation */}
              <motion.div
                className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500/10 blur-2xl md:h-64 md:w-64"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.3, 0.2]
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse'
                }}
              />

              {/* Elegant rotating border */}
              <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full md:h-64 md:w-64">
                <motion.div
                  className="absolute inset-0 rounded-full border border-indigo-300/20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear'
                  }}
                />

                {/* Gradient overlay with automatic animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10"
                  animate={{
                    backgroundPosition: ['0% center', '100% center', '0% center']
                  }}
                  transition={{
                    duration: 15,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear'
                  }}
                  style={{
                    backgroundSize: '200% 100%'
                  }}
                />
              </div>

              {/* Animated border light effect */}
              <motion.div
                className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-indigo-400/30 md:h-64 md:w-64"
                animate={{
                  boxShadow: ['0 0 0 0px rgba(79, 70, 229, 0)', '0 0 0 2px rgba(79, 70, 229, 0.2)', '0 0 0 0px rgba(79, 70, 229, 0)']
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'loop'
                }}
              />

              {/* Avatar image with automatic subtle movement */}
              <motion.div
                className="absolute inset-0 overflow-hidden rounded-full border border-white/10"
                animate={{
                  y: ['0%', '-2%', '0%', '2%', '0%'],
                  x: ['0%', '1%', '0%', '-1%', '0%']
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  repeatType: 'loop'
                }}
              >
                <Lens>
                  <img src={avatar} alt="Vo Duc Huy" className="h-full w-full object-cover" />
                </Lens>
              </motion.div>

              {/* Animated light dots around avatar */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400"
                  initial={{
                    x: Math.cos((i * Math.PI * 2) / 3) * 120 + 144,
                    y: Math.sin((i * Math.PI * 2) / 3) * 120 + 144,
                    opacity: 0.5
                  }}
                  animate={{
                    x: [
                      Math.cos((i * Math.PI * 2) / 3) * 120 + 144,
                      Math.cos((i * Math.PI * 2) / 3 + 0.1) * 125 + 144,
                      Math.cos((i * Math.PI * 2) / 3) * 120 + 144
                    ],
                    y: [
                      Math.sin((i * Math.PI * 2) / 3) * 120 + 144,
                      Math.sin((i * Math.PI * 2) / 3 + 0.1) * 125 + 144,
                      Math.sin((i * Math.PI * 2) / 3) * 120 + 144
                    ],
                    opacity: [0.5, 0.8, 0.5],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: 'loop'
                  }}
                  style={{
                    boxShadow: '0 0 5px 2px rgba(79, 70, 229, 0.3)'
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content section */}
        <motion.div
          className="text-center md:w-3/5 md:text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
            <h2 className="text-lg font-light tracking-wide text-indigo-300">
              Hi, I&apos;m{' '}
              <span role="img" aria-label="wave">
                👋
              </span>
            </h2>
            <motion.h1
              className="text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <span className="inline-block">
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
                  Vo Duc Huy
                </motion.span>
              </span>
            </motion.h1>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-4">
            <h3 className="text-xl font-medium text-gray-200">
              I&apos;m a{' '}
              <motion.span className="relative inline-block">
                <motion.span
                  className="relative z-10 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text font-semibold text-transparent"
                  animate={{
                    backgroundPosition: ['0% center', '100% center', '0% center']
                  }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: 'loop'
                  }}
                  style={{
                    backgroundSize: '200% auto'
                  }}
                >
                  Software Engineer
                </motion.span>
                <motion.span
                  className="absolute bottom-0 left-0 z-0 h-2 w-full"
                  style={{ background: `linear-gradient(90deg, ${dominantColor}, rgba(124, 58, 237, 0.3))` }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                />
              </motion.span>
            </h3>
          </motion.div>

          <motion.div
            className="mt-6 space-y-4 text-lg text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <p className="leading-relaxed">
              I specialize in building robust web applications with a focus on backend systems — leveraging Node.js, TypeScript, and modern
              frameworks.
            </p>
            <p className="leading-relaxed">
              Passionate about scalable architecture, clean APIs, and developer experience. Always eager to learn and bring real value through code.
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-5 md:justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <SocialButton
              icon={<FileText className="h-5 w-5" />}
              label="Resume"
              href="/resume"
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
            <SocialButton
              icon={<Github className="h-5 w-5" />}
              label="GitHub"
              href="https://github.com/vdhuyme"
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
            <SocialButton
              icon={<Twitter className="h-5 w-5" />}
              label="Twitter"
              href="https://x.com/vdh_me"
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
            <SocialButton
              icon={<Facebook className="h-5 w-5" />}
              label="Facebook"
              href="https://www.facebook.com/VDH.me"
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
            <SocialButton
              icon={<Instagram className="h-5 w-5" />}
              label="Instagram"
              href="https://www.instagram.com/vd.huy"
              activeTooltip={activeTooltip}
              setActiveTooltip={setActiveTooltip}
            />
          </motion.div>

          {/* Elegant Action buttons */}
          <motion.div
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row md:justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            <ActionButton primary label="Read My Thoughts" to={'/posts'} icon={<ExternalLink className="ml-2 h-4 w-4" />} />
            <ActionButton
              label="Things I’ve Built"
              onClick={() => toast.error('This feature is under development.')}
              icon={<FolderCheck className="ml-2 h-4 w-4" />}
            />
          </motion.div>
        </motion.div>
      </div>

      <footer className="text-center text-sm text-gray-500 md:pointer-events-auto md:fixed md:bottom-0 md:left-0 md:z-[9999] md:w-full">
        <p>
          Built by{' '}
          <Link to="/admin/stats" className="relative z-10 font-medium transition-colors hover:text-indigo-400">
            Vo Duc Huy
          </Link>
          — &copy; {new Date().getFullYear()} All rights reserved.
        </p>
      </footer>
    </div>
  )
}

const SocialButton = ({ icon, label, href }) => {
  const isExternal = href?.startsWith('http')

  const baseClass =
    'inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-2 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all hover:border-indigo-500/40 hover:text-indigo-100 hover:border-indigo-400 hover:bg-indigo-500/10'

  const content = (
    <motion.div
      whileHover={{
        y: -2,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.97 }}
    >
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={baseClass}>
          <span className="text-base">{icon}</span>
          <span>{label}</span>
        </a>
      ) : (
        <Link to={href} className={baseClass}>
          <span className="text-base">{icon}</span>
          <span>{label}</span>
        </Link>
      )}
    </motion.div>
  )

  return <div>{content}</div>
}

// Action Button
const ActionButton = ({ label, icon, to, primary = false, ...props }) => {
  const baseClasses =
    'group relative overflow-hidden rounded-md border px-5 py-2 text-sm font-medium transition-all hover:text-indigo-100 hover:border-indigo-400 hover:bg-indigo-500/10'
  const primaryStyle = 'border-indigo-500/40 bg-indigo-500/10 text-white'
  const secondaryStyle = 'border-indigo-500/20 bg-indigo-500/5 text-indigo-200'

  return (
    <motion.button {...props} className={`${baseClasses} ${primary ? primaryStyle : secondaryStyle}`} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
      {/* Hover overlay */}
      <motion.span
        className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          primary ? 'bg-indigo-500/20' : 'bg-indigo-500/10'
        }`}
      />
      <Link to={to} className="flex items-center justify-center gap-2">
        {label}
        {icon}
      </Link>
    </motion.button>
  )
}

export default HomePage
