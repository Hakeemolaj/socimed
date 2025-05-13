'use client'

import Link from 'next/link'
import { useState, Fragment } from 'react'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'
import { Popover, Menu, Transition } from '@headlessui/react'
import {
  HomeIcon,
  UserIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  SunIcon,
  MoonIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import FriendsMenu from './FriendsMenu'
import UserSearch from './UserSearch'
import { getSafeUserFromSession, isAuthenticated } from '@/lib/session-helpers'
import ErrorBoundary from './ErrorBoundary'

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Notifications', href: '/notifications', icon: BellIcon },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic here
    console.log('Search query:', searchQuery)
  }

  return (
    <ErrorBoundary>
      <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-lg shadow-md">
        <nav className="container mx-auto flex items-center justify-between p-4">
          {/* Logo */}
          <Link href="/" className="flex items-center text-2xl font-bold text-white">
            <span className="text-blue-500">S</span>ocimed
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-64 rounded-full bg-slate-800 px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`rounded-full p-2 text-gray-300 hover:bg-slate-800 hover:text-white ${
                    isActive ? 'bg-slate-700' : ''
                  }`}
                >
                  <item.icon className="h-6 w-6" />
                </Link>
              )
            })}
            
            {/* Friends Menu */}
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`rounded-full p-2 text-gray-300 hover:bg-slate-800 hover:text-white ${
                      open ? 'bg-slate-700' : ''
                    }`}
                  >
                    <UserGroupIcon className="h-6 w-6" />
                  </Popover.Button>
                  
                  <Popover.Panel className="absolute right-0 z-10 mt-2 transform">
                    <FriendsMenu />
                  </Popover.Panel>
                </>
              )}
            </Popover>
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-gray-300 hover:bg-slate-800 hover:text-white"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            {/* Profile Menu */}
            {isAuthenticated(session) ? (
              <Menu as="div" className="relative">
                <Menu.Button className="relative flex rounded-full items-center justify-center">
                  {getSafeUserFromSession(session)?.image ? (
                    <Image
                      src={getSafeUserFromSession(session)?.image || ''}
                      alt={getSafeUserFromSession(session)?.name || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-blue-500"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-white">
                      <UserIcon className="h-6 w-6" />
                    </div>
                  )}
                </Menu.Button>
                
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link 
                          href={`/profile/${getSafeUserFromSession(session)?.id}`}
                          className={`${
                            active ? 'bg-slate-700' : ''
                          } block w-full px-4 py-2 text-left text-sm text-white`}
                        >
                          <div className="flex items-center">
                            <UserIcon className="mr-2 h-5 w-5" />
                            My Profile
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                    
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => signOut()}
                          className={`${
                            active ? 'bg-slate-700' : ''
                          } block w-full px-4 py-2 text-left text-sm text-white`}
                        >
                          <div className="flex items-center">
                            <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                            Sign Out
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <Link
                href="/auth/signin"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
        
        {/* Mobile Search - Only visible on small screens */}
        {isAuthenticated(session) && (
          <div className="sm:hidden px-4 pb-2">
            <UserSearch />
          </div>
        )}
      </header>
    </ErrorBoundary>
  )
} 