import { useState } from 'react'
import './contact.css'
import { z } from 'zod'
import { useRef } from 'react'
import { toast } from 'sonner'
import { contactSchema } from './validation'
import { sendEmail } from './email-service'
import { motion } from 'framer-motion'

const Contact = () => {
  const form = useRef()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleOnChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }))
    setErrors((previous) => ({
      ...previous,
      [name]: ''
    }))
  }

  const handleValidationErrors = (error) => {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [err.path[0]]: err.message
        }))
      })
    }
  }

  const handleSubmitSuccess = (response) => {
    console.log(response)
    setFormData({
      email: '',
      name: '',
      message: ''
    })
    setIsLoading(false)
    toast.success('Submitted successfully')
  }

  const handleSubmitError = (error) => {
    console.log(error)
    setFormData({
      email: '',
      name: '',
      message: ''
    })
    setIsLoading(false)
    toast.error('Error in processing')
  }

  const sendContact = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      contactSchema.parse(formData)
      const response = await sendEmail(form.current)
      handleSubmitSuccess(response)
    } catch (error) {
      setIsLoading(false)
      handleValidationErrors(error)
      if (error.response) {
        handleSubmitError(error)
      }
    }
  }

  return (
    <section id="contact" className="contact section">
      <h2 className="section__title">Get In Touch</h2>
      <span className="section__subtitle">Contact For Work</span>

      <div className="contact__container container grid">
        <div className="contact__content">
          <h3 className="contact__title">Talk to me</h3>

          <div className="contact__info">
            <div className="contact__card">
              <i className="bx bx-mail-send contact__card__icon"></i>

              <h3 className="contact__card__title">Email</h3>
              <span className="contact__card__data">voduchuy2001@gmail.com</span>
              <a href="mailto:voduchuy2001@gmail.com" className="contact__card__button">
                Write me
                <i className="bx bx-right-arrow-alt contact__button__icon"></i>
              </a>
            </div>

            <div className="contact__card">
              <i className="bx bx-phone contact__card__icon"></i>

              <h3 className="contact__card__title">Phone nmber</h3>
              <span className="contact__card__data">(+84) 962 785 101</span>
              <a href="callto:0962785101" className="contact__card__button">
                Call me
                <i className="bx bx-right-arrow-alt contact__button__icon"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="contact__content">
          <h3 className="contact__title">Compose your message for me</h3>

          <form ref={form} onSubmit={sendContact} className="contact__form">
            <div className="contact__form__div">
              <label htmlFor="name" className="contact__form__tag">
                Name
              </label>

              <input
                name="name"
                id="name"
                value={formData.name}
                onChange={handleOnChange}
                type="text"
                placeholder="Enter your name"
                className="contact__form__input"
              />
              {errors.name && <span className="text__error">{errors.name}</span>}
            </div>

            <div className="contact__form__div">
              <label htmlFor="" className="contact__form__tag">
                Email
              </label>

              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleOnChange}
                type="text"
                placeholder="Enter your email"
                className="contact__form__input"
              />
              {errors.email && <span className="text__error">{errors.email}</span>}
            </div>

            <div className="contact__form__div contact__form__area">
              <label htmlFor="" className="contact__form__tag">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleOnChange}
                cols="20"
                rows="10"
                placeholder="Enter your message"
                className="contact__form__input"
              ></textarea>
              {errors.message && <span className="text__error">{errors.message}</span>}
            </div>

            <motion.button disabled={isLoading} className="button button__flex" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {isLoading && <span className="loader"></span>} Send Message
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
