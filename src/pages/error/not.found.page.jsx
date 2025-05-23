import { motion } from 'framer-motion'
import { Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
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

      <div className="relative z-10 container mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-12 text-center">
        {/* 404 Content */}
        <div className="relative">
          {/* Glowing background for 404 */}
          <motion.div
            className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-500/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse'
            }}
          />

          {/* 404 Text */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative mb-4 text-9xl font-bold text-white"
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
              404
            </motion.span>
          </motion.h1>

          {/* Error Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-2xl font-medium text-indigo-300"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-10 max-w-md text-gray-300"
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </motion.p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}>
              <Link to="/">
                <motion.button
                  className="flex items-center rounded-md border border-indigo-500/40 bg-indigo-500/10 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-indigo-500/20"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Animated Elements */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          {/* Animated circles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-indigo-500/20"
              initial={{
                x: '50%',
                y: '50%',
                translateX: '-50%',
                translateY: '-50%',
                width: 100 + i * 100,
                height: 100 + i * 100,
                opacity: 0.1 - i * 0.02
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1 - i * 0.02, 0.15 - i * 0.02, 0.1 - i * 0.02]
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                delay: i * 0.5
              }}
            />
          ))}

          {/* Animated dots */}
          {[...Array(5)].map((_, i) => {
            const angle = (Math.PI * 2 * i) / 5
            const radius = 200
            const x = Math.cos(angle) * radius + window.innerWidth / 2
            const y = Math.sin(angle) * radius + window.innerHeight / 2

            return (
              <motion.div
                key={`dot-${i}`}
                className="absolute h-2 w-2 rounded-full bg-indigo-400"
                initial={{
                  x,
                  y,
                  opacity: 0.5
                }}
                animate={{
                  x: [x, x + Math.random() * 20 - 10],
                  y: [y, y + Math.random() * 20 - 10],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse'
                }}
                style={{
                  boxShadow: '0 0 10px 2px rgba(79, 70, 229, 0.3)'
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
