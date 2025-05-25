import React from 'react'

import { motion } from 'framer-motion'
import { useState } from 'react'

const Tabs = ({ defaultValue, children, className = '', ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div className={`w-full ${className}`} {...props}>
      <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
    </div>
  )
}

const TabsContext = React.createContext()

const TabsList = ({ children, className = '' }) => {
  return <div className={`flex space-x-1 rounded-lg border border-indigo-500/20 bg-slate-800/50 p-1 backdrop-blur-sm ${className}`}>{children}</div>
}

const TabsTrigger = ({ value, children, className = '' }) => {
  const { activeTab, setActiveTab } = React.useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <motion.button
      onClick={() => setActiveTab(value)}
      className={`relative rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${isActive ? 'text-white' : 'text-gray-400 hover:text-gray-300'} ${className} `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-md border border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

const TabsContent = ({ value, children, className = '' }) => {
  const { activeTab } = React.useContext(TabsContext)

  if (activeTab !== value) return null

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`mt-4 ${className}`}>
      {children}
    </motion.div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
