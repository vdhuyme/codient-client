'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Search, X } from 'lucide-react'

const Combobox = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  searchable = true,
  clearable = true,
  className = '',
  renderOption,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const selectedOption = options.find((option) => option.value === value)

  const filteredOptions = searchable ? options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase())) : options

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen && searchable) {
        setTimeout(() => {
          inputRef.current?.focus()
        }, 100)
      }
    }
  }

  const handleSelect = (option) => {
    onChange?.(option.value)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange?.(null)
    setSearchQuery('')
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef} {...props}>
      <motion.button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`flex w-full items-center justify-between rounded-lg border border-indigo-500/20 bg-slate-800/50 px-3 py-2 text-left text-sm backdrop-blur-sm transition-all duration-200 focus:border-indigo-500/40 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-indigo-500/30'} `}
        whileHover={!disabled ? { scale: 1.01 } : {}}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isOpen && searchable ? (
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-none bg-transparent text-white placeholder-gray-400 outline-none"
              placeholder="Search..."
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className={selectedOption ? 'text-white' : 'text-gray-400'}>{selectedOption ? selectedOption.label : placeholder}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {selectedOption && clearable && !isOpen && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1 text-gray-400 hover:text-gray-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 left-0 z-50 mt-2 rounded-lg border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl"
          >
            {searchable && !isOpen && (
              <div className="border-b border-indigo-500/20 p-2">
                <div className="relative">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-indigo-500/20 bg-slate-800/50 py-2 pr-4 pl-10 text-sm text-white placeholder-gray-400 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none"
                    placeholder="Search..."
                  />
                </div>
              </div>
            )}

            <div className="max-h-60 overflow-auto py-2">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-indigo-500/10"
                    whileHover={{ x: 4 }}
                  >
                    {renderOption ? (
                      renderOption(option, option.value === value)
                    ) : (
                      <>
                        <span className={option.value === value ? 'text-indigo-300' : 'text-gray-300'}>{option.label}</span>
                        {option.value === value && <Check className="h-4 w-4 text-indigo-400" />}
                      </>
                    )}
                  </motion.button>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-gray-400">
                  <div className="mb-2">🔍</div>
                  <p className="text-sm">No results found</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Combobox
