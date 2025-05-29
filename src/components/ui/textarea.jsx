const Textarea = ({ placeholder, value, onChange, disabled = false, error = false, rows = 4, className = '', ...props }) => {
  return (
    <div className={`${className}`}>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={`w-full resize-none rounded-lg border bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:outline-none ${
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20'
            : 'border-indigo-500/20 focus:border-indigo-500/40 focus:ring-indigo-500/20'
        } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        {...props}
      />
    </div>
  )
}

export default Textarea
