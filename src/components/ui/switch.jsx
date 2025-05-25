import { motion } from 'framer-motion'

const Switch = ({ checked = false, onChange, disabled = false, label, className = '', ...props }) => {
  return (
    <label className={`flex cursor-pointer items-center space-x-3 ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}>
      <div className="relative">
        <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} className="sr-only" {...props} />

        <motion.div
          className={`h-6 w-11 rounded-full border-2 transition-all duration-200 ${
            checked ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 to-purple-500' : 'border-slate-600 bg-slate-700'
          } `}
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          <motion.div
            className="h-4 w-4 rounded-full bg-white shadow-lg"
            animate={{
              x: checked ? 18 : 2,
              y: 2
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </div>

      {label && <span className="text-sm font-medium text-gray-300">{label}</span>}
    </label>
  )
}

export default Switch
