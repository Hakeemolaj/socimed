import { Session } from 'next-auth'

export interface SafeUser {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

/**
 * Gets user data from NextAuth session with safe type handling
 */
export const getSafeUserFromSession = (session: Session | null): SafeUser | null => {
  if (!session?.user?.id) return null

  return {
    id: session.user.id,
    name: session.user.name || null,
    email: session.user.email || null,
    image: session.user.image || null
  }
}

/**
 * Checks if a user is authenticated based on session data
 */
export const isAuthenticated = (session: Session | null): boolean => {
  return !!session?.user?.id
}

/**
 * Gets the current user ID from session or returns null
 */
export const getCurrentUserId = (session: Session | null): string | null => {
  return session?.user?.id || null
}

/**
 * Checks if the provided userId matches the current session user
 */
export const isCurrentUser = (session: Session | null, userId: string): boolean => {
  return session?.user?.id === userId
} 