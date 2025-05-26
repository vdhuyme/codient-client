'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Search, Smile } from 'lucide-react'
import Input from './input'
import Button from './button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from './dialog'

const IconPicker = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const iconCategories = {
    General: ['📁', '📂', '📄', '📝', '📊', '📈', '📉', '🔍', '⚙️', '🔧'],
    Technology: ['💻', '🖥️', '📱', '⌨️', '🖱️', '💾', '💿', '📀', '🔌', '🔋'],
    Design: ['🎨', '🖌️', '✏️', '📐', '📏', '🖼️', '🎭', '🎪', '🎨', '🌈'],
    Business: ['💼', '📊', '���', '💳', '🏢', '🏪', '🏭', '📈', '📉', '💹'],
    Education: ['📚', '📖', '📝', '✏️', '📐', '🎓', '🏫', '📑', '📋', '📌'],
    Communication: ['📧', '📞', '📱', '💬', '📢', '📣', '📻', '📺', '📡', '🔊'],
    Media: ['🎵', '🎶', '🎤', '🎧', '📷', '📹', '🎬', '📽️', '🎞️', '📸'],
    Food: ['🍎', '🍕', '🍔', '🍟', '🍗', '🥗', '🍜', '🍝', '🍰', '☕'],
    Travel: ['✈️', '🚗', '🚕', '🚌', '🚊', '🚢', '⛵', '🏨', '🗺️', '🧳'],
    Sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏓', '🏸', '🥊', '🏊'],
    Nature: ['🌱', '🌿', '🌳', '🌲', '🌺', '🌻', '🌹', '🌷', '🌸', '🍀'],
    Weather: ['☀️', '🌤️', '⛅', '🌦️', '🌧️', '⛈️', '🌩️', '❄️', '🌨️', '🌪️']
  }

  const allIcons = Object.values(iconCategories).flat()

  const filteredIcons = searchQuery
    ? allIcons.filter((icon) => {
        // Simple search by category names that might contain the icon
        const categories = Object.keys(iconCategories).filter((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase()))
        return categories.some((cat) => iconCategories[cat].includes(icon))
      })
    : allIcons

  const handleSelect = (icon) => {
    onChange(icon)
    setIsOpen(false)
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={() => setIsOpen(true)} className={`h-10 justify-start px-3 ${className}`}>
        <span className="mr-2 text-lg">{value || '📁'}</span>
        <span className="text-sm text-gray-400">Choose icon</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogClose onClose={() => setIsOpen(false)} />
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5" />
              Choose an Icon
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <Input
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
            />

            {/* Icon Grid */}
            <div className="max-h-96 overflow-y-auto">
              {searchQuery ? (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-300">Search Results</h4>
                  <div className="grid grid-cols-10 gap-2">
                    {filteredIcons.map((icon, index) => (
                      <motion.button
                        key={`${icon}-${index}`}
                        type="button"
                        onClick={() => handleSelect(icon)}
                        className={`rounded-lg border p-3 text-xl transition-all duration-200 ${
                          value === icon ? 'border-indigo-500 bg-indigo-500/20' : 'border-slate-600 hover:border-indigo-500/50 hover:bg-slate-700/50'
                        } `}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {icon}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(iconCategories).map(([category, icons]) => (
                    <div key={category}>
                      <h4 className="mb-3 text-sm font-medium text-gray-300">{category}</h4>
                      <div className="grid grid-cols-10 gap-2">
                        {icons.map((icon, index) => (
                          <motion.button
                            key={`${category}-${icon}-${index}`}
                            type="button"
                            onClick={() => handleSelect(icon)}
                            className={`rounded-lg border p-3 text-xl transition-all duration-200 ${
                              value === icon
                                ? 'border-indigo-500 bg-indigo-500/20'
                                : 'border-slate-600 hover:border-indigo-500/50 hover:bg-slate-700/50'
                            } `}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {icon}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default IconPicker
