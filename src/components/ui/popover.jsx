'use client'

import React from 'react'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function Popover({ children, className = '', ...props }) {
  const [open, setOpen] = useState(false)
  const popoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={popoverRef} {...props}>
      <PopoverContext.Provider value={{ open, setOpen }}>{children}</PopoverContext.Provider>
    </div>
  )
}

const PopoverContext = React.createContext({
  open: false,
  setOpen: () => {}
})

export function PopoverTrigger({ children, asChild = false, ...props }) {
  const { open, setOpen } = React.useContext(PopoverContext)

  const handleClick = (e) => {
    e.stopPropagation()
    setOpen(!open)
  }

  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick, ...props })
  }

  return (
    <button type="button" onClick={handleClick} {...props}>
      {children}
    </button>
  )
}

export function PopoverContent({ children, align = 'center', side = 'bottom', sideOffset = 8, className = '', ...props }) {
  const { open } = React.useContext(PopoverContext)

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  }

  const sideClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute z-50 min-w-[8rem] rounded-lg border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl ${sideClasses[side]} ${alignmentClasses[align]} ${className} `}
          style={{ [side === 'top' || side === 'bottom' ? 'margin-top' : 'margin-left']: sideOffset }}
          {...props}
        >
          <div className="p-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
