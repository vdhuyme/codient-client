import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, ChevronLeft, Loader } from 'lucide-react'
import { Link } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { InputField } from '@/components/customs/form.field'
import { Button } from '@/components/customs/button'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const schema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email')
  })

  const methods = useForm({
    resolver: zodResolver(schema)
  })
  const {
    reset,
    formState: { isValid }
  } = methods

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const onSubmit = async (data) => {
    toast.error('This feature is under development')
    return
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

      {/* Back to login */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-4 left-4 z-20"
      >
        <Link to="/login" className="inline-flex items-center text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Login
        </Link>
      </motion.div>

      <div className="relative z-10 container mx-auto flex min-h-screen max-w-screen-xl items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm"
        >
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 backdrop-blur-sm">
              <svg className="h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-2 text-3xl font-bold text-white"
            >
              Forgot Password
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-gray-400"
            >
              {isSubmitted ? 'Check your email for reset instructions' : "Enter your email and we'll send you a link to reset your password"}
            </motion.p>
          </div>

          {!isSubmitted ? (
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

                <Button
                  disabled={isLoading || !isValid}
                  icon={
                    isLoading ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    )
                  }
                  type="submit"
                >
                  Send Reset Link
                </Button>
              </motion.form>
            </FormProvider>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg bg-indigo-500/10 p-6 text-center"
            >
              <svg
                className="mx-auto mb-4 h-12 w-12 text-indigo-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mb-2 text-xl font-medium text-white">Check Your Email</h3>
              <p className="text-gray-300">We&apos;ve sent a password reset link to your email</p>
              <p className="mt-4 text-sm text-gray-400">
                Didn&apos;t receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => {
                    setIsSubmitted(false)
                    reset()
                  }}
                  className="font-medium text-indigo-400 hover:text-indigo-300"
                >
                  try again
                </button>
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-400">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
                Back to login
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
