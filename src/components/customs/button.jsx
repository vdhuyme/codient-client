import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export const Button = ({ children, icon, loading, disabled, variant = 'primary', className, ...props }) => {
  const baseStyles =
    'group relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800'

  const variantStyles = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'border border-indigo-500/30 bg-slate-800/50 hover:border-indigo-500/50 hover:bg-slate-800/80 focus:ring-indigo-500'
  }

  const disabledStyles = disabled || loading ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      type="button"
      disabled={disabled || loading}
      {...props}
      className={cn(baseStyles, variantStyles[variant], disabledStyles, className)}
    >
      {loading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </motion.button>
  )
}
