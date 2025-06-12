import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

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
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      const updatePosition = () => {
        const trigger = triggerRef.current?.parentElement?.querySelector('button')
        if (trigger) {
          const rect = trigger.getBoundingClientRect()
          const scrollY = window.scrollY
          const scrollX = window.scrollX

          let left = rect.left + scrollX
          const top = rect.bottom + scrollY + 8

          if (align === 'end') {
            left = rect.right + scrollX - 192 // 192px = w-48
          } else if (align === 'center') {
            left = rect.left + scrollX + rect.width / 2 - 96 // 96px = w-48/2
          }

          // Ensure dropdown doesn't go off-screen
          const viewportWidth = window.innerWidth
          const dropdownWidth = 192 // w-48 = 12rem = 192px

          if (left + dropdownWidth > viewportWidth) {
            left = viewportWidth - dropdownWidth - 16
          }
          if (left < 16) {
            left = 16
          }

          setPosition({ top, left })
        }
      }

      updatePosition()
      window.addEventListener('scroll', updatePosition)
      window.addEventListener('resize', updatePosition)

      return () => {
        window.removeEventListener('scroll', updatePosition)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isOpen, align])

  const alignmentClasses = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  }

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`min-w-[12rem] rounded-lg border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl ${className}`}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 9999
          }}
        >
          <div className="py-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <div ref={triggerRef} />
      {typeof document !== 'undefined' ? createPortal(dropdownContent, document.body) : dropdownContent}
    </>
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
      className={`flex w-full items-center px-3 py-2 text-left text-sm text-gray-300 transition-colors hover:bg-indigo-500/10 hover:text-indigo-300 ${className}`}
    >
      {children}
    </button>
  )
}

const DropdownMenuSeparator = () => <div className="my-1 h-px bg-indigo-500/20" />

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator }
