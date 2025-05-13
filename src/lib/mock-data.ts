// Mock data for testing without a database
import { FriendWithRelations, FriendRequestWithSender } from '@/types/prisma'

// Mock users
export const mockUsers = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
    username: 'johndoe',
    bio: 'Software developer from New York'
  },
  {
    id: 'user-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
    username: 'janesmith',
    bio: 'UX Designer and coffee enthusiast'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300',
    username: 'mikej',
    bio: 'Travel photographer and blogger'
  },
  {
    id: 'user-4',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300',
    username: 'sarahw',
    bio: 'Fitness trainer and nutrition expert'
  },
  {
    id: 'user-5',
    name: 'David Brown',
    email: 'david@example.com',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300',
    username: 'davidb',
    bio: 'Music producer and guitarist'
  }
]

// Mock friends
export const mockFriends: FriendWithRelations[] = [
  {
    id: 'friend-1',
    userId: 'user-1',
    friendId: 'user-2',
    createdAt: new Date('2023-01-01'),
    user: {
      id: 'user-1',
      name: 'John Doe',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    friend: {
      id: 'user-2',
      name: 'Jane Smith',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'friend-2',
    userId: 'user-1',
    friendId: 'user-3',
    createdAt: new Date('2023-01-15'),
    user: {
      id: 'user-1',
      name: 'John Doe',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    friend: {
      id: 'user-3',
      name: 'Mike Johnson',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  }
]

// Mock friend requests
export const mockFriendRequests: FriendRequestWithSender[] = [
  {
    id: 'request-1',
    senderId: 'user-4',
    receiverId: 'user-1',
    status: 'pending',
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01'),
    sender: {
      id: 'user-4',
      name: 'Sarah Williams',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  },
  {
    id: 'request-2',
    senderId: 'user-5',
    receiverId: 'user-1',
    status: 'pending',
    createdAt: new Date('2023-02-05'),
    updatedAt: new Date('2023-02-05'),
    sender: {
      id: 'user-5',
      name: 'David Brown',
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  }
]

// Mock search results with relationship status
export const getMockSearchResults = (query: string, currentUserId: string) => {
  // Filter users by name containing the query
  const filteredUsers = mockUsers.filter(
    user => 
      user.id !== currentUserId && 
      (user.name.toLowerCase().includes(query.toLowerCase()) || 
       user.username?.toLowerCase().includes(query.toLowerCase()) ||
       user.email.toLowerCase().startsWith(query.toLowerCase()))
  )
  
  return filteredUsers.map(user => {
    // Check if they're friends
    const isFriend = mockFriends.some(
      f => 
        (f.userId === currentUserId && f.friendId === user.id) || 
        (f.userId === user.id && f.friendId === currentUserId)
    )
    
    // Check for friend requests
    const pendingRequest = mockFriendRequests.find(
      r => 
        (r.senderId === currentUserId && r.receiverId === user.id) || 
        (r.senderId === user.id && r.receiverId === currentUserId)
    )
    
    let status = 'none'
    
    if (isFriend) {
      status = 'friends'
    } else if (pendingRequest) {
      if (pendingRequest.status === 'pending') {
        status = pendingRequest.senderId === currentUserId ? 'sent' : 'received'
      } else {
        status = pendingRequest.status
      }
    }
    
    return {
      ...user,
      status
    }
  })
} 