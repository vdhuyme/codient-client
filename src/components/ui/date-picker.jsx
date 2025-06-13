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
import { Popover, PopoverContent, PopoverTrigger } from './popover'

const DatePicker = React.forwardRef(
  (
    { value, onChange, placeholder = 'Select date', disabled = false, className, minDate, maxDate, dateFormat = 'PPP', clearable = true, ...props },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState(value || null)
    const [currentMonth, setCurrentMonth] = React.useState(date || new Date())
    const [yearSelectOpen, setYearSelectOpen] = React.useState(false)

    // Update internal state when value changes externally
    React.useEffect(() => {
      setDate(value || null)
      if (value) {
        setCurrentMonth(value)
      }
    }, [value])

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

      // Get all days in the month
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

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground', className)}
            disabled={disabled}
            {...props}
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
            {date ? format(date, dateFormat) : placeholder}
            {date && clearable && <X className="ml-auto h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" onClick={handleClear} />}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="rounded-md border border-slate-800 bg-slate-900 p-3 shadow-lg"
          >
            <div className="mb-2 flex items-center justify-between">
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
                <Button
                  variant="ghost"
                  onClick={() => setYearSelectOpen(!yearSelectOpen)}
                  className="rounded bg-slate-800 px-2 py-1 text-sm font-medium hover:bg-slate-700"
                >
                  {format(currentMonth, 'MMMM yyyy')}
                </Button>

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

            <div className="mb-1 grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div key={day} className="py-1 text-center text-xs font-medium text-slate-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {/* Fill in empty days at the start of the month */}
              {Array.from({ length: days[0].getDay() }).map((_, index) => (
                <div key={`empty-start-${index}`} className="h-8 w-8" />
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
                      'h-8 w-8 rounded-full p-0 font-normal',
                      isSelected && 'bg-indigo-600 text-white hover:bg-indigo-700',
                      !isSelected && isCurrent && 'border border-indigo-500 text-indigo-400',
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
                <div key={`empty-end-${index}`} className="h-8 w-8" />
              ))}
            </div>

            {isToday(new Date()) && (
              <div className="mt-3 text-center">
                <Button variant="ghost" size="sm" className="h-7 bg-slate-800 text-xs hover:bg-slate-700" onClick={() => handleSelect(new Date())}>
                  Today
                </Button>
              </div>
            )}
          </motion.div>
        </PopoverContent>
      </Popover>
    )
  }
)

DatePicker.displayName = 'DatePicker'

export { DatePicker }
