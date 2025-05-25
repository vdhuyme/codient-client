import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const Tooltip = ({ children, content, position = 'top', delay = 0.5, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false)

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-slate-800',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-slate-800',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-slate-800',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-slate-800'
  }

  return (
    <div className={`relative inline-block ${className}`} onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
      {children}

      <AnimatePresence>
        {isVisible && (
          <div className={`absolute z-50 ${positions[position]}`}>
            <div className="relative rounded-lg border border-indigo-500/20 bg-slate-800 px-3 py-2 text-sm text-white shadow-xl backdrop-blur-sm">
              {content}
              <div className={`absolute h-2 w-2 border-4 ${arrows[position]}`} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Tooltip
