import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Upload, X, Image, Link2, Plus } from 'lucide-react'

const FileUpload = ({
  value,
  onChange,
  accept = 'image/*',
  disabled = false,
  multiple = false,
  className = '',
  placeholder = 'Click to upload or drag and drop',
  allowUrlUpload = true,
  maxFiles = 5,
  ...props
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')

  // Normalize value to always be an array for consistent handling
  const files = multiple ? (Array.isArray(value) ? value : value ? [value] : []) : value ? [value] : []

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    if (disabled) return

    const selectedFiles = Array.from(e.target.files || [])
    processFiles(selectedFiles)

    // Reset input
    e.target.value = ''
  }

  const processFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
      if (accept === 'image/*') {
        return file.type.startsWith('image/')
      }
      return true
    })

    if (validFiles.length === 0) return

    const filesToProcess = multiple ? validFiles.slice(0, maxFiles - files.length) : [validFiles[0]]

    const promises = filesToProcess.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            url: e.target.result,
            name: file.name,
            size: file.size,
            type: file.type,
            id: Math.random().toString(36).substr(2, 9)
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then((fileObjects) => {
      if (multiple) {
        const newFiles = [...files, ...fileObjects]
        onChange?.(newFiles)
      } else {
        onChange?.(fileObjects[0])
      }
    })
  }

  const removeFile = (indexOrId) => {
    if (multiple) {
      const newFiles = files.filter((_, index) => index !== indexOrId)
      onChange?.(newFiles.length > 0 ? newFiles : null)
    } else {
      onChange?.(null)
    }
  }

  const handleUrlSubmit = () => {
    if (!urlValue.trim()) return

    setUrlError('')

    try {
      new URL(urlValue)
    } catch {
      setUrlError('Please enter a valid URL')
      return
    }

    if (multiple && files.length >= maxFiles) {
      setUrlError(`You can only upload up to ${maxFiles} files`)
      return
    }

    const img = document.createElement('img')

    img.onload = () => {
      const fileObject = {
        url: urlValue,
        name: urlValue.split('/').pop() || 'image-from-url',
        size: 0,
        type: 'image/url',
        id: Math.random().toString(36).substr(2, 9),
        isUrl: true
      }

      if (multiple) {
        const newFiles = [...files, fileObject]
        onChange?.(newFiles)
      } else {
        onChange?.(fileObject)
      }

      setUrlValue('')
      setShowUrlInput(false)
    }

    img.onerror = () => {
      setUrlError('Unable to load image from this URL')
    }

    img.src = urlValue
  }

  const canAddMore = multiple ? files.length < maxFiles : files.length === 0

  return (
    <div className={`relative ${className}`} {...props}>
      {files.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-3">
          {files.map((file, index) => (
            <motion.div
              key={file.id || index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative rounded-lg border border-indigo-500/20 bg-slate-800/50 p-4"
            >
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="absolute top-2 right-2 rounded-full bg-red-500/20 p-1 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
              >
                <X className="h-4 w-4 cursor-pointer" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-700">
                  <img src={file.url || file} alt={file.name || 'Preview'} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {file.name || 'Image'}
                    {file.isUrl && <span className="ml-2 text-xs text-blue-400">(URL)</span>}
                  </p>
                  <p className="text-xs text-gray-400">{file.size > 0 ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'External image'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {canAddMore && (
        <motion.div
          className={`relative rounded-lg border-2 border-dashed transition-all duration-200 ${
            dragOver ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-indigo-500/20'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-indigo-500/40'}`}
          onDragOver={(e) => {
            e.preventDefault()
            if (!disabled) setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          whileHover={!disabled ? { scale: 1.01 } : {}}
        >
          <input
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />

          <div className="flex flex-col items-center justify-center px-4 py-8">
            <motion.div animate={{ y: dragOver ? -4 : 0 }} transition={{ duration: 0.2 }} className="flex flex-col items-center">
              <div className="mb-4 rounded-full bg-indigo-500/10 p-3">
                {dragOver ? (
                  <Upload className="h-6 w-6 text-indigo-400" />
                ) : files.length > 0 ? (
                  <Plus className="h-6 w-6 text-indigo-400" />
                ) : (
                  <Image className="h-6 w-6 text-indigo-400" />
                )}
              </div>

              <p className="mb-1 text-sm font-medium text-white">
                {dragOver
                  ? 'Drop to upload'
                  : files.length > 0
                    ? `Add more ${multiple ? `(${maxFiles - files.length} remaining)` : 'images'}`
                    : placeholder}
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, GIF up to 10MB
                {multiple && ` • Max ${maxFiles} files`}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}

      {allowUrlUpload && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShowUrlInput(true)
          }}
          disabled={disabled}
          className="mt-3 flex items-center space-x-2 rounded-md bg-slate-700/50 px-3 py-1.5 text-xs text-indigo-400 hover:bg-slate-700/70 disabled:opacity-50"
        >
          <Link2 className="h-3 w-3" />
          <span>Or add from URL</span>
        </button>
      )}

      <AnimatePresence>
        {showUrlInput && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 rounded-lg border border-slate-600 bg-slate-800/50 p-4"
          >
            <div className="flex items-center space-x-2">
              <input
                type="url"
                value={urlValue}
                onChange={(e) => {
                  setUrlValue(e.target.value)
                  setUrlError('')
                }}
                placeholder="Enter image URL..."
                disabled={disabled}
                className="flex-1 rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit()
                  } else if (e.key === 'Escape') {
                    setShowUrlInput(false)
                    setUrlValue('')
                    setUrlError('')
                  }
                }}
              />
              <button
                type="button"
                onClick={handleUrlSubmit}
                disabled={disabled || !urlValue.trim()}
                className={`rounded-md bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-700 disabled:opacity-50 ${!urlValue.trim() ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlInput(false)
                  setUrlValue('')
                  setUrlError('')
                }}
                disabled={disabled}
                className="rounded-md bg-slate-600 px-3 py-2 text-sm text-white hover:bg-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
            {urlError && <p className="mt-2 text-xs text-red-400">{urlError}</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {multiple && files.length >= maxFiles && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs text-amber-400">
          Maximum number of files reached ({maxFiles})
        </motion.p>
      )}
    </div>
  )
}

export default FileUpload
