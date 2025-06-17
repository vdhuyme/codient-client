'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, CalendarIcon, X } from 'lucide-react'
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isAfter,
  isBefore,
  addYears,
  subYears,
  getYear
} from 'date-fns'

import { cn } from '@/lib/utils'
import Button from './button'

const DatePicker = React.forwardRef(
  (
    { value, onChange, placeholder = 'Select date', disabled = false, className, minDate, maxDate, dateFormat = 'PPP', clearable = true, ...props },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState(value || null)
    const [currentMonth, setCurrentMonth] = React.useState(date || new Date())
    const [yearSelectOpen, setYearSelectOpen] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)
    const popoverRef = React.useRef(null)
    const triggerRef = React.useRef(null)

    // Check if mobile
    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Update internal state when value changes externally
    React.useEffect(() => {
      setDate(value || null)
      if (value) {
        setCurrentMonth(value)
      }
    }, [value])

    // Handle click outside
    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target) && triggerRef.current && !triggerRef.current.contains(event.target)) {
          setOpen(false)
          setYearSelectOpen(false)
        }
      }

      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open])

    // Handle escape key
    React.useEffect(() => {
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          setOpen(false)
          setYearSelectOpen(false)
        }
      }

      if (open) {
        document.addEventListener('keydown', handleEscape)
      }

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }, [open])

    const handleSelect = (day) => {
      setDate(day)
      onChange?.(day)
      setOpen(false)
    }

    const handleClear = (e) => {
      e.stopPropagation()
      setDate(null)
      onChange?.(null)
    }

    const togglePopover = () => {
      if (!disabled) {
        setOpen(!open)
      }
    }

    const nextMonth = () => {
      setCurrentMonth(addMonths(currentMonth, 1))
    }

    const prevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1))
    }

    const nextYear = () => {
      setCurrentMonth(addYears(currentMonth, 1))
    }

    const prevYear = () => {
      setCurrentMonth(subYears(currentMonth, 1))
    }

    const setYear = (year) => {
      setCurrentMonth(new Date(year, currentMonth.getMonth(), 1))
      setYearSelectOpen(false)
    }

    const years = React.useMemo(() => {
      const currentYear = getYear(new Date())
      return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
    }, [])

    const days = React.useMemo(() => {
      const start = startOfMonth(currentMonth)
      const end = endOfMonth(currentMonth)
      return eachDayOfInterval({ start, end })
    }, [currentMonth])

    // Get day names for the header
    const dayNames = React.useMemo(() => {
      const date = new Date(2023, 8, 3) // A Sunday
      const days = []
      for (let i = 0; i < 7; i++) {
        const day = addDays(date, i)
        days.push(format(day, 'EEEEEE')) // 2-letter day name
      }
      return days
    }, [])

    function addDays(date, days) {
      const result = new Date(date)
      result.setDate(result.getDate() + days)
      return result
    }

    const isDateDisabled = (date) => {
      if (minDate && isBefore(date, minDate)) return true
      if (maxDate && isAfter(date, maxDate)) return true
      return false
    }

    const formatDate = () => {
      if (!date) return placeholder
      return format(date, dateFormat)
    }

    return (
      <div className="relative">
        <Button
          ref={(node) => {
            triggerRef.current = node
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
          }}
          variant="outline"
          className={cn(
            'w-full justify-start truncate text-left font-normal',
            !date && 'text-muted-foreground',
            className,
            disabled && 'cursor-not-allowed opacity-50'
          )}
          disabled={disabled}
          onClick={togglePopover}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 opacity-70" />
          <span className="truncate">{formatDate()}</span>
          {date && clearable && <X className="ml-auto h-4 w-4 flex-shrink-0 cursor-pointer opacity-70 hover:opacity-100" onClick={handleClear} />}
        </Button>

        {open && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />}

        {open && (
          <div
            ref={popoverRef}
            className={cn(
              'fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
              'w-[90vw] max-w-md md:w-auto' // Responsive width
            )}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isMobile ? 20 : -10 }}
              transition={{ duration: 0.15 }}
              className="rounded-lg border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-700 p-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('rounded-full bg-slate-800 hover:bg-slate-700', isMobile ? 'h-10 w-10' : 'h-8 w-8')}
                    onClick={prevYear}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="-ml-2 h-4 w-4" />
                    <span className="sr-only">Previous Year</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('rounded-full bg-slate-800 hover:bg-slate-700', isMobile ? 'h-10 w-10' : 'h-8 w-8')}
                    onClick={prevMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Month</span>
                  </Button>
                </div>

                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setYearSelectOpen(!yearSelectOpen)}
                    className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium hover:bg-slate-700"
                  >
                    {format(currentMonth, 'MMMM yyyy')}
                  </Button>

                  <AnimatePresence>
                    {yearSelectOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-1/2 z-10 mt-2 max-h-60 w-48 -translate-x-1/2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 p-2 shadow-xl"
                      >
                        <div className="grid grid-cols-3 gap-1">
                          {years.map((year) => (
                            <Button
                              key={year}
                              variant="ghost"
                              size="sm"
                              className={cn('h-8 text-xs', getYear(currentMonth) === year && 'bg-indigo-600 text-white hover:bg-indigo-700')}
                              onClick={() => setYear(year)}
                            >
                              {year}
                            </Button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('rounded-full bg-slate-800 hover:bg-slate-700', isMobile ? 'h-10 w-10' : 'h-8 w-8')}
                    onClick={nextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Month</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn('rounded-full bg-slate-800 hover:bg-slate-700', isMobile ? 'h-10 w-10' : 'h-8 w-8')}
                    onClick={nextYear}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="-ml-2 h-4 w-4" />
                    <span className="sr-only">Next Year</span>
                  </Button>
                </div>
              </div>

              {/* Calendar */}
              <div className="p-4">
                {/* Day names header */}
                <div className="mb-2 grid grid-cols-7 gap-1">
                  {dayNames.map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-medium text-slate-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Fill in empty days at the start of the month */}
                  {Array.from({ length: days[0].getDay() }).map((_, index) => (
                    <div key={`empty-start-${index}`} className={cn(isMobile ? 'h-12 w-12' : 'h-10 w-10')} />
                  ))}

                  {days.map((day) => {
                    const isSelected = date && isSameDay(day, date)
                    const isDisabled = isDateDisabled(day)
                    const isCurrent = isToday(day)

                    return (
                      <Button
                        key={day.toString()}
                        variant="ghost"
                        size="icon"
                        disabled={isDisabled}
                        className={cn(
                          'rounded-full p-0 font-normal transition-all duration-200',
                          isMobile ? 'h-12 w-12 text-base' : 'h-10 w-10 text-sm',
                          isSelected && 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700',
                          !isSelected && isCurrent && 'border-2 border-indigo-500 text-indigo-400',
                          !isSelected && !isCurrent && 'hover:bg-slate-700',
                          isDisabled && 'cursor-not-allowed opacity-50'
                        )}
                        onClick={() => handleSelect(day)}
                      >
                        {format(day, 'd')}
                      </Button>
                    )
                  })}

                  {/* Fill in empty days at the end of the month */}
                  {Array.from({ length: 6 - days[days.length - 1].getDay() }).map((_, index) => (
                    <div key={`empty-end-${index}`} className={cn(isMobile ? 'h-12 w-12' : 'h-10 w-10')} />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-700 p-4">
                <div className="text-sm text-slate-400">{date ? format(date, 'EEEE, MMMM do, yyyy') : 'No date selected'}</div>

                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 bg-slate-800 text-xs hover:bg-slate-700" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>

                  <Button variant="ghost" size="sm" className="h-8 bg-slate-800 text-xs hover:bg-slate-700" onClick={() => handleSelect(new Date())}>
                    Today
                  </Button>

                  {date && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-8 text-xs text-white"
                      onClick={() => {
                        onChange?.(date)
                        setOpen(false)
                      }}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export { DatePicker }
