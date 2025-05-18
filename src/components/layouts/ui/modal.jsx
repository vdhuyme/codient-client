import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import { motion, AnimatePresence } from 'framer-motion'

const Modal = ({ isOpen, onClose, title, children, size = 'medium', closeOnOutsideClick = true }) => {
  const modalRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 576)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscKey)

    if (isOpen) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }

    return () => {
      window.removeEventListener('keydown', handleEscKey)
      document.body.classList.remove('modal-open')
    }
  }, [isOpen, onClose])

  const handleOutsideClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose()
    }
  }

  const modalVariants = {
    initial: { y: '100%', opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    exit: {
      y: '100%',
      opacity: 0,
      transition: {
        type: 'tween',
        duration: 0.2,
        ease: 'easeIn'
      }
    }
  }

  const overlayVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal__overlay"
          onClick={handleOutsideClick}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={overlayVariants}
        >
          <motion.div
            className={`modal__container modal__container--${size}`}
            ref={modalRef}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={modalVariants}
            drag={isMobile ? 'y' : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.7}
            onDragEnd={(e, info) => {
              if (isMobile && info.offset.y > 100) {
                onClose()
              }
            }}
          >
            {isMobile && <div className="modal__drag-handle" />}

            <div className="modal__header">
              <h3 className="modal__title">{title}</h3>
              <button className="modal__close" onClick={onClose} aria-label="Close modal">
                <i className="bx bx-x"></i>
              </button>
            </div>

            <div className="modal__content">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return createPortal(modalContent, document.body)
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  closeOnOutsideClick: PropTypes.bool
}

export default Modal
