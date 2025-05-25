import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Button from './button'

const ConfirmDialog = ({
  open,
  onOpenChange,
  title = 'Confirm Action',
  description = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  loading = false
}) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => onOpenChange?.(false)}
          />

          {/* Dialog content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 mx-4 w-full max-w-md"
          >
            <div className="rounded-xl border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />

              <div className="relative z-10 p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-red-500/20 p-2">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                  <div className="w-full max-w-[300px] break-words">
                    <h3 className="text-lg font-semibold break-words text-white">{title}</h3>
                    <p className="mt-1 text-sm break-words text-gray-400">{description}</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => onOpenChange?.(false)} disabled={loading}>
                    {cancelText}
                  </Button>
                  <Button variant={variant} onClick={onConfirm} loading={loading}>
                    {confirmText}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDialog
