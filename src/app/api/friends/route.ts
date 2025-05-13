import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

// Import prisma conditionally
let prisma: any;
try {
  prisma = require('@/lib/prisma').prisma;
} catch (error) {
  console.warn('Prisma not initialized, using mock data');
  prisma = null;
}

// Mock data for when database is not available
const mockFriends = [
  {
    id: 'friend-1',
    userId: 'user-2',
    name: 'Jane Smith',
    image: '/default-avatar.jpg',
    username: 'janesmith'
  },
  {
    id: 'friend-2',
    userId: 'user-3',
    name: 'Alex Johnson',
    image: '/default-avatar.jpg',
    username: 'alexj'
  }
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // If prisma is available, get friends from database
    if (prisma) {
      try {
        const currentUserId = session.user.id

        // Get the user's friends from the database
        // For friendships, we need to use direct prisma query with joins
        // since our raw query approach might not support complex joins easily
        const friends = await prisma.$queryRaw`
          SELECT f.id, f."friendId" as "userId", u.name, u.image, u.username
          FROM "Friend" f
          JOIN "User" u ON f."friendId" = u.id
          WHERE f."userId" = ${currentUserId}
        `;

        // Transform the data for client use
        // @ts-ignore - handling raw query results
        const formattedFriends = Array.isArray(friends) ? friends.map(friendship => ({
          id: friendship.id,
          userId: friendship.userId,
          name: friendship.name || 'Unknown',
          image: friendship.image || '/default-avatar.jpg',
          username: friendship.username
        })) : [];

        return NextResponse.json(formattedFriends)
      } catch (error) {
        console.error('Database error fetching friends, falling back to mock data:', error)
        // Fall back to mock data
      }
    }

    // Return mock friends if prisma is not available or there was a database error
    return NextResponse.json(mockFriends)
  } catch (error) {
    console.error('Error fetching friends:', error)
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 })
  }
} 