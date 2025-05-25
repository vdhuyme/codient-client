import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange, showFirstLast = true, className = '' }) => {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const PageButton = ({ page, isActive = false, disabled = false, onClick, children }) => (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
        isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : 'text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300'
      } ${disabled ? 'cursor-not-allowed opacity-50' : ''} `}
      whileHover={!disabled && !isActive ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      {children || page}
    </motion.button>
  )

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Previous button */}
      <PageButton disabled={currentPage === 1} onClick={() => onPageChange?.(currentPage - 1)}>
        <ChevronLeft className="h-4 w-4" />
      </PageButton>

      {/* Page numbers */}
      {getVisiblePages().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <div className="px-3 py-2">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </div>
          ) : (
            <PageButton page={page} isActive={page === currentPage} onClick={() => onPageChange?.(page)} />
          )}
        </div>
      ))}

      {/* Next button */}
      <PageButton disabled={currentPage === totalPages} onClick={() => onPageChange?.(currentPage + 1)}>
        <ChevronRight className="h-4 w-4" />
      </PageButton>
    </div>
  )
}

export default Pagination
