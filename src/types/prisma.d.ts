import { User } from '@prisma/client'

// Friend model augmentations
export interface FriendWithRelations {
  id: string
  userId: string
  friendId: string
  createdAt: Date
  user: User
  friend: User
}

// FriendRequest model augmentations
export interface FriendRequestWithSender {
  id: string
  senderId: string
  receiverId: string
  status: string
  createdAt: Date
  updatedAt: Date
  sender: User
}

// Formatted response types for API endpoints
export interface FormattedFriend {
  id: string
  userId: string
  name: string | null
  image: string | null
  username?: string | null
}

export interface FormattedFriendRequest {
  id: string
  userId: string
  name: string | null
  image: string | null
  username?: string | null
  createdAt?: Date
}

// Types for API responses with relationship status
export interface UserWithStatus extends User {
  status: 'none' | 'friends' | 'pending' | 'sent' | 'received' | 'accepted' | 'rejected'
} 