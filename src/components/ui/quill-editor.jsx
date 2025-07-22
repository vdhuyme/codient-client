import { useEffect } from 'react'
import { useQuill } from 'react-quilljs'
import Quill from 'quill'
import { ImageDrop } from 'quill-image-drop-module'
import QuillResizeImage from 'quill-resize-image'

const FontAttributor = Quill.import('attributors/class/font')
FontAttributor.whitelist = ['jakarta', 'sofia', 'slabo', 'roboto', 'inconsolata', 'ubuntu']

Quill.register(FontAttributor, true)
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', QuillResizeImage)

const QuillEditor = ({ value = '', onChange = () => {}, placeholder = 'Write your content here...', className = '' }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: FontAttributor.whitelist }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video', 'formula'],
      ['clean']
    ],
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    },
    clipboard: {
      matchVisual: false
    },
    imageResize: {},
    imageDrop: true
  }

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'code',
    'color',
    'background',
    'script',
    'list',
    'indent',
    'direction',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video',
    'formula'
  ]

  const { quill, quillRef } = useQuill({
    modules,
    formats,
    placeholder
  })

  useEffect(() => {
    if (quill) {
      quill.on('text-change', () => {
        const content = quill.root.innerHTML
        onChange(content)
      })
    }
  }, [quill, onChange])

  // Set giá trị ban đầu
  useEffect(() => {
    if (quill && value !== quill.root.innerHTML) {
      quill.root.innerHTML = value
    }
  }, [quill, value])

  return (
    <div className={`quill-editor-container ${className}`}>
      <div ref={quillRef} />
    </div>
  )
}

export default QuillEditor
