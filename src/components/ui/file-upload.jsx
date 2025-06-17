import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Upload, X, Image, Plus } from 'lucide-react'
import { authenticator } from '@/api/imagekit'
import { upload } from '@imagekit/react'
import { createPortal } from 'react-dom'

const FileUpload = ({
  value,
  onChange,
  accept = 'image/*',
  disabled = false,
  multiple = false,
  className = '',
  placeholder = 'Click to upload or drag and drop',
  maxFiles = 5,
  ...props
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const [previewFiles, setPreviewFiles] = useState([])

  const urls = multiple ? (Array.isArray(value) ? value : value ? [value] : []) : value ? [value] : []

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
    e.target.value = ''
  }

  const processFiles = async (newFiles) => {
    const validFiles = newFiles.filter((file) => (accept === 'image/*' ? file.type.startsWith('image/') : true))

    if (validFiles.length === 0) return

    const filesToUpload = multiple ? validFiles.slice(0, maxFiles - (urls.length + previewFiles.length)) : [validFiles[0]]

    if (filesToUpload.length === 0) return

    const newPreviewFiles = filesToUpload.map((file) => {
      const fileId = `${file.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      return {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        previewUrl: URL.createObjectURL(file),
        uploading: true,
        originalFile: file
      }
    })

    if (!multiple) {
      setPreviewFiles(newPreviewFiles)
    } else {
      setPreviewFiles((prev) => [...prev, ...newPreviewFiles])
    }

    for (const previewFile of newPreviewFiles) {
      const originalFile = previewFile.originalFile

      setUploadProgress((prev) => ({
        ...prev,
        [previewFile.id]: 0
      }))

      try {
        const authParams = await authenticator()
        const { signature, expire, token, publicKey } = authParams

        const result = await upload({
          file: originalFile,
          fileName: originalFile.name,
          expire,
          token,
          signature,
          publicKey,
          onProgress: (event) => {
            const progress = Math.round((event.loaded / event.total) * 100)
            setUploadProgress((prev) => ({
              ...prev,
              [previewFile.id]: progress
            }))
          }
        })

        if (multiple) {
          const newUrls = [...urls, result.url]
          onChange?.(newUrls)
        } else {
          onChange?.(result.url)
        }

        setPreviewFiles((prev) => prev.filter((f) => f.id !== previewFile.id))
        setTimeout(() => {
          setUploadProgress((prev) => {
            const newProgress = { ...prev }
            delete newProgress[previewFile.id]
            return newProgress
          })
        }, 300)
      } catch (error) {
        console.error(`Error uploading ${originalFile.name}:`, error)

        setPreviewFiles((prev) => prev.filter((f) => f.id !== previewFile.id))
        setUploadProgress((prev) => {
          const newProgress = { ...prev }
          delete newProgress[previewFile.id]
          return newProgress
        })
      }
    }
  }

  const removeUrl = (index) => {
    if (multiple) {
      const newUrls = urls.filter((_, i) => i !== index)
      onChange?.(newUrls.length > 0 ? newUrls : null)
    } else {
      onChange?.(null)
    }
  }

  const removePreviewFile = (fileId) => {
    setPreviewFiles((prev) => prev.filter((f) => f.id !== fileId))
    setUploadProgress((prev) => {
      const newProgress = { ...prev }
      delete newProgress[fileId]
      return newProgress
    })
  }

  const totalFiles = urls.length + previewFiles.length
  const canAddMore = multiple ? totalFiles < maxFiles : totalFiles === 0
  const [zoomImage, setZoomImage] = useState(false)

  return (
    <>
      <div className={`relative ${className}`} {...props}>
        {/* Hiển thị URLs đã upload thành công */}
        {urls.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-3">
            {urls.map((url, index) => (
              <motion.div
                key={`url-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-lg border border-green-500/20 bg-slate-800/50 p-4"
              >
                <button
                  type="button"
                  onClick={() => removeUrl(index)}
                  disabled={disabled}
                  className="absolute top-2 right-2 rounded-full bg-red-500/20 p-1 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-center space-x-3">
                  <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-700">
                    <img
                      src={url}
                      alt="Uploaded"
                      className="h-full w-full cursor-zoom-in object-cover transition-transform hover:scale-105"
                      onClick={() => setZoomImage(url)}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-400">✓ Uploaded successfully</p>
                    <p className="line-clamp-2 max-w-[200px] text-xs break-words text-gray-400">{url}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Hiển thị files đang upload */}
        {previewFiles.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 space-y-3">
            {previewFiles.map((file) => {
              const currentProgress = uploadProgress[file.id]

              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative rounded-lg border border-indigo-500/20 bg-slate-800/50 p-4"
                >
                  <button
                    type="button"
                    onClick={() => removePreviewFile(file.id)}
                    disabled={disabled}
                    className="absolute top-2 right-2 rounded-full bg-red-500/20 p-1 text-red-400 hover:bg-red-500/30 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="flex items-center space-x-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-slate-700">
                      <img src={file.previewUrl} alt={file.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-2 max-w-[200px] text-xs break-words text-gray-400">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <div className="mt-2">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs text-indigo-400">{currentProgress !== undefined ? 'Uploading...' : 'Processing...'}</span>
                          {currentProgress !== undefined && <span className="text-xs text-indigo-400">{currentProgress}%</span>}
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-700">
                          <div
                            className="h-1.5 rounded-full bg-indigo-500 transition-all duration-300"
                            style={{
                              width: currentProgress !== undefined ? `${currentProgress}%` : '20%',
                              animation: currentProgress === undefined ? 'pulse 1.5s ease-in-out infinite' : 'none'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Upload area */}
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
                  ) : totalFiles > 0 ? (
                    <Plus className="h-6 w-6 text-indigo-400" />
                  ) : (
                    <Image className="h-6 w-6 text-indigo-400" />
                  )}
                </div>

                <p className="mb-1 text-sm font-medium text-white">
                  {dragOver
                    ? 'Drop to upload'
                    : totalFiles > 0
                      ? `Add more ${multiple ? `(${maxFiles - totalFiles} remaining)` : 'images'}`
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

        {multiple && totalFiles >= maxFiles && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-xs text-amber-400">
            Maximum number of files reached ({maxFiles})
          </motion.p>
        )}
      </div>

      {zoomImage && <ZoomOverlay imageUrl={zoomImage} onClose={() => setZoomImage(null)} />}
    </>
  )
}

const ZoomOverlay = ({ imageUrl, onClose }) => {
  if (typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <AnimatePresence>
      {imageUrl && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90" onClick={onClose}>
          <motion.img
            key={imageUrl}
            src={imageUrl}
            alt="Zoomed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none h-full w-full object-contain"
          />
          <button
            className="absolute top-4 right-4 z-[10000] rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default FileUpload
