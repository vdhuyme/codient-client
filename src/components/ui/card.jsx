import { motion } from 'framer-motion'

const Card = ({ children, className = '', hover = true, gradient = false, ...props }) => {
  const gradientClass = gradient ? 'bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50' : 'bg-slate-900/50'

  return (
    <motion.div
      className={`relative overflow-hidden rounded-xl border border-indigo-500/20 ${gradientClass} backdrop-blur-sm ${className} `}
      whileHover={hover ? { y: -2 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />

      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

const CardHeader = ({ children, className = '' }) => <div className={`p-6 pb-4 ${className}`}>{children}</div>

const CardContent = ({ children, className = '' }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>

const CardFooter = ({ children, className = '' }) => <div className={`border-t border-indigo-500/10 p-6 pt-4 ${className}`}>{children}</div>

const CardTitle = ({ children, className = '' }) => <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>

const CardDescription = ({ children, className = '' }) => <p className={`mt-1 text-sm text-gray-400 ${className}`}>{children}</p>

export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription }
