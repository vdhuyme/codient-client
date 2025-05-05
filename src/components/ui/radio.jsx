import PropTypes from 'prop-types'

const Radio = ({ id, name, value, label, checked, onChange, disabled = false, className = '' }) => {
  return (
    <div className={`radio ${className}`}>
      <label className="radio__label" htmlFor={id}>
        <input type="radio" id={id} name={name} value={value} className="radio__input" checked={checked} onChange={onChange} disabled={disabled} />
        <span className="radio__custom"></span>
        {label && <span className="radio__text">{label}</span>}
      </label>
    </div>
  )
}

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
}

export default Radio
