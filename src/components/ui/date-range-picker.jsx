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
  getYear,
  isWithinInterval,
  startOfDay,
  endOfDay
} from 'date-fns'

import { cn } from '@/lib/utils'
import Button from './button'

const DateRangePicker = React.forwardRef(
  (
    {
      value = { from: null, to: null },
      onChange,
      placeholder = 'Select date range',
      disabled = false,
      className,
      minDate,
      maxDate,
      dateFormat = 'PPP',
      clearable = true,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [range, setRange] = React.useState(value)
    const [currentMonth, setCurrentMonth] = React.useState(range.from || new Date())
    const [secondMonth, setSecondMonth] = React.useState(addMonths(currentMonth, 1))
    const [yearSelectOpen, setYearSelectOpen] = React.useState(false)
    const [activeMonth, setActiveMonth] = React.useState('first')
    const popoverRef = React.useRef(null)

    React.useEffect(() => {
      setRange(value)
      if (value.from) {
        setCurrentMonth(value.from)
        setSecondMonth(addMonths(value.from, 1))
      }
    }, [value])

    React.useEffect(() => {
      setSecondMonth(addMonths(currentMonth, 1))
    }, [currentMonth])

    React.useEffect(() => {
      const handleClickOutside = (event) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target)) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener('mousedown', handleClickOutside)
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [open])

    const handleSelect = (day) => {
      if (!range.from || (range.from && range.to)) {
        setRange({ from: day, to: null })
      } else {
        const newRange = isBefore(day, range.from) ? { from: day, to: range.from } : { from: range.from, to: day }

        setRange(newRange)
        onChange?.(newRange)
        setOpen(false)
      }
    }

    const handleClear = (e) => {
      e.stopPropagation()
      setRange({ from: null, to: null })
      onChange?.({ from: null, to: null })
    }

    const togglePopover = () => {
      if (!disabled) {
        setOpen(!open)
      }
    }

    const nextMonth = () => {
      if (activeMonth === 'first') {
        setCurrentMonth(addMonths(currentMonth, 1))
      } else {
        setSecondMonth(addMonths(secondMonth, 1))
      }
    }

    const prevMonth = () => {
      if (activeMonth === 'first') {
        setCurrentMonth(subMonths(currentMonth, 1))
      } else {
        setSecondMonth(subMonths(secondMonth, 1))
      }
    }

    const nextYear = () => {
      if (activeMonth === 'first') {
        setCurrentMonth(addYears(currentMonth, 1))
      } else {
        setSecondMonth(addYears(secondMonth, 1))
      }
    }

    const prevYear = () => {
      if (activeMonth === 'first') {
        setCurrentMonth(subYears(currentMonth, 1))
      } else {
        setSecondMonth(subYears(secondMonth, 1))
      }
    }

    const setYear = (year) => {
      if (activeMonth === 'first') {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1))
      } else {
        setSecondMonth(new Date(year, secondMonth.getMonth(), 1))
      }
      setYearSelectOpen(false)
    }

    const years = React.useMemo(() => {
      const currentYear = getYear(new Date())
      return Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
    }, [])

    const firstMonthDays = React.useMemo(() => {
      const start = startOfMonth(currentMonth)
      const end = endOfMonth(currentMonth)
      return eachDayOfInterval({ start, end })
    }, [currentMonth])

    const secondMonthDays = React.useMemo(() => {
      const start = startOfMonth(secondMonth)
      const end = endOfMonth(secondMonth)
      return eachDayOfInterval({ start, end })
    }, [secondMonth])

    const dayNames = React.useMemo(() => {
      const date = new Date(2023, 8, 3)
      const days = []
      for (let i = 0; i < 7; i++) {
        const day = addDays(date, i)
        days.push(format(day, 'EEEEEE'))
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

    const isDateInRange = (day) => {
      if (!range.from || !range.to) return false
      return isWithinInterval(day, {
        start: startOfDay(range.from),
        end: endOfDay(range.to)
      })
    }

    const isRangeStart = (day) => {
      return range.from && isSameDay(day, range.from)
    }

    const isRangeEnd = (day) => {
      return range.to && isSameDay(day, range.to)
    }

    const formatDateRange = () => {
      if (!range.from) return placeholder
      if (!range.to) return `${format(range.from, dateFormat)} - ...`
      return `${format(range.from, dateFormat)} - ${format(range.to, dateFormat)}`
    }

    const renderMonth = (days, monthDate, monthType) => {
      return (
        <div className="p-3" onMouseEnter={() => setActiveMonth(monthType)}>
          <div className="mb-2 flex items-center justify-center">
            <Button
              variant="ghost"
              onClick={() => {
                setActiveMonth(monthType)
                setYearSelectOpen(!yearSelectOpen)
              }}
              className="rounded bg-slate-800 px-2 py-1 text-sm font-medium hover:bg-slate-700"
            >
              {format(monthDate, 'MMMM yyyy')}
            </Button>
          </div>

          <div className="mb-1 grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div key={day} className="py-1 text-center text-xs font-medium text-slate-400">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: days[0].getDay() }).map((_, index) => (
              <div key={`empty-start-${index}`} className="h-8 w-8" />
            ))}

            {days.map((day) => {
              const isSelected = isRangeStart(day) || isRangeEnd(day)
              const isInRange = isDateInRange(day)
              const isDisabled = isDateDisabled(day)
              const isCurrent = isToday(day)

              return (
                <Button
                  key={day.toString()}
                  variant="ghost"
                  size="icon"
                  disabled={isDisabled}
                  className={cn(
                    'relative h-8 w-8 p-0 font-normal',
                    isSelected && 'z-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700',
                    !isSelected && isInRange && 'rounded-none bg-indigo-600/20 text-indigo-200 hover:bg-indigo-600/30',
                    !isSelected && !isInRange && isCurrent && 'rounded-full border border-indigo-500 text-indigo-400',
                    isDisabled && 'cursor-not-allowed opacity-50',
                    isRangeStart(day) && 'rounded-l-full',
                    isRangeEnd(day) && 'rounded-r-full'
                  )}
                  onClick={() => handleSelect(day)}
                >
                  {format(day, 'd')}
                </Button>
              )
            })}

            {Array.from({ length: 6 - days[days.length - 1].getDay() }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-8 w-8" />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="relative">
        <Button
          ref={ref}
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !range.from && 'text-muted-foreground', className)}
          disabled={disabled}
          onClick={togglePopover}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          {formatDateRange()}
          {(range.from || range.to) && clearable && (
            <X className="ml-auto h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" onClick={handleClear} />
          )}
        </Button>

        {open && (
          <div ref={popoverRef} className="absolute z-50 mt-2 w-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="rounded-md border border-slate-800 bg-slate-900 shadow-lg"
            >
              <div className="flex items-center justify-between border-b border-slate-800 p-3">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-slate-800 p-0 hover:bg-slate-700" onClick={prevYear}>
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="-ml-2 h-4 w-4" />
                    <span className="sr-only">Previous Year</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-slate-800 p-0 hover:bg-slate-700" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Month</span>
                  </Button>
                </div>

                <div className="relative">
                  <AnimatePresence>
                    {yearSelectOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 z-10 mt-1 max-h-60 w-40 overflow-y-auto rounded-md border border-slate-800 bg-slate-900 p-1 shadow-lg"
                      >
                        <div className="grid grid-cols-3 gap-1">
                          {years.map((year) => (
                            <Button
                              key={year}
                              variant="ghost"
                              size="sm"
                              className={cn(
                                'h-8 text-xs',
                                (activeMonth === 'first' && getYear(currentMonth) === year) ||
                                  (activeMonth === 'second' && getYear(secondMonth) === year)
                                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                  : ''
                              )}
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
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-slate-800 p-0 hover:bg-slate-700" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Month</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-slate-800 p-0 hover:bg-slate-700" onClick={nextYear}>
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="-ml-2 h-4 w-4" />
                    <span className="sr-only">Next Year</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                {renderMonth(firstMonthDays, currentMonth, 'first')}
                <div className="hidden w-px bg-slate-800 md:block" />
                {renderMonth(secondMonthDays, secondMonth, 'second')}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 p-3">
                <div className="text-sm text-slate-400">
                  {range.from && !range.to && 'Select end date'}
                  {range.from && range.to && `${format(range.from, 'MMM d')} - ${format(range.to, 'MMM d, yyyy')}`}
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 bg-slate-800 text-xs hover:bg-slate-700"
                    onClick={() => {
                      setRange({ from: null, to: null })
                      onChange?.({ from: null, to: null })
                      setOpen(false)
                    }}
                  >
                    Cancel
                  </Button>

                  {isToday(new Date()) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 bg-slate-800 text-xs hover:bg-slate-700"
                      onClick={() => handleSelect(new Date())}
                    >
                      Today
                    </Button>
                  )}

                  {range.from && range.to && (
                    <Button
                      variant="default"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => {
                        onChange?.(range)
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

DateRangePicker.displayName = 'DateRangePicker'

export { DateRangePicker }
