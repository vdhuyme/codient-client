import { motion } from 'framer-motion'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent hover:from-indigo-600 hover:to-purple-600',
    secondary: 'bg-slate-800/50 text-gray-300 border-indigo-500/20 hover:bg-slate-700/50 hover:text-white hover:border-indigo-500/40',
    outline: 'bg-transparent text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/10 hover:border-indigo-500/50',
    ghost: 'bg-transparent text-gray-300 border-transparent hover:bg-indigo-500/10 hover:text-indigo-300',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent hover:from-red-600 hover:to-red-700'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  }

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-lg border font-medium backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-indigo-500/40 focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className} `}
      whileHover={!disabled ? { y: -1 } : {}}
      whileTap={!disabled ? { y: 0 } : {}}
      {...props}
    >
      {loading && (
        <motion.div
          className="mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
        />
      )}
      {children}
    </motion.button>
  )
}

export default Button
