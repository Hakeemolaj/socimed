import { useSession } from 'next-auth/react'
import { 
  getSafeUserFromSession, 
  isAuthenticated, 
  isCurrentUser, 
  getCurrentUserId,
  SafeUser
} from '@/lib/session-helpers'

export function useAuth() {
  const { data: session, status, update } = useSession()
  
  // Get the current user data with proper type safety
  const user = getSafeUserFromSession(session)
  
  // Helper to check if the user is authenticated
  const isAuth = isAuthenticated(session)
  
  // Helper to get the current user ID
  const userId = getCurrentUserId(session)
  
  // Helper to check if a profile belongs to the current user
  const isOwnProfile = (profileId: string) => isCurrentUser(session, profileId)
  
  // Status helper functions
  const isLoading = status === 'loading'
  const isUnauthenticated = status === 'unauthenticated'
  
  return {
    user,
    userId,
    isAuth,
    isOwnProfile,
    isLoading,
    isUnauthenticated,
    session,
    status,
    updateSession: update
  }
}

export type UseAuthReturn = ReturnType<typeof useAuth> 