import { Controller, useFormContext } from 'react-hook-form'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

const FormEditor = ({ name, label, required, disabled, className = '' }) => {
  const {
    control,
    formState: { errors }
  } = useFormContext()

  const error = errors[name]?.message

  return (
    <div className={`form-group mb-4 ${className}`}>
      <label>
        {label} {required && <span className="required">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <ReactQuill
            theme="snow"
            value={field.value || ''}
            onChange={field.onChange}
            readOnly={disabled}
            modules={{
              toolbar: !disabled && [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        )}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  )
}

export default FormEditor
