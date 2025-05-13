'use client'

import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import { useEffect, useState } from 'react'
import { mockUsers } from '@/lib/mock-data'

// Mock session data for testing
const mockSession: Session = {
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 1 day from now
  user: {
    id: 'user-1',
    name: mockUsers[0].name,
    email: mockUsers[0].email,
    image: mockUsers[0].image,
  }
}

export default function MockSessionProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    // Add a small delay for realism
    const timer = setTimeout(() => {
      setIsActive(true)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <SessionProvider session={isActive ? mockSession : null}>
      {children}
    </SessionProvider>
  )
} 