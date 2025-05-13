'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BellIcon, CheckIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/context/ThemeContext'

interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  read: boolean
  type: 'message' | 'like' | 'comment' | 'follow' | 'mention' | 'share' | 'achievement' | 'update'
}

// Extended mock notifications data
const allMockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Message',
    message: 'Sarah Wilson sent you a message',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    read: false,
    type: 'message'
  },
  {
    id: '2',
    title: 'Post Liked',
    message: 'Mike Johnson and 5 others liked your post',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: true,
    type: 'like'
  },
  {
    id: '3',
    title: 'New Comment',
    message: 'Emma Davis commented: "Great post! 👏"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    read: false,
    type: 'comment'
  },
  {
    id: '4',
    title: 'New Follower',
    message: 'Alex Thompson started following you',
    timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    read: true,
    type: 'follow'
  },
  {
    id: '5',
    title: 'Mention',
    message: 'Chris Lee mentioned you in a comment',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    read: false,
    type: 'mention'
  },
  {
    id: '6',
    title: 'Post Shared',
    message: 'Your post was shared by David Wang',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    read: false,
    type: 'share'
  },
  {
    id: '7',
    title: 'Achievement Unlocked',
    message: 'You reached 1,000 followers! 🎉',
    timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    read: true,
    type: 'achievement'
  },
  {
    id: '8',
    title: 'System Update',
    message: 'New features are now available',
    timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    read: true,
    type: 'update'
  }
]

const ITEMS_PER_PAGE = 5

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -10,
    transition: {
      duration: 0.2
    }
  }
}

const notificationVariants = {
  initial: { 
    opacity: 0, 
    x: -20,
    scale: 0.95
  },
  animate: (index: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: index * 0.1,
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }),
  exit: { 
    opacity: 0, 
    x: -50,
    transition: {
      duration: 0.2
    }
  },
  hover: { 
    scale: 1.02,
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  tap: { 
    scale: 0.98
  }
}

// Initial fixed positions for background orbs
const initialOrbs = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  size: 40,
  x: (i * 20) % 100,
  y: (i * 15) % 100,
  duration: 15,
  delay: i * 0.3,
}))

export default function NotificationsPage() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(allMockNotifications)
  const [selectedType, setSelectedType] = useState<Notification['type'] | 'all'>('all')
  const [page, setPage] = useState(1)
  const [showDropdown, setShowDropdown] = useState(false)
  const [orbs, setOrbs] = useState(initialOrbs)

  useEffect(() => {
    setMounted(true)
    
    // Generate random orb positions after mounting
    setOrbs(prev => prev.map(orb => ({
      ...orb,
      size: Math.random() * 60 + 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    })))
  }, [])

  const filteredNotifications = notifications.filter(
    notif => selectedType === 'all' || notif.type === selectedType
  )

  const paginatedNotifications = filteredNotifications.slice(
    0,
    page * ITEMS_PER_PAGE
  )

  const hasMore = paginatedNotifications.length < filteredNotifications.length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const clearNotifications = () => {
    setNotifications([])
    setPage(1)
  }

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return '💬'
      case 'like':
        return '❤️'
      case 'comment':
        return '💭'
      case 'follow':
        return '👤'
      case 'mention':
        return '@️'
      case 'share':
        return '🔄'
      case 'achievement':
        return '🏆'
      case 'update':
        return '🔔'
      default:
        return '📢'
    }
  }

  const notificationTypes: { type: Notification['type'] | 'all'; label: string }[] = [
    { type: 'all', label: 'All' },
    { type: 'message', label: 'Messages' },
    { type: 'like', label: 'Likes' },
    { type: 'comment', label: 'Comments' },
    { type: 'follow', label: 'Follows' },
    { type: 'mention', label: 'Mentions' },
    { type: 'share', label: 'Shares' },
    { type: 'achievement', label: 'Achievements' },
    { type: 'update', label: 'Updates' }
  ]

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden transition-colors duration-300">
      {/* Dynamic Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <AnimatePresence>
          {mounted && orbs.map((orb) => (
            <motion.div
              key={orb.id}
              className="absolute rounded-full mix-blend-multiply filter blur-xl"
              initial={{ 
                left: `${orb.x}%`, 
                top: `${orb.y}%`,
                width: orb.size,
                height: orb.size,
                opacity: 0 
              }}
              animate={{
                left: [`${orb.x}%`, `${(orb.x + 20) % 100}%`, `${orb.x}%`],
                top: [`${orb.y}%`, `${(orb.y + 20) % 100}%`, `${orb.y}%`],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: orb.duration,
                delay: orb.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                background: theme === 'dark' 
                  ? `radial-gradient(circle at center, ${
                      orb.id % 3 === 0 ? '#93c5fd' : 
                      orb.id % 3 === 1 ? '#c4b5fd' : '#fca5a5'
                    }, transparent)`
                  : `radial-gradient(circle at center, ${
                      orb.id % 3 === 0 ? '#dbeafe' : 
                      orb.id % 3 === 1 ? '#ede9fe' : '#fee2e2'
                    }, transparent)`
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-4"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className="flex items-center justify-between mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <CheckIcon className="h-5 w-5" />
                <span>Mark all read</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearNotifications}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/10"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Clear all</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            className="relative mb-6"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-slate-800/80 hover:bg-slate-700/80 text-white'
                  : 'bg-white/80 hover:bg-slate-50/80 text-slate-900 ring-1 ring-slate-200/50'
              }`}
            >
              <span>Filter: {notificationTypes.find(t => t.type === selectedType)?.label}</span>
              <motion.div
                animate={{ rotate: showDropdown ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <ChevronDownIcon className="h-5 w-5" />
              </motion.div>
            </motion.button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`absolute z-10 mt-2 w-full rounded-xl shadow-xl backdrop-blur-sm ${
                    theme === 'dark'
                      ? 'bg-slate-800/95 ring-1 ring-white/10'
                      : 'bg-white/95 ring-1 ring-slate-200/50'
                  }`}
                >
                  <div className="py-2">
                    {notificationTypes.map(({ type, label }) => (
                      <motion.button
                        key={type}
                        whileHover={{ 
                          backgroundColor: theme === 'dark' ? "rgba(51, 65, 85, 0.5)" : "rgba(241, 245, 249, 0.5)",
                          x: 4,
                          transition: { duration: 0.2 }
                        }}
                        onClick={() => {
                          setSelectedType(type)
                          setShowDropdown(false)
                          setPage(1)
                        }}
                        className={`w-full px-4 py-2 text-left transition-colors ${
                          selectedType === type 
                            ? 'text-blue-500 bg-blue-500/10' 
                            : theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {paginatedNotifications.length > 0 ? (
              <div className="space-y-4">
                {paginatedNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    custom={index}
                    variants={notificationVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    whileTap="tap"
                    layout
                    className={`rounded-xl p-4 cursor-pointer backdrop-blur-sm ${
                      theme === 'dark'
                        ? notification.read
                          ? 'bg-slate-900/80'
                          : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 ring-1 ring-blue-500/50'
                        : notification.read
                          ? 'bg-white/80 ring-1 ring-slate-200/50'
                          : 'bg-gradient-to-r from-blue-50 to-indigo-50 ring-1 ring-blue-200'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-4">
                      <motion.div 
                        className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ring-1 ${
                          theme === 'dark'
                            ? 'bg-gradient-to-br from-slate-800 to-slate-900 ring-white/10'
                            : 'bg-gradient-to-br from-slate-50 to-white ring-slate-200/50'
                        }`}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        <span className="text-2xl">{getIcon(notification.type)}</span>
                      </motion.div>
                      <div className="flex-1">
                        <h3 className={`font-medium transition-colors ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {notification.message}
                        </p>
                        <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}>
                          {new Date(notification.timestamp).toLocaleDateString(undefined, {
                            hour: 'numeric',
                            minute: 'numeric'
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"
                        />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                className="text-center py-12"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <BellIcon className={`mx-auto h-12 w-12 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </motion.div>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  No notifications to show
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {hasMore && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadMore}
              className={`w-full mt-6 px-4 py-2 rounded-xl backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                theme === 'dark'
                  ? 'bg-slate-800/80 hover:bg-slate-700/80 text-white'
                  : 'bg-white/80 hover:bg-slate-50/80 text-slate-900 ring-1 ring-slate-200/50'
              }`}
            >
              Load more
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
} 