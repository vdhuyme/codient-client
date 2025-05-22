import { motion } from 'framer-motion'

const LoadingOverlay = ({ dominantColor }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm">
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 30%, ${dominantColor}, rgba(15, 23, 42, 0.9))`
        }}
      />

      {/* Subtle floating particles */}
      <div className="absolute inset-0">
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
              repeat: Infinity,
              ease: 'linear'
            }}
            style={{
              boxShadow: `0 0 ${Math.random() * 5 + 2}px ${Math.random() * 1 + 0.5}px rgba(79, 70, 229, 0.3)`
            }}
          />
        ))}
      </div>

      {/* Loading indicator */}
      <motion.div
        className="relative z-10 rounded-full border-4 border-indigo-500 border-t-transparent w-16 h-16 animate-spin"
        aria-label="Loading"
      />
    </div>
  )
}

export default LoadingOverlay
