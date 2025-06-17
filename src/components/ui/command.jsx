'use client'

import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, CommandIcon, X } from 'lucide-react'
import { createPortal } from 'react-dom'

const CommandContext = createContext({
  open: false,
  setOpen: () => {},
  search: '',
  setSearch: () => {}
})

export function CommandProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const value = {
    open,
    setOpen,
    search,
    setSearch
  }

  return (
    <CommandContext.Provider value={value}>
      {children}
      {mounted && createPortal(<CommandDialog />, document.body)}
    </CommandContext.Provider>
  )
}

export function useCommand() {
  const context = useContext(CommandContext)
  if (!context) {
    throw new Error('useCommand must be used within a CommandProvider')
  }
  return context
}

function CommandDialog() {
  const { open, setOpen, search, setSearch } = useCommand()
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      document.body.style.overflow = ''
      setSearch('')
    }

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, setOpen, setSearch])

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/3 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2"
          >
            <div className="overflow-hidden rounded-xl border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl">
              <div className="relative">
                <Search className="absolute top-4 left-4 h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border-b border-indigo-500/20 bg-transparent py-4 pr-4 pl-12 text-white placeholder-gray-400 focus:outline-none"
                  placeholder="Type a command or search..."
                />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <kbd className="rounded border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-xs text-gray-400">ESC</kbd>
                  <button onClick={() => setOpen(false)} className="rounded-lg p-1 text-gray-400 hover:bg-slate-800 hover:text-gray-300">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-2">
                <CommandList />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export function Command({ children, className = '', ...props }) {
  return (
    <div className={`relative ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CommandInput({ placeholder = 'Type a command or search...', className = '', ...props }) {
  const { search, setSearch } = useCommand()

  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`w-full rounded-lg border border-indigo-500/20 bg-slate-800/50 py-2 pr-4 pl-10 text-sm text-white placeholder-gray-400 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 focus:outline-none ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}

export function CommandList({ children, className = '', ...props }) {
  const { search } = useCommand()

  // Example command groups and items
  const groups = [
    {
      heading: 'Suggestions',
      items: [
        {
          icon: <CommandIcon className="h-4 w-4" />,
          name: 'Command Palette',
          shortcut: '⌘K',
          onSelect: () => console.log('Command Palette')
        },
        {
          icon: <Search className="h-4 w-4" />,
          name: 'Search',
          shortcut: '⌘F',
          onSelect: () => console.log('Search')
        }
      ]
    },
    {
      heading: 'Navigation',
      items: [
        {
          icon: '🏠',
          name: 'Home',
          onSelect: () => console.log('Home')
        },
        {
          icon: '📊',
          name: 'Dashboard',
          onSelect: () => console.log('Dashboard')
        },
        {
          icon: '⚙️',
          name: 'Settings',
          onSelect: () => console.log('Settings')
        }
      ]
    }
  ]

  // Filter items based on search
  const filteredGroups = search
    ? groups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
        }))
        .filter((group) => group.items.length > 0)
    : groups

  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {filteredGroups.map((group, index) => (
        <div key={index} className="space-y-2">
          <div className="px-2 text-xs font-medium text-gray-400">{group.heading}</div>
          <div className="space-y-1">
            {group.items.map((item, itemIndex) => (
              <CommandItem key={itemIndex} onSelect={item.onSelect} shortcut={item.shortcut}>
                <div className="flex h-5 w-5 items-center justify-center">{typeof item.icon === 'string' ? item.icon : item.icon}</div>
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </div>
        </div>
      ))}

      {filteredGroups.length === 0 && (
        <div className="py-6 text-center text-gray-400">
          <div className="mb-2">🔍</div>
          <p className="text-sm">No results found</p>
        </div>
      )}

      {children}
    </div>
  )
}

export function CommandItem({ children, onSelect, shortcut, className = '', ...props }) {
  return (
    <motion.button
      onClick={onSelect}
      className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 ${className}`}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <div className="flex flex-1 items-center gap-2">{children}</div>
      {shortcut && <kbd className="text-xs text-gray-500">{shortcut}</kbd>}
    </motion.button>
  )
}

export function CommandShortcut({ children, className = '', ...props }) {
  return (
    <kbd className={`ml-auto rounded border border-indigo-500/30 bg-indigo-500/10 px-1.5 py-0.5 text-xs text-gray-400 ${className}`} {...props}>
      {children}
    </kbd>
  )
}

export function CommandTrigger({ className = '', ...props }) {
  const { setOpen } = useCommand()

  return (
    <motion.button
      onClick={() => setOpen(true)}
      className={`flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-slate-800/50 px-3 py-2 text-sm text-gray-300 hover:border-indigo-500/40 hover:bg-slate-700/50 hover:text-white ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <Search className="h-4 w-4" />
      <span>Search...</span>
      <CommandShortcut>⌘K</CommandShortcut>
    </motion.button>
  )
}

export function CommandEmpty({ children, className = '', ...props }) {
  return (
    <div className={`py-6 text-center text-gray-400 ${className}`} {...props}>
      {children || (
        <>
          <div className="mb-2">🔍</div>
          <p className="text-sm">No results found</p>
        </>
      )}
    </div>
  )
}

export function CommandGroup({ heading, children, className = '', ...props }) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {heading && <div className="px-2 text-xs font-medium text-gray-400">{heading}</div>}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

export function CommandSeparator({ className = '', ...props }) {
  return <div className={`my-2 h-px bg-indigo-500/20 ${className}`} {...props} />
}
