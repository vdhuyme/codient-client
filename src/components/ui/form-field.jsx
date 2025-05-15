const FormField = ({ id, name, label, value, onChange, error, placeholder, isTextarea = false, ...props }) => (
  <div className={`form__div ${isTextarea ? 'form__area' : ''}`}>
    <label htmlFor={id} className="form__tag">
      {label}
      <span className="require__label">*</span>
    </label>

    {isTextarea ? (
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows="10"
        cols="20"
        placeholder={placeholder}
        className="form__input"
        {...props}
      />
    ) : (
      <input id={id} name={name} type="text" value={value} onChange={onChange} placeholder={placeholder} className="form__input" {...props} />
    )}

    {error && <span className="text__error">{error}</span>}
  </div>
)

export default FormField
