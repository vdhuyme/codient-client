import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Twitter, Facebook, Instagram, FileText, Sparkles, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import avatar from '@/assets/profile.png'

const HomePage = () => {
  const containerRef = useRef(null)
  const [activeTooltip, setActiveTooltip] = useState(null)
  const [dominantColor, setDominantColor] = useState('rgba(79, 70, 229, 0.3)') // Default indigo color

  useEffect(() => {
    // This would normally use a color extraction library
    // For demo purposes, we'll just use a preset color
    setDominantColor('rgba(79, 70, 229, 0.3)')
  }, [])

  const skills = ['NodeJS', 'React', 'Tailwind CSS', 'ExpressJS', 'Typescript']

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
      <div className="container relative z-10 mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-20 md:flex-row md:items-center md:justify-between md:gap-12 lg:px-8">
        {/* Profile image section with automatic elegant effect */}
        <motion.div
          className="mb-10 md:mb-0 md:w-2/5"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="relative mx-auto">
            {/* Elegant Avatar Design with Automatic Effects */}
            <div className="relative mx-auto h-72 w-72">
              {/* Subtle background glow with automatic animation */}
              <motion.div
                className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500/10 blur-2xl"
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
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden rounded-full">
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
                className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-indigo-400/30"
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
                className="absolute inset-0 rounded-full overflow-hidden border border-white/10"
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
                <img src={avatar} alt="Vo Duc Huy" className="h-full w-full object-cover" />
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
            <p className="leading-relaxed">I craft web apps using NodeJs, React, Tailwind CSS, and beyond.</p>
            <p className="leading-relaxed">
              Always eager to learn and take on new challenges, I aim to contribute to projects that make a real difference.
            </p>
          </motion.div>

          {/* Skills */}
          <motion.div
            className="mt-8 flex flex-wrap justify-center gap-3 md:justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {skills.map((skill, index) => (
              <motion.span
                key={skill}
                className="inline-flex cursor-context-menu items-center rounded-full border border-indigo-500/30 bg-indigo-500/5 px-3 py-1 text-sm font-medium text-indigo-200 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.03,
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderColor: 'rgba(99, 102, 241, 0.4)'
                }}
              >
                <Sparkles className="mr-1.5 h-3 w-3 text-indigo-300" />
                {skill}
              </motion.span>
            ))}
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
            <ActionButton primary label="Explore Articles" icon={<ExternalLink className="ml-2 h-4 w-4" />} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

const SocialButton = ({ icon, label, href, activeTooltip, setActiveTooltip }) => {
  const isExternal = href?.startsWith('http')

  const commonProps = {
    className:
      'flex h-10 w-10 items-center justify-center rounded-full border border-indigo-500/20 bg-indigo-500/5 text-gray-300 backdrop-blur-sm transition-all hover:border-indigo-500/40 hover:text-white',
    onMouseEnter: () => setActiveTooltip(label),
    onMouseLeave: () => setActiveTooltip(null)
  }

  const content = (
    <motion.div
      whileHover={{
        y: -2,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      }}
      whileTap={{ scale: 0.97 }}
    >
      {isExternal ? (
        <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
          {icon}
        </a>
      ) : (
        <Link to={href} {...commonProps}>
          {icon}
        </Link>
      )}
    </motion.div>
  )

  return (
    <div className="relative">
      {content}

      <AnimatePresence>
        {activeTooltip === label && (
          <motion.div
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 transform"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative whitespace-nowrap rounded-md bg-indigo-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {label}
              <div className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 transform bg-indigo-500/90" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Action Button
const ActionButton = ({ label, icon, primary = false }) => {
  return (
    <motion.button
      className={`group relative overflow-hidden rounded-md border ${
        primary ? 'border-indigo-500/40 bg-indigo-500/10 text-white' : 'border-white/10 bg-white/5 text-gray-300'
      } px-5 py-2 text-sm font-medium transition-all hover:text-white`}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
    >
      {/* Subtle hover effect */}
      <motion.span
        className={`absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
          primary ? 'bg-indigo-500/20' : 'bg-white/10'
        }`}
      />

      <span className="flex items-center justify-center">
        {label}
        {icon}
      </span>
    </motion.button>
  )
}

export default HomePage
