import { Button } from '@/components/customs/button'
import { InputField, PasswordField } from '@/components/customs/form.field'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, User, ArrowRight, ChevronLeft, Loader } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import GoogleOAuth2 from './google.oauth2'
import { REGISTER_SCHEMA } from './schema/register.schema'
import { register } from '@/api/auth'
import { useAuth } from '@/contexts/auth'

const RegisterPage = () => {
  const methods = useForm({
    resolver: zodResolver(REGISTER_SCHEMA)
  })

  const {
    formState: { isValid }
  } = methods

  const [isLoading, setIsLoading] = useState(false)
  const [allowCondition, setAllowCondition] = useState(true)
  const navigate = useNavigate()
  const { setAuthToken } = useAuth()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const { accessToken, refreshToken } = await register(data)
      setAuthToken({ accessToken, refreshToken })
      navigate('/')
    } catch (error) {
      toast.error(error?.data?.message || 'An error occurred during register')
      console.error('Fail to register:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(79,70,229,0.3),rgba(15,23,42,0.9))]" />
      </div>

      {/* Subtle particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.3 + 0.2,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear'
            }}
            style={{
              boxShadow: `0 0 ${Math.random() * 5 + 2}px ${Math.random() * 1 + 0.5}px rgba(79, 70, 229, 0.3)`
            }}
          />
        ))}
      </div>

      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 z-20"
      >
        <Link to="/" className="inline-flex items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>

      <div className="relative z-10 container mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-4 py-12">
        <div className="flex w-full max-w-6xl flex-col-reverse overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/50 shadow-xl backdrop-blur-sm md:flex-row">
          {/* Left side - Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full p-8 md:w-1/2 md:p-12"
          >
            <div className="mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-2 text-3xl font-bold text-white"
              >
                Create an Account
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-400"
              >
                Join our community and get started today
              </motion.p>
            </div>

            <FormProvider {...methods}>
              <motion.form
                onSubmit={methods.handleSubmit(onSubmit)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-6"
              >
                <InputField
                  name="name"
                  label="Full name"
                  type="text"
                  placeholder="John Doe"
                  icon={<User className="h-5 w-5 text-indigo-400" />}
                  autoFocus
                  tabIndex={1}
                />

                <InputField
                  name="email"
                  label="Email"
                  type="text"
                  placeholder="johndoe@example.com"
                  icon={<Mail className="h-5 w-5 text-indigo-400" />}
                  tabIndex={2}
                />

                <div className="space-y-2">
                  <PasswordField name="password" placeholder="Enter your password" tabIndex={3} />
                  <p className="text-xs text-gray-500">Password must be at least 8 characters long and include a number and a special character.</p>
                </div>

                <div className="flex items-center">
                  <input
                    tabIndex={4}
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    checked={allowCondition}
                    onChange={(e) => setAllowCondition(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                    I agree to the{' '}
                    <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  tabIndex={5}
                  disabled={isLoading || !allowCondition || !isValid}
                  icon={
                    isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )
                  }
                  type="submit"
                >
                  Create Account
                </Button>
              </motion.form>
            </FormProvider>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-slate-900/50 px-2 text-gray-400">Or sign in with</span>
                </div>
              </div>

              <div className="mt-6">
                <GoogleOAuth2 />
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Image and Branding */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative hidden w-1/2 bg-indigo-900/20 md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900/90">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(79,70,229,0.4),rgba(15,23,42,0))]" />
            </div>

            <div className="relative flex h-full flex-col items-center justify-center p-12">
              {/* Animated circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-500/20"
                    initial={{
                      width: 100 + i * 100,
                      height: 100 + i * 100,
                      opacity: 0.1 - i * 0.02
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.1 - i * 0.02, 0.15 - i * 0.02, 0.1 - i * 0.02]
                    }}
                    transition={{
                      duration: 6 + i * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: 'reverse',
                      delay: i * 0.5
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="z-10 mb-8 text-center"
              >
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 backdrop-blur-sm">
                  <svg className="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Join Our Community</h2>
                <p className="mt-2 text-gray-300">Create an account to access exclusive features and personalized content.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="z-10 mt-auto text-center"
              >
                <p className="text-sm text-gray-400">We value your privacy and are committed to protecting your personal data.</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
