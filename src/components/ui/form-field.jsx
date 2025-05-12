const FormField = ({ id, name, label, value, onChange, error, placeholder, isTextarea = false }) => (
  <div className={`contact__form__div ${isTextarea ? 'contact__form__area' : ''}`}>
    <label htmlFor={id} className="contact__form__tag">
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
        className="contact__form__input"
      />
    ) : (
      <input id={id} name={name} type="text" value={value} onChange={onChange} placeholder={placeholder} className="contact__form__input" />
    )}

    {error && <span className="text__error">{error}</span>}
  </div>
)

export default FormField
