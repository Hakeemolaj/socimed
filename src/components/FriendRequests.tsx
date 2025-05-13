'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/Button'
import { toast } from 'react-hot-toast'
import { CheckIcon, XMarkIcon, UserIcon } from '@heroicons/react/24/outline'

interface FriendRequest {
  id: string
  name: string
  image: string
  userId: string
}

export default function FriendRequests() {
  const { data: session } = useSession()
  const [requests, setRequests] = useState<FriendRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (session?.user) {
      fetchFriendRequests()
    }
  }, [session])

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests')
      if (!response.ok) {
        throw new Error('Failed to fetch friend requests')
      }
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error('Error fetching friend requests:', error)
      toast.error('Failed to load friend requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (userId: string, action: 'accept' | 'reject') => {
    if (processingIds.has(userId)) return
    
    // Add to processing set
    setProcessingIds(prev => new Set(prev).add(userId))
    
    try {
      const endpoint = action === 'accept' ? '/api/friends/accept' : '/api/friends/reject'
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || `Failed to ${action} friend request`)
      }
      
      // Remove from the requests list
      setRequests(requests.filter(req => req.userId !== userId))
      toast.success(`Friend request ${action === 'accept' ? 'accepted' : 'rejected'}`)
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error)
      toast.error(error instanceof Error ? error.message : `Failed to ${action} friend request`)
    } finally {
      // Remove from processing set
      setProcessingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-slate-700 rounded"></div>
          <div className="h-10 bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="p-4 text-center">
        <UserIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <p className="text-gray-400">No friend requests</p>
      </div>
    )
  }

  return (
    <div className="p-2 max-h-72 overflow-y-auto">
      <h3 className="text-md font-semibold mb-2">Friend Requests</h3>
      <AnimatePresence>
        {requests.map((request) => (
          <motion.div 
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-2 my-1 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={request.image || '/default-avatar.jpg'}
                  alt={request.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium">{request.name}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAction(request.userId, 'accept')}
                disabled={processingIds.has(request.userId)}
                isLoading={processingIds.has(request.userId) && requests.some(r => r.userId === request.userId)}
                leftIcon={<CheckIcon className="h-4 w-4" />}
              >
                Accept
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleAction(request.userId, 'reject')}
                disabled={processingIds.has(request.userId)}
                leftIcon={<XMarkIcon className="h-4 w-4" />}
              >
                Decline
              </Button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
} 