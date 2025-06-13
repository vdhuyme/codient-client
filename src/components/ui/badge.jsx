import { motion } from 'framer-motion'

const Badge = ({ children, variant = 'default', size = 'md', className = '', animated = true, ...props }) => {
  const variants = {
    default: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    success: 'bg-green-500/20 text-green-300 border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    error: 'bg-red-500/20 text-red-300 border-red-500/30',
    secondary: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  const BadgeComponent = animated ? motion.span : 'span'
  const animationProps = animated
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
      }
    : {}

  return (
    <BadgeComponent
      className={`inline-flex items-center rounded-full border font-medium backdrop-blur-sm ${variants[variant]} ${sizes[size]} ${className}`}
      {...animationProps}
      {...props}
    >
      {children}
    </BadgeComponent>
  )
}

export default Badge
