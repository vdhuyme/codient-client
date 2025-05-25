import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const Select = ({ options = [], value, onChange, placeholder = 'Select an option', disabled = false, className = '', loading = false, ...props }) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Fixed: Use 'e.target' instead of 'event.target'
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Convert value to string for comparison (handles both string and number values)
  const normalizedValue = value?.toString()
  const selectedOption = options.find((option) => option.value?.toString() === normalizedValue)

  return (
    <div ref={wrapperRef} className={`relative ${className}`} {...props}>
      <motion.button
        type="button"
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        disabled={disabled || loading}
        className={`flex w-full items-center justify-between rounded-lg border border-indigo-500/20 bg-slate-800/50 px-3 py-2 text-left text-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
          disabled || loading ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500/30'
        } `}
        whileHover={!disabled && !loading ? { scale: 1.01 } : {}}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
          {loading ? 'Loading...' : selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && !loading && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 left-0 z-50 mt-2 rounded-lg border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl"
          >
            <div className="scrollbar-hide max-h-60 overflow-auto py-2">
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-400">No options available</div>
              ) : (
                options.map((option) => {
                  const isSelected = option.value?.toString() === normalizedValue
                  return (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onChange?.(option.value)
                        setIsOpen(false)
                      }}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-indigo-500/10"
                      whileHover={{ x: 4 }}
                    >
                      <span className={isSelected ? 'text-indigo-300' : 'text-gray-300'}>{option.label}</span>
                      {isSelected && <Check className="h-4 w-4 text-indigo-400" />}
                    </motion.button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Select
