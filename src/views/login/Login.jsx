import { login } from '@/api/auth'
import './login.css'
import { toast } from 'react-hot-toast'
import FormField from '../../components/ui/form-field'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { loginSchema } from './validation'
import { z } from 'zod'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  })

  const handleOnChange = (event) => {
    const { name, value } = event.target
    setData((previous) => ({
      ...previous,
      [name]: value
    }))
    setErrors((previous) => ({
      ...previous,
      [name]: ''
    }))
  }

  const handleValidationErrors = (error) => {
    error.errors.forEach((err) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [err.path[0]]: err.message
      }))
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      loginSchema.parse(data)
      const { email, password } = data
      const { token } = await login({ email, password })
      localStorage.setItem('access_token', token)
      toast.success('Login success')
      window.location.href = '/dashboard'
    } catch (error) {
      setIsLoading(false)
      if (error instanceof z.ZodError) {
        handleValidationErrors(error)
      }
      if (error.data) {
        setData({ email: '', password: '' })
        toast.error(error.data.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="login section">
      <div className="login__container container">
        <div className="login__content">
          <h1 className="section__title">Login</h1>
          <span className="section__subtitle">Login to continue</span>

          <form onSubmit={handleLogin} className="login__form" autoComplete="off">
            <FormField
              id="email"
              name="email"
              label="Email Address"
              value={data.email}
              onChange={handleOnChange}
              error={errors.email}
              placeholder="example@email.com"
            />
            <FormField
              id="password"
              name="password"
              label="Password"
              type="password"
              value={data.password}
              onChange={handleOnChange}
              error={errors.password}
              placeholder="Enter password"
            />

            <motion.button disabled={isLoading} className="button button__flex" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              {isLoading && <span className="button__loader" />}
              Login
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Login
