import PropTypes from 'prop-types'

const Checkbox = ({ id, label, checked, onChange, disabled = false, className = '' }) => {
  return (
    <div className={`checkbox ${className}`}>
      <label className="checkbox__label" htmlFor={id}>
        <input type="checkbox" id={id} className="checkbox__input" checked={checked} onChange={onChange} disabled={disabled} />
        <span className="checkbox__custom"></span>
        {label && <span className="checkbox__text">{label}</span>}
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
}

export default Checkbox
