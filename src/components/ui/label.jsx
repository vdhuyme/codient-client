const Label = ({ children, required = false, className = '', ...props }) => {
  return (
    <label className={`mb-2 block text-sm font-medium text-gray-300 ${className}`} {...props}>
      {children}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
  )
}

export default Label
