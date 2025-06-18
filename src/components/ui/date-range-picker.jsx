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
  endOfDay,
  getDay
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
      dateFormat = 'yyyy-MM-dd',
      clearable = true,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const [range, setRange] = React.useState(value)
    const [currentMonth, setCurrentMonth] = React.useState(range.from || new Date())
    const [secondMonth, setSecondMonth] = React.useState(addMonths(currentMonth, 1))
    const [yearSelectOpen, setYearSelectOpen] = React.useState(null) // null, 'first', or 'second'
    const [activeMonth, setActiveMonth] = React.useState('first')
    const popoverRef = React.useRef(null)
    const yearSelectRef = React.useRef(null)

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
      const handleClickOutside = (e) => {
        if (popoverRef.current && !popoverRef.current.contains(e.target)) {
          setOpen(false)
          setYearSelectOpen(null)
        }
        if (yearSelectRef.current && !yearSelectRef.current.contains(e.target)) {
          setYearSelectOpen(null)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (day) => {
      if (!range.from || range.to) {
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
      const empty = { from: null, to: null }
      setRange(empty)
      onChange?.(empty)
    }

    const changeMonth = (type, direction) => {
      const mod = direction === 'next' ? 1 : -1
      const monthFn = type === 'first' ? setCurrentMonth : setSecondMonth
      const refDate = type === 'first' ? currentMonth : secondMonth
      monthFn(addMonths(refDate, mod))
    }

    const changeYear = (type, direction) => {
      const mod = direction === 'next' ? 1 : -1
      const yearFn = type === 'first' ? setCurrentMonth : setSecondMonth
      const refDate = type === 'first' ? currentMonth : secondMonth
      yearFn(addYears(refDate, mod))
    }

    const setYear = (year, monthType) => {
      const setter = monthType === 'first' ? setCurrentMonth : setSecondMonth
      const refMonth = monthType === 'first' ? currentMonth : secondMonth
      setter(new Date(year, refMonth.getMonth(), 1))
      setYearSelectOpen(null)
    }

    // Generate years based on minDate and maxDate
    const getYears = (monthType) => {
      const currentDate = monthType === 'first' ? currentMonth : secondMonth
      const currentYear = getYear(currentDate)

      let minYear = minDate ? getYear(minDate) : currentYear - 10
      let maxYear = maxDate ? getYear(maxDate) : currentYear + 10

      // Ensure we have at least a reasonable range
      if (maxYear - minYear < 20) {
        if (!minDate && !maxDate) {
          minYear = currentYear - 10
          maxYear = currentYear + 10
        } else if (!minDate) {
          minYear = maxYear - 20
        } else if (!maxDate) {
          maxYear = minYear + 20
        }
      }

      const years = []
      for (let year = minYear; year <= maxYear; year++) {
        years.push(year)
      }
      return years
    }

    const generateDays = (month) => {
      const start = startOfMonth(month)
      const end = endOfMonth(month)
      return eachDayOfInterval({ start, end })
    }

    const isDateDisabled = (date) => (minDate && isBefore(date, minDate)) || (maxDate && isAfter(date, maxDate))

    const isDateInRange = (date) =>
      range.from &&
      range.to &&
      isWithinInterval(date, {
        start: startOfDay(range.from),
        end: endOfDay(range.to)
      })

    const isStart = (day) => range.from && isSameDay(day, range.from)
    const isEnd = (day) => range.to && isSameDay(day, range.to)

    const handleYearSelectToggle = (monthType, e) => {
      e.stopPropagation()
      setYearSelectOpen(yearSelectOpen === monthType ? null : monthType)
    }

    const renderDays = (days, monthType, monthDate) => (
      <div className="flex-1 p-3" onMouseEnter={() => setActiveMonth(monthType)}>
        <div className="relative mb-2 flex justify-center">
          <Button
            variant="ghost"
            onClick={(e) => handleYearSelectToggle(monthType, e)}
            className="rounded bg-slate-800 px-2 py-1 text-sm font-medium hover:bg-slate-700"
          >
            {format(monthDate, 'MMMM yyyy')}
          </Button>

          <AnimatePresence>
            {yearSelectOpen === monthType && (
              <motion.div
                ref={yearSelectRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-1/2 z-20 mt-1 max-h-60 w-40 -translate-x-1/2 overflow-y-auto rounded-md border border-slate-800 bg-slate-900 p-1 shadow-lg"
              >
                <div className="grid grid-cols-3 gap-1">
                  {getYears(monthType).map((year) => (
                    <Button
                      key={year}
                      variant="ghost"
                      size="sm"
                      className={cn('h-8 text-xs', getYear(monthDate) === year ? 'bg-indigo-600 text-white hover:bg-indigo-700' : '')}
                      onClick={() => setYear(year, monthType)}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="mb-1 grid grid-cols-7 gap-1">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="text-center text-xs font-medium text-slate-400">
              {format(new Date(2023, 8, i + 3), 'EEEEE')}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {[...Array(getDay(days[0]))].map((_, i) => (
            <div key={`spacer-${i}`} className="h-8 w-8" />
          ))}
          {days.map((day) => (
            <Button
              key={day.toISOString()}
              variant="ghost"
              size="icon"
              disabled={isDateDisabled(day)}
              onClick={() => handleSelect(day)}
              className={cn(
                'relative h-8 w-8 p-0 font-normal',
                isStart(day) && 'z-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700',
                isEnd(day) && 'z-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700',
                !isStart(day) && !isEnd(day) && isDateInRange(day) && 'bg-indigo-600/20 text-indigo-200 hover:bg-indigo-600/30',
                isToday(day) && 'border border-indigo-500 text-indigo-400',
                isDateDisabled(day) && 'cursor-not-allowed opacity-50'
              )}
            >
              {format(day, 'd')}
            </Button>
          ))}
        </div>
      </div>
    )

    return (
      <div className="relative w-full">
        <Button
          ref={ref}
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', !range.from && 'text-muted-foreground', className)}
          disabled={disabled}
          onClick={() => setOpen(!open)}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          {range.from ? `${format(range.from, dateFormat)} - ${range.to ? format(range.to, dateFormat) : '...'}` : placeholder}
          {(range.from || range.to) && clearable && (
            <X className="ml-auto h-4 w-4 cursor-pointer opacity-70 hover:opacity-100" onClick={handleClear} />
          )}
        </Button>

        <AnimatePresence>
          {open && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />}

          {open && (
            <motion.div
              ref={popoverRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed top-1/2 left-1/2 z-50 w-[95vw] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-md border border-slate-800 bg-slate-900 shadow-lg md:w-[600px]"
            >
              <div className="flex items-center justify-between border-b border-slate-800 p-3">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-slate-800 p-0 hover:bg-slate-700"
                    onClick={() => changeYear(activeMonth, 'prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="-ml-2 h-4 w-4" />
                    <span className="sr-only">Previous Year</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full bg-slate-800 p-0 hover:bg-slate-700"
                    onClick={() => changeMonth(activeMonth, 'prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Month</span>
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="h-7 w-7 rounded-full bg-slate-800 p-0 hover:bg-slate-700"
                    variant="ghost"
                    size="icon"
                    onClick={() => changeMonth(activeMonth, 'next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Month</span>
                  </Button>
                  <Button
                    className="h-7 w-7 rounded-full bg-slate-800 p-0 hover:bg-slate-700"
                    variant="ghost"
                    size="icon"
                    onClick={() => changeYear(activeMonth, 'next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="-ml-2 h-4 w-4" />
                    <span className="sr-only">Next Year</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row">
                {renderDays(generateDays(currentMonth), 'first', currentMonth)}
                <div className="hidden w-px bg-slate-800 md:block" />
                {renderDays(generateDays(secondMonth), 'second', secondMonth)}
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 p-3">
                <div className="text-sm text-slate-400">
                  {range.from && !range.to && 'Select end date'}
                  {range.from && range.to && `${format(range.from, 'MMM d')} - ${format(range.to, 'MMM d, yyyy')}`}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  {isToday(new Date()) && (
                    <Button size="sm" variant="ghost" onClick={() => handleSelect(new Date())}>
                      Today
                    </Button>
                  )}
                  {range.from && range.to && (
                    <Button
                      size="sm"
                      variant="default"
                      className="text-white"
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
          )}
        </AnimatePresence>
      </div>
    )
  }
)

DateRangePicker.displayName = 'DateRangePicker'
export { DateRangePicker }
