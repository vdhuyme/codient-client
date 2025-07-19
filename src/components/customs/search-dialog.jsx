import { useEffect, useRef, useState } from 'react'
import Input from '../ui/input'
import ScrollArea from '../ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

export const SearchDialog = ({ open, onClose, menuItems, navigate }) => {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const filtered = menuItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
        }
      }, 100)
    }
  }, [open])

  useEffect(() => {
    if (selected >= filtered.length && filtered.length > 0) {
      setSelected(0)
    }
  }, [filtered.length, selected])

  useEffect(() => {
    if (listRef.current && filtered.length > 0) {
      const selectedElement = listRef.current.children[selected]
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        })
      }
    }
  }, [selected, filtered.length])

  const handleKeyDown = (e) => {
    if (filtered.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelected((prev) => (prev + 1) % filtered.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelected((prev) => (prev - 1 + filtered.length) % filtered.length)
        break
      case 'Enter':
        e.preventDefault()
        if (filtered[selected]) {
          navigate(filtered[selected].path)
          onClose()
        }
        break
      case 'Escape':
        e.preventDefault()
        onClose()
        break
    }
  }

  const handleItemClick = (item) => {
    navigate(item.path)
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="w-full max-w-md rounded-xl border border-indigo-500/30 bg-slate-900 p-4 shadow-2xl"
            initial={{ scale: 0.98, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2">
              <Input
                ref={inputRef}
                placeholder="Search features..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelected(0)
                }}
                onKeyDown={handleKeyDown}
                autoFocus
                icon={<Search className="h-5 w-5 text-white" />}
              />
            </div>

            <div className="max-h-64 divide-y divide-indigo-500/10 rounded-lg bg-slate-800/60">
              <ScrollArea className="h-[20vh]">
                {filtered.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">No features found</div>
                ) : (
                  <div ref={listRef} role="listbox">
                    {filtered.map((item, idx) => (
                      <button
                        key={`${item.id}-${idx}`} // Đảm bảo unique key
                        role="option"
                        aria-selected={idx === selected}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all duration-150 ${
                          idx === selected ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/40' : 'text-gray-300 hover:bg-slate-700/40'
                        }`}
                        onClick={() => handleItemClick(item)}
                        onMouseEnter={() => setSelected(idx)}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="truncate font-medium">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="mt-3 flex items-center justify-between px-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <kbd className="rounded bg-slate-700 px-1.5 py-0.5 font-mono">↑</kbd>
                <kbd className="rounded bg-slate-700 px-1.5 py-0.5 font-mono">↓</kbd>
                <span>navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="rounded bg-slate-700 px-1.5 py-0.5 font-mono">Enter</kbd>
                <span>select</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="rounded bg-slate-700 px-1.5 py-0.5 font-mono">Esc</kbd>
                <span>close</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
