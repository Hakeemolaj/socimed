'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Friend {
  id: string
  name: string
  image: string
  userId: string
}

export default function FriendList() {
  const { data: session } = useSession()
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchFriends()
    }
  }, [session])

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends')
      const data = await response.json()
      setFriends(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching friends:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>
  }

  if (friends.length === 0) {
    return <div className="p-4 text-center">No friends yet</div>
  }

  return (
    <div className="p-2 max-h-72 overflow-y-auto">
      <h3 className="text-md font-semibold mb-2">Friends</h3>
      <div className="space-y-2">
        {friends.map((friend) => (
          <motion.div 
            key={friend.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <Link href={`/profile/${friend.userId}`} className="flex items-center gap-2 w-full">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={friend.image || '/default-avatar.jpg'}
                  alt={friend.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium">{friend.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 