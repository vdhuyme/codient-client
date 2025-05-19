const FormInput = ({ id, label, required, register, error, disabled, className = '', helpText }) => {
  return (
    <div className="form-group mb-4">
      <label htmlFor={id}>
        {label} {required && <span className="required">*</span>}
      </label>
      <input id={id} {...register} disabled={disabled} className={`form-control ${error ? 'is-invalid' : ''} ${className}`} />
      {error && <div className="invalid-feedback">{error.message}</div>}
      {helpText && <p className="form-text">{helpText}</p>}
    </div>
  )
}

export default FormInput
