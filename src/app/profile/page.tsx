'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'
import { getCurrentUserId } from '@/lib/session-helpers'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }
    
    if (status === 'authenticated') {
      const userId = getCurrentUserId(session)
      if (userId) {
        // Redirect to the user's profile page
        router.push(`/profile/${userId}`)
      }
    }
  }, [status, session, router])

  // Show loading state while checking authentication or redirecting
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    </ErrorBoundary>
  )
}