import { cn } from '@/lib/utils'
import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'

export const InputField = ({ name, label, type = 'text', placeholder, icon, ...props }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
        <input
          {...props}
          id={name}
          type={type}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border border-indigo-500/30 bg-slate-800/50 px-4 py-3 pl-10 text-white placeholder-gray-500 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50',
            error && 'border-red-500 ring-red-500 focus:ring-1'
          )}
          {...register(name)}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export const PasswordField = ({ name, label = 'Password', placeholder = '••••••••', ...props }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const [showPassword, setShowPassword] = useState(false)
  const error = errors[name]?.message

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm text-gray-300">
        {label}
      </label>
      <div className="relative">
        {/* Lock icon */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Lock className="h-5 w-5 text-indigo-400" />
        </div>

        {/* Password input */}
        <input
          {...props}
          id={name}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-lg border border-indigo-500/30 bg-slate-800/50 px-4 py-3 pl-10 text-white placeholder-gray-500 transition-colors focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50',
            error && 'border-red-500 ring-red-500 focus:ring-1'
          )}
          {...register(name)}
        />

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export const TextareaField = ({ name, label, placeholder, rows = 4, ...props }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-md border border-indigo-500/30 bg-slate-900/80 p-3 text-white placeholder-gray-400 focus:border-indigo-500/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50',
          error && 'border-red-500 ring-red-500 focus:ring-1'
        )}
        {...register(name)}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
