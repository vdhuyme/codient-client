import { useState, useEffect } from 'react'
import { format, parse, isValid, isAfter, isBefore } from 'date-fns'
import toast from 'react-hot-toast'

const DateInput = ({ value, onChange, placeholder = 'yyyy-MM-dd', disabled = false, error = false, icon, className = '', min, max, ...props }) => {
  const [internalValue, setInternalValue] = useState(value || '')

  useEffect(() => {
    setInternalValue(value || '')
  }, [value])

  const isValidDateStr = (str) => {
    const date = parse(str, 'yyyy-MM-dd', new Date())
    return isValid(date) && format(date, 'yyyy-MM-dd') === str
  }

  const isInRange = (str) => {
    if (!isValidDateStr(str)) {
      toast.error('Invalid date format. Use yyyy-MM-dd.')
      return false
    }
    const date = parse(str, 'yyyy-MM-dd', new Date())
    if (min && isBefore(date, parse(min, 'yyyy-MM-dd', new Date()))) {
      toast.error(`Date cannot be earlier than ${min}`)
      return false
    }
    if (max && isAfter(date, parse(max, 'yyyy-MM-dd', new Date()))) {
      toast.error(`Date cannot be later than ${max}`)
      return false
    }
    return true
  }

  const handleInput = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '').slice(0, 8)
    let formatted = ''

    if (raw.length > 0) formatted = raw.slice(0, 4)
    if (raw.length > 4) formatted += '-' + raw.slice(4, 6)
    if (raw.length > 6) formatted += '-' + raw.slice(6, 8)

    setInternalValue(formatted)

    if (formatted.length === 10) {
      if (isInRange(formatted)) {
        onChange?.({ target: { value: formatted } })
      }
    }
  }

  return (
    <div className={`relative ${className}`}>
      {icon && <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-200">{icon}</div>}

      <input
        type="text"
        inputMode="numeric"
        pattern="\d{4}-\d{2}-\d{2}"
        placeholder={placeholder}
        value={internalValue}
        onChange={handleInput}
        disabled={disabled}
        className={`w-full rounded-lg border bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:outline-none ${
          icon ? 'pl-10' : ''
        } ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-indigo-500/20 focus:border-indigo-500/40 focus:ring-indigo-500/20'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        {...props}
      />
    </div>
  )
}

export default DateInput
