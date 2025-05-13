import { http, HttpResponse } from 'msw'
import { mockUsers, mockFriends, mockFriendRequests } from '@/lib/mock-data'

// Add types for the request handlers
type HttpRequest = {
  request: Request;
  params: Record<string, string>;
}

export const handlers = [
  // Mock user search API
  http.get('/api/users/search', async ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    
    if (!query || query.length < 2) {
      return HttpResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }
    
    const filteredUsers = mockUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(query.toLowerCase()))
    )
    
    return HttpResponse.json(
      filteredUsers.map(user => ({
        ...user,
        status: 'none'
      }))
    )
  }),
  
  // Mock friends API
  http.get('/api/friends', async () => {
    return HttpResponse.json(
      mockFriends.map(friend => ({
        id: friend.id,
        userId: friend.friendId,
        name: friend.friend.name || 'Unknown',
        image: friend.friend.image || '/default-avatar.jpg'
      }))
    )
  }),
  
  // Mock friend requests API
  http.get('/api/friends/requests', async () => {
    return HttpResponse.json(
      mockFriendRequests.map(request => ({
        id: request.id,
        userId: request.senderId,
        name: request.sender.name || 'Unknown',
        image: request.sender.image || '/default-avatar.jpg'
      }))
    )
  }),
  
  // Mock send friend request API
  http.post('/api/friends/send', async () => {
    return HttpResponse.json({ success: true })
  }),
  
  // Mock accept friend request API
  http.post('/api/friends/accept', async () => {
    return HttpResponse.json({ success: true })
  }),
  
  // Mock reject friend request API
  http.post('/api/friends/reject', async () => {
    return HttpResponse.json({ success: true })
  })
] 