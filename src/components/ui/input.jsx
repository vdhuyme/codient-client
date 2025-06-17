const Input = ({ type = 'text', placeholder, value, onChange, disabled = false, error = false, icon, className = '', ...props }) => {
  return (
    <div className={`relative ${className}`}>
      {icon && <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">{icon}</div>}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:outline-none ${icon ? 'pl-10' : ''} ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-indigo-500/20 focus:border-indigo-500/40 focus:ring-indigo-500/20'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        {...props}
      />
    </div>
  )
}

export default Input
