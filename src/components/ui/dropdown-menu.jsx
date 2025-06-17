import React from 'react'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>{children}</DropdownMenuContext.Provider>
    </div>
  )
}

const DropdownMenuContext = React.createContext()

const DropdownMenuTrigger = ({ children, asChild = false }) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)

  const handleClick = (e) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick })
  }

  return <button onClick={handleClick}>{children}</button>
}

const DropdownMenuContent = ({ children, align = 'start', className = '' }) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext)

  const alignmentClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-full z-50 mt-2 min-w-[8rem] rounded-lg border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl ${alignmentClasses[align]} ${className} `}
        >
          <div className="py-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const DropdownMenuItem = ({ children, onClick, className = '' }) => {
  const { setIsOpen } = React.useContext(DropdownMenuContext)

  const handleClick = (e) => {
    e.stopPropagation()
    onClick?.(e)
    setIsOpen(false)
  }

  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-center px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300 ${className} `}
    >
      {children}
    </button>
  )
}

const DropdownMenuSeparator = () => <div className="my-1 h-px bg-indigo-500/20" />

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }
