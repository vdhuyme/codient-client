import { motion } from 'framer-motion'
import { Mail, ArrowRight, ChevronLeft, Loader } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { InputField, PasswordField } from '@/components/customs/form.field'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { login } from '@/api/auth'
import { useAuth } from '@/contexts/auth'
import { Button } from '@/components/customs/button'

const LoginPage = () => {
  const schema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1, 'Password is required')
  })

  const methods = useForm({
    resolver: zodResolver(schema)
  })

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { setAuthToken } = useAuth()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const { token } = await login(data)
      setAuthToken(token)
      navigate('/')
    } catch (error) {
      toast.error(error.data.message ?? 'An error when handle login')
      console.log('Fail to login: ', error)
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
          {/* Left side - Login Form */}
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
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-gray-400"
              >
                Sign in to your account to continue
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
                  name="email"
                  label="Email"
                  type="text"
                  placeholder="johndoe@example.com"
                  icon={<Mail className="h-5 w-5 text-indigo-400" />}
                  autoFocus
                  tabIndex={1}
                />

                <PasswordField name="password" placeholder="Enter your password" tabIndex={2} />

                <div className="flex items-center">
                  <Link to="/forgot-password" className="text-xs font-medium text-indigo-400 transition-colors hover:text-indigo-300">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  disabled={isLoading}
                  icon={
                    isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )
                  }
                  type="submit"
                >
                  Sign in
                </Button>
              </motion.form>
            </FormProvider>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-slate-900/50 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant={'secondary'}
                  disabled={isLoading}
                  icon={
                    isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                    )
                  }
                  type="submit"
                >
                  Sign in with Google
                </Button>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 text-center text-sm text-gray-400"
            >
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sign up
              </Link>
            </motion.p>
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
                      d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Secure Login</h2>
                <p className="mt-2 text-gray-300">Your data is protected with industry-leading encryption and security practices.</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="z-10 mt-auto text-center"
              >
                <p className="text-sm text-gray-400">
                  By signing in, you agree to our{' '}
                  <Link href="/terms" className="text-indigo-400 hover:text-indigo-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300">
                    Privacy Policy
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
