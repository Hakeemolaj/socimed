'use client'

import { useState } from 'react'
import { Tab } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { BellIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import FriendList from './FriendList'
import FriendRequests from './FriendRequests'

export default function FriendsMenu() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex border-b border-gray-200 dark:border-gray-700">
          <Tab 
            className={({ selected }) => 
              `w-1/2 py-3 text-sm font-medium flex items-center justify-center gap-1 focus:outline-none ${
                selected 
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            <UserGroupIcon className="w-4 h-4" />
            Friends
          </Tab>
          <Tab 
            className={({ selected }) => 
              `w-1/2 py-3 text-sm font-medium flex items-center justify-center gap-1 focus:outline-none ${
                selected 
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`
            }
          >
            <BellIcon className="w-4 h-4" />
            Requests
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <AnimatePresence mode="wait">
            <Tab.Panel
              as={motion.div}
              key="friends"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FriendList />
            </Tab.Panel>
            <Tab.Panel
              as={motion.div}
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FriendRequests />
            </Tab.Panel>
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>
    </div>
  )
} 