'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import UserSearch from '@/components/UserSearch'
import Feed from '@/components/Feed'
import FriendList from '@/components/FriendList'
import { format } from 'date-fns'

export default function Home() {
  const { data: session, status } = useSession()
  const currentDate = new Date()
  const formattedDate = format(currentDate, 'EEEE, MMMM d')
  
  // Handle loading state
  if (status === 'loading') {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">Loading...</div>
      </div>
    )
  }

  // Landing page for unauthenticated users
  if (status === 'unauthenticated' || !session) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white">Welcome to Socimed</h1>
          <p className="mb-8 text-xl text-gray-600 dark:text-gray-400">
            Connect with friends, share moments, and discover what's happening around you
          </p>
          <Link
            href="/auth/signin"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-white shadow-lg transition hover:bg-blue-700"
          >
            Sign In to Get Started
          </Link>
        </div>
      </div>
    )
  }
  
  // At this point, we know session is not null
  const { user } = session
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-12">
        {/* Left sidebar */}
        <div className="md:col-span-3">
          <div className="mb-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center space-x-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full">
                <Image
                  src={user.image || '/default-avatar.jpg'}
                  alt={user.name || 'User'}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-lg font-semibold">{user.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">@{user.email?.split('@')[0] || 'user'}</div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400">{formattedDate}</div>
            </div>
          </div>
          
          <div className="mb-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold">Find Friends</h2>
            <UserSearch />
          </div>
          
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold">Friends</h2>
            <FriendList />
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-6">
          <Feed />
        </div>
        
        {/* Right sidebar */}
        <div className="hidden md:col-span-3 md:block">
          <div className="sticky top-24">
            <div className="mb-6 rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Trending Topics</h2>
              <ul className="space-y-3">
                <li className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                  <div className="font-medium">#NextJS</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1,245 posts</div>
                </li>
                <li className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                  <div className="font-medium">#ReactJS</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">892 posts</div>
                </li>
                <li className="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
                  <div className="font-medium">#TailwindCSS</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">578 posts</div>
                </li>
              </ul>
            </div>
            
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
              <h2 className="mb-4 text-xl font-semibold">Suggested For You</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-300">
                      <Image 
                        src="/default-avatar.jpg" 
                        alt="Suggested User" 
                        fill 
                        sizes="40px"
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <div className="font-medium">Jane Smith</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">@janesmith</div>
                    </div>
                  </div>
                  <button className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
                    Connect
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-300">
                      <Image 
                        src="/default-avatar.jpg" 
                        alt="Suggested User" 
                        fill 
                        sizes="40px"
                        className="object-cover" 
                      />
                    </div>
                    <div>
                      <div className="font-medium">Alex Johnson</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">@alexj</div>
                    </div>
                  </div>
                  <button className="rounded-full bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
