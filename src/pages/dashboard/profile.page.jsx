import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Lock, Phone, Mail, Save, Eye, EyeOff, Check, X } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { PROFILE_SCHEMA, PASSWORD_SCHEMA } from './schema/profile.schema'
import toast from 'react-hot-toast'

import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import { DatePicker } from '@/components/ui/date-picker'
import FileUpload from '@/components/ui/file-upload'
import { useAuthorize } from '@/contexts/authorize'
import { changePassword, me, updateProfile } from '@/api/auth'
import Label from '@/components/ui/label'
import { format } from 'date-fns'

const tabs = [
  {
    id: 'personal',
    label: 'Personal Information',
    icon: User,
    description: 'Update your personal details'
  },
  {
    id: 'password',
    label: 'Change Password',
    icon: Lock,
    description: 'Update your account password'
  }
]

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { user } = useAuthorize()

  // Profile form
  const {
    handleSubmit: handleSubmitProfile,
    control: profileControl,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting }
  } = useForm({
    resolver: zodResolver(PROFILE_SCHEMA),
    defaultValues: {
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      dob: user?.dob || '',
      avatar: user?.avatar || ''
    }
  })

  // Password form
  const {
    handleSubmit: handleSubmitPassword,
    control: passwordControl,
    watch: watchPassword,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    reset: resetPassword
  } = useForm({
    resolver: zodResolver(PASSWORD_SCHEMA)
  })

  // Watch password fields for validation feedback
  const passwordData = watchPassword()

  // Handle profile update
  const handleUpdateProfile = async (data) => {
    try {
      const date = typeof data.dob === 'string' ? new Date(data.dob) : data.dob
      const formattedDob = date ? format(date, 'yyyy-MM-dd') : null
      const payload = { ...data, dob: formattedDob }

      await updateProfile(payload)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  // Handle password change
  const handleChangePassword = async (data) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      })
      resetPassword()
      toast.success('Password changed successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to change password')
    }
  }

  const FormField = ({ label, required, error, children }) => (
    <div className="space-y-2">
      <Label required={required}>{label}</Label>
      {children}
      {error && <p className="text-sm text-red-400">{error.message}</p>}
    </div>
  )

  // Update personal info form
  const renderPersonalInfoTab = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
        <div className="group relative">
          <FormField label="Avatar" error={profileErrors.avatar}>
            <Controller
              name="avatar"
              control={profileControl}
              render={({ field }) => <FileUpload value={field.value} onChange={field.onChange} placeholder="Upload avatar image" />}
            />
          </FormField>
        </div>

        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-white">{user?.name}</h3>
          <p className="text-gray-400">{user?.email}</p>
          <p className="mt-2 text-sm text-indigo-400">Click on avatar to change photo</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="Full Name" required error={profileErrors.name}>
          <Controller
            name="name"
            control={profileControl}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your full name"
                className={profileErrors.name ? 'border-red-500' : ''}
                icon={<User className="h-4 w-4" />}
              />
            )}
          />
        </FormField>

        <FormField label="Email Address" error={profileErrors.email}>
          <Input value={user?.email} disabled icon={<Mail className="h-4 w-4" />} className="opacity-60" />
          <p className="text-xs text-gray-500">Email cannot be changed</p>
        </FormField>

        <FormField label="Phone Number" error={profileErrors.phoneNumber}>
          <Controller
            name="phoneNumber"
            control={profileControl}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your phone number"
                className={profileErrors.phoneNumber ? 'border-red-500' : ''}
                icon={<Phone className="h-4 w-4" />}
              />
            )}
          />
        </FormField>

        <FormField label="Date of Birth" error={profileErrors.dob}>
          <Controller
            name="dob"
            control={profileControl}
            render={({ field }) => <DatePicker {...field} minDate={new Date('1950-01-01')} maxDate={new Date()} />}
          />
        </FormField>
      </div>

      {/* Save Button */}
      <div className="flex justify-end border-t border-indigo-500/20 pt-6">
        <Button onClick={handleSubmitProfile(handleUpdateProfile)} loading={isProfileSubmitting} className="min-w-[120px]">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </motion.div>
  )

  // Update password form
  const renderPasswordTab = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 p-4">
        <div className="flex items-start space-x-3">
          <Lock className="mt-0.5 h-5 w-5 text-indigo-400" />
          <div>
            <h4 className="text-sm font-medium text-indigo-300">Password Security</h4>
            <p className="mt-1 text-sm text-gray-400">
              Choose a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <FormField label="Current Password" required error={passwordErrors.oldPassword}>
          <div className="relative">
            <Controller
              name="oldPassword"
              control={passwordControl}
              render={({ field }) => (
                <Input
                  {...field}
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  className={passwordErrors.oldPassword ? 'border-red-500' : ''}
                  icon={<Lock className="h-4 w-4" />}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>

        <FormField label="New Password" required error={passwordErrors.newPassword}>
          <div className="relative">
            <Controller
              name="newPassword"
              control={passwordControl}
              render={({ field }) => (
                <Input
                  {...field}
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                  icon={<Lock className="h-4 w-4" />}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>

        <FormField label="Confirm Password" required error={passwordErrors.confirmationPassword}>
          <div className="relative">
            <Controller
              name="confirmationPassword"
              control={passwordControl}
              render={({ field }) => (
                <Input
                  {...field}
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  className={passwordErrors.confirmationPassword ? 'border-red-500' : ''}
                  icon={<Lock className="h-4 w-4" />}
                />
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordData?.newPassword && passwordData?.confirmationPassword && passwordData.newPassword === passwordData.confirmationPassword && (
            <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 text-sm text-green-400">
              <Check className="h-3 w-3" />
              Passwords match
            </motion.p>
          )}
        </FormField>
      </div>

      {/* Change Password Button */}
      <div className="flex justify-end border-t border-indigo-500/20 pt-6">
        <Button onClick={handleSubmitPassword(handleChangePassword)} loading={isPasswordSubmitting} className="min-w-[140px]">
          <Lock className="mr-2 h-4 w-4" />
          Change Password
        </Button>
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="mt-2 text-gray-400">Manage your account settings and preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full rounded-lg border p-4 text-left transition-all duration-200 ${
                    isActive
                      ? 'border-indigo-500/40 bg-indigo-500/20 text-indigo-300'
                      : 'border-slate-700/50 bg-slate-800/50 text-gray-400 hover:border-slate-600/50 hover:bg-slate-700/50 hover:text-gray-300'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isActive ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-sm opacity-70">{tab.description}</div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3">
          <div className="rounded-xl border border-indigo-500/20 bg-slate-900/50 p-6 backdrop-blur-sm sm:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && (
                <div key="personal">
                  <div className="mb-6">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                      <User className="h-5 w-5 text-indigo-400" />
                      Personal Information
                    </h2>
                    <p className="mt-1 text-gray-400">Update your personal details and profile picture</p>
                  </div>
                  {renderPersonalInfoTab()}
                </div>
              )}

              {activeTab === 'password' && (
                <div key="password">
                  <div className="mb-6">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
                      <Lock className="h-5 w-5 text-indigo-400" />
                      Change Password
                    </h2>
                    <p className="mt-1 text-gray-400">Update your account password for better security</p>
                  </div>
                  {renderPasswordTab()}
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage
