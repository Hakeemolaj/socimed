'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, XMarkIcon, UserPlusIcon, ClockIcon, CheckIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

interface SearchUser {
  id: string
  name: string | null
  image: string | null
  username: string | null
  status: 'none' | 'sent' | 'received' | 'accepted' | 'rejected' | 'friends'
}

export default function UserSearch() {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchUser[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Search for users when query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (query.trim().length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        } else {
          console.error('Error searching users')
        }
      } catch (error) {
        console.error('Error searching users:', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchUsers, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSendRequest = async (userId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/friends/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        // Update the user's status in the results
        setResults(results.map(user => 
          user.id === userId ? { ...user, status: 'sent' } : user
        ))
        toast.success('Friend request sent')
      } else {
        const data = await response.json()
        toast.error(data.error || 'Failed to send friend request')
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
      toast.error('Failed to send friend request')
    }
  }

  const handleAcceptRequest = async (userId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/friends/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        // Update the user's status in the results
        setResults(results.map(user => 
          user.id === userId ? { ...user, status: 'friends' } : user
        ))
        toast.success('Friend request accepted')
      } else {
        toast.error('Failed to accept friend request')
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
      toast.error('Failed to accept friend request')
    }
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
            }}
            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      <AnimatePresence>
        {isOpen && (query.trim().length >= 2 || results.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 mt-2 w-full rounded-lg bg-white dark:bg-gray-900 shadow-lg max-h-96 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
              <div className="p-2">
                {results.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <Link href={`/profile/${user.id}`} className="flex items-center gap-2 flex-1">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        <Image
                          src={user.image || '/default-avatar.jpg'}
                          alt={user.name || 'User'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        {user.username && (
                          <div className="text-xs text-gray-500">@{user.username}</div>
                        )}
                      </div>
                    </Link>

                    {/* Action button based on relationship status */}
                    <div>
                      {user.status === 'none' && (
                        <button
                          onClick={() => handleSendRequest(user.id)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                          title="Send friend request"
                        >
                          <UserPlusIcon className="h-5 w-5" />
                        </button>
                      )}
                      {user.status === 'sent' && (
                        <div
                          className="p-2 text-gray-400"
                          title="Friend request sent"
                        >
                          <ClockIcon className="h-5 w-5" />
                        </div>
                      )}
                      {user.status === 'received' && (
                        <button
                          onClick={() => handleAcceptRequest(user.id)}
                          className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"
                          title="Accept friend request"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      {user.status === 'friends' && (
                        <div
                          className="p-2 text-blue-500"
                          title="Friends"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : query.trim().length >= 2 ? (
              <div className="p-4 text-center text-gray-500">No users found</div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 