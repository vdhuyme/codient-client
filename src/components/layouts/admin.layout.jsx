import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Home,
  Users,
  Settings,
  Bell,
  Search,
  User,
  LogOut,
  Sparkles,
  Tag,
  ChartColumnStacked,
  Notebook,
  MessageCircle,
  Globe
} from 'lucide-react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useAuth } from '@/contexts/auth'
import Button from '../ui/button'
import { useAuthorize } from '@/contexts/authorize'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close sidebar
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
        setSidebarOpen(false)
      }

      // Close user menu
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen, userMenuOpen])

  const menuItems = [
    { id: 'stats', label: 'Stats', icon: Home, path: '/admin/stats' },
    { id: 'categories', label: 'Categories', icon: ChartColumnStacked, path: '/admin/categories' },
    { id: 'tags', label: 'Tags', icon: Tag, path: '/admin/tags' },
    { id: 'posts', label: 'Posts', icon: Notebook, path: '/admin/posts' },
    { id: 'comments', label: 'Comments', icon: MessageCircle, path: '/admin/comments' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' }
  ]
  const [dialogOpen, setDialogOpen] = useState(false)
  const { logout } = useAuth()
  const { user } = useAuthorize()

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Logout Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogClose onClose={() => setDialogOpen(false)} />
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>Are you sure you want to perform this action? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => logout()}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Elegant gradient background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(79, 70, 229, 0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.15), transparent 50%)'
          }}
        />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0 z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-indigo-400/30"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.3 + 0.1
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear'
            }}
            style={{
              boxShadow: '0 0 4px 1px rgba(79, 70, 229, 0.2)'
            }}
          />
        ))}
      </div>

      {/* Sidebar - Reduced z-index to ensure dialog stays on top */}
      <AnimatePresence>
        <motion.aside
          className="sidebar fixed top-0 left-0 z-30 h-full w-64 border-r border-indigo-500/20 bg-slate-900/95 backdrop-blur-xl"
          initial={{ x: -256 }}
          animate={{ x: sidebarOpen || (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : -256 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          {/* Sidebar gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-purple-500/5" />

          <div className="relative z-10 flex h-full flex-col">
            {/* Logo section */}
            <motion.div
              className="flex h-16 items-center justify-center border-b border-indigo-500/20 px-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.div>
                <Link
                  to={'/admin/stats'}
                  className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent uppercase"
                >
                  Huy D. Vo
                </Link>
              </div>
            </motion.div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
              {menuItems.map((item, index) => {
                const Icon = item.icon

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `group relative flex w-full items-center space-x-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                          isActive
                            ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10'
                            : 'text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-300'
                        }`
                      }
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false)
                        }
                      }}
                    >
                      <Icon className="h-5 w-5 transition-colors" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  </motion.div>
                )
              })}
            </nav>

            {/* User profile section */}
            <motion.div
              className="border-t border-indigo-500/20 p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 rounded-lg bg-indigo-500/10 p-3 backdrop-blur-sm">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 p-0.5">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900">
                    <User className="h-4 w-4 text-indigo-300" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{user?.name}</p>
                  <p className="truncate text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Mobile sidebar overlay - Reduced z-index */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative lg:ml-64">
        {/* Header */}
        <motion.header
          className="sticky top-0 z-20 border-b border-indigo-500/20 bg-slate-900/95 backdrop-blur-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <motion.button
              className="menu-button rounded-lg p-2 text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-300 lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>

            {/* Search bar */}
            <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-start">
              <div className="w-full max-w-lg lg:max-w-xs">
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <motion.input
                    className="block w-full rounded-lg border border-indigo-500/20 bg-slate-800/50 py-2 pr-3 pl-10 text-sm text-white placeholder-gray-400 focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/40 focus:outline-none"
                    placeholder="Search..."
                    type="search"
                    whileFocus={{ scale: 1.02 }}
                  />
                </div>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-0 md:space-x-3">
              {/* Go to posts */}
              <motion.button
                title="View website"
                className="relative rounded-lg p-2 text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={'/posts'}>
                  <Globe className="h-6 w-6 text-indigo-300" />
                </Link>
              </motion.button>

              {/* Notifications */}
              <motion.button
                title="Notification"
                className="relative rounded-lg p-2 text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="h-6 w-6 text-indigo-300" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </motion.button>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <motion.button
                  title="User actions"
                  className="flex items-center space-x-2 rounded-lg p-2 text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-300"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900">
                    <User className="h-6 w-6 text-indigo-300" />
                  </div>
                </motion.button>

                {/* User dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 rounded-lg border border-indigo-500/20 bg-slate-900/95 shadow-xl backdrop-blur-xl"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="py-2">
                        <Link
                          to="/admin/profile"
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <User className="mr-3 h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          to="/admin/settings"
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Settings className="mr-3 h-4 w-4" />
                          Settings
                        </Link>
                        <hr className="my-2 border-indigo-500/20" />
                        <button
                          className="flex w-full items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                          onClick={() => setDialogOpen(true)}
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main content area */}
        <motion.main className="flex-1 p-4 sm:p-6 lg:p-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Outlet />
        </motion.main>
      </div>
    </div>
  )
}

export default AdminLayout
