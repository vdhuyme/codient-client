import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const Checkbox = ({ checked = false, onChange, disabled = false, label, className = '', ...props }) => {
  return (
    <label className={`flex cursor-pointer items-center space-x-3 ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <div className="relative">
        <motion.input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only" {...props} />

        <motion.div
          className={`h-5 w-5 rounded border-2 backdrop-blur-sm transition-all duration-200 ${
            checked
              ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500'
              : 'border-indigo-500/30 bg-slate-800/50 hover:border-indigo-500/50'
          } `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0
            }}
            transition={{ duration: 0.2 }}
            className="flex h-full w-full items-center justify-center"
          >
            <Check className="h-3 w-3 text-white" />
          </motion.div>
        </motion.div>
      </div>

      {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
    </label>
  )
}

export default Checkbox
