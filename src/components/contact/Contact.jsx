import { useState } from 'react'
import './contact.css'
import { z } from 'zod'
import { useRef } from 'react'
import { toast } from 'sonner'
import { contactSchema } from './validation'
import { sendEmail } from './email-service'
import { motion } from 'framer-motion'
import FormField from '../ui/form-field'

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

  const contactMethods = [
    {
      icon: 'bx bx-mail-send',
      title: 'Email',
      data: 'voduchuy2001@gmail.com',
      href: 'mailto:voduchuy2001@gmail.com',
      buttonText: 'Write me'
    },
    {
      icon: 'bx bx-phone',
      title: 'Phone number',
      data: '(+84) 962 785 101',
      href: 'tel:0962785101',
      buttonText: 'Call me'
    }
  ]

  return (
    <section id="contact" className="contact section">
      <h2 className="section__title">Let&apos;s Connect</h2>
      <span className="section__subtitle">Feel free to reach out</span>

      <div className="contact__container container grid">
        {/* Contact methods */}
        <div className="contact__content">
          <h3 className="contact__title">Reach me directly</h3>

          <div className="contact__info">
            {contactMethods.map((method, index) => (
              <div className="contact__card" key={index}>
                <i className={`${method.icon} contact__card__icon`}></i>

                <h3 className="contact__card__title">{method.title}</h3>
                <span className="contact__card__data">{method.data}</span>
                <a href={method.href} className="contact__card__button">
                  {method.buttonText}
                  <i className="bx bx-right-arrow-alt contact__button__icon"></i>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact form */}
        <div className="contact__content">
          <h3 className="contact__title">Send me a message</h3>

          <form ref={form} onSubmit={sendContact} className="contact__form" autoComplete="off">
            <FormField
              id="name"
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleOnChange}
              error={errors.name}
              placeholder="John Doe"
            />
            <FormField
              id="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleOnChange}
              error={errors.email}
              placeholder="example@email.com"
            />
            <FormField
              id="message"
              name="message"
              label="Your Message"
              value={formData.message}
              onChange={handleOnChange}
              error={errors.message}
              placeholder="Type your message here..."
              isTextarea
            />

            <motion.button disabled={isLoading} className="button button__flex" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              {isLoading && <span className="loader" />}
              Send Message
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
