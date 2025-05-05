import PropTypes from 'prop-types'

const Select = ({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error = '',
  className = ''
}) => {
  return (
    <div className={`select ${error ? 'select--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="select__label">
          {label} {required && <span className="select__required">*</span>}
        </label>
      )}
      <div className="select__wrapper">
        <select id={id} className="select__input" value={value} onChange={onChange} disabled={disabled} required={required}>
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="select__arrow"></span>
      </div>
      {error && <p className="select__error">{error}</p>}
    </div>
  )
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string
}

export default Select
