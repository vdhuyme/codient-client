import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Dialog Components
const Dialog = ({ open, onOpenChange, children, size = 'xl' }) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    xxl: 'max-w-4xl'
  }

  const widthClass = sizeClasses[size] || sizeClasses.md

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange?.(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative z-10 mx-4 w-full ${widthClass}`}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

const DialogContent = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl ${className}`}>
    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
    <div className="relative z-10 p-4">{children}</div>
  </div>
)

const DialogHeader = ({ children, className = '' }) => <div className={`py-6 pb-4 ${className}`}>{children}</div>

const DialogTitle = ({ children, className = '' }) => <h2 className={`text-lg font-semibold text-white ${className}`}>{children}</h2>

const DialogDescription = ({ children, className = '' }) => <p className={`mt-2 text-sm text-gray-400 ${className}`}>{children}</p>

const DialogFooter = ({ children, className = '' }) => (
  <div className={`flex justify-end space-x-3 border-t border-indigo-500/10 py-6 pt-4 ${className}`}>{children}</div>
)

const DialogClose = ({ children, onClose, className = '' }) => (
  <button
    onClick={onClose}
    className={`absolute top-4 right-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300 ${className}`}
  >
    {children || <X className="h-4 w-4" />}
  </button>
)

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose }
