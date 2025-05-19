import { useId } from 'react'
import { useFormContext } from 'react-hook-form'

const FormSelect = ({ name, label, options, required, disabled, className = '' }) => {
  const id = useId()
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message

  return (
    <div className={`form-group mb-4 ${className}`}>
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>
      <select id={id} {...register(name)} className={`form-select ${error ? 'is-invalid' : ''}`} disabled={disabled}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  )
}

export default FormSelect
