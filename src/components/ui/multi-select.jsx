import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, X, Check } from 'lucide-react'

const MultiSelect = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options',
  disabled = false,
  className = '',
  loading = false,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Normalize values to strings for consistent comparison
  const normalizedValue = Array.isArray(value) ? value.map((v) => v?.toString()) : []

  // Find selected options by comparing normalized values
  const selectedOptions = options.filter((option) => normalizedValue.includes(option.value?.toString()))

  const toggleOption = (optionValue) => {
    const normalizedOptionValue = optionValue?.toString()
    const newValue = normalizedValue.includes(normalizedOptionValue)
      ? value.filter((v) => v?.toString() !== normalizedOptionValue)
      : [...value, optionValue]
    onChange?.(newValue)
  }

  const removeOption = (optionValue, e) => {
    e?.stopPropagation()
    const normalizedOptionValue = optionValue?.toString()
    const newValue = value.filter((v) => v?.toString() !== normalizedOptionValue)
    onChange?.(newValue)
  }

  const handleTriggerClick = (e) => {
    if (e.target.closest('[data-remove-tag]')) {
      return
    }
    if (!disabled && !loading) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`} {...props}>
      <motion.div
        onClick={handleTriggerClick}
        className={`flex w-full cursor-pointer items-center justify-between rounded-lg border border-indigo-500/20 bg-slate-800/50 px-3 py-2 text-left text-sm backdrop-blur-sm transition-all duration-200 focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/20 ${
          disabled || loading ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500/30'
        } min-h-[40px]`}
        whileHover={!disabled && !loading ? { scale: 1.01 } : {}}
        tabIndex={disabled || loading ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!disabled && !loading) {
              setIsOpen(!isOpen)
            }
          }
        }}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {loading ? (
            <span className="text-gray-400">Loading...</span>
          ) : selectedOptions.length > 0 ? (
            selectedOptions.map((option) => (
              <motion.span
                key={`selected-${option.value}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 rounded bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300"
              >
                {option.label}
                {!disabled && !loading && (
                  <span
                    data-remove-tag
                    onClick={(e) => removeOption(option.value, e)}
                    className="cursor-pointer transition-colors hover:text-indigo-100"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        removeOption(option.value, e)
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </span>
                )}
              </motion.span>
            ))
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0 text-gray-400" />
        </motion.div>
      </motion.div>

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
                  const isSelected = normalizedValue.includes(option.value?.toString())
                  return (
                    <motion.button
                      key={`option-${option.value}`}
                      type="button"
                      onClick={() => toggleOption(option.value)}
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

export default MultiSelect
