import PropTypes from 'prop-types'

const Switch = ({ id, label, checked, onChange, disabled = false, className = '' }) => {
  return (
    <div className={`switch ${className}`}>
      <label className="switch__label" htmlFor={id}>
        <input type="checkbox" id={id} className="switch__input" checked={checked} onChange={onChange} disabled={disabled} />
        <span className="switch__slider"></span>
        {label && <span className="switch__text">{label}</span>}
      </label>
    </div>
  )
}

Switch.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
}

export default Switch
