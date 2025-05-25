import { motion } from 'framer-motion'
import { User } from 'lucide-react'

const Avatar = ({ src, alt, size = 'md', fallback, className = '', showBorder = false, animated = true }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  const borderClass = showBorder ? 'p-0.5 bg-gradient-to-r from-indigo-400 to-purple-400' : ''

  const AvatarComponent = animated ? motion.div : 'div'
  const animationProps = animated
    ? {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 }
      }
    : {}

  return (
    <AvatarComponent className={`${sizeClasses[size]} ${borderClass} rounded-full ${className}`} {...animationProps}>
      <div
        className={`${showBorder ? 'h-full w-full' : sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full bg-slate-800`}
      >
        {src ? (
          <img src={src || '/placeholder.svg'} alt={alt || 'Avatar'} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300">
            {fallback || <User className="h-1/2 w-1/2" />}
          </div>
        )}
      </div>
    </AvatarComponent>
  )
}

export default Avatar
