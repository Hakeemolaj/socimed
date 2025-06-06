import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import type { PrismaClient } from '@prisma/client'

// Import prisma conditionally
let prisma: PrismaClient | null;
try {
  // Dynamically require prisma only if it's expected to be available
  // Adjust the path as necessary if your prisma instance is exported differently
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  prisma = require('@/lib/prisma').prisma;
} catch (loadError) { // Changed 'error' to 'loadError' to avoid conflict with other 'error' variables
  console.warn('Prisma not initialized, using mock data:', loadError);
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

        // Define a type for the raw query result
        type FriendQueryResult = {
          id: string;
          userId: string;
          name: string | null;
          image: string | null;
          username: string | null;
        };

        const rawFriends = friends as FriendQueryResult[];

        // Transform the data for client use
        const formattedFriends = Array.isArray(rawFriends) ? rawFriends.map(friendship => ({
          id: friendship.id,
          userId: friendship.userId,
          name: friendship.name || 'Unknown',
          image: friendship.image || '/default-avatar.jpg',
          username: friendship.username
        })) : [];

        return NextResponse.json(formattedFriends)
      } catch (dbError) { // Changed 'error' to 'dbError'
        console.error('Database error fetching friends, falling back to mock data:', dbError)
        // Fall back to mock data
      }
    }

    // Return mock friends if prisma is not available or there was a database error
    return NextResponse.json(mockFriends)
  } catch (routeError) { // Changed 'error' to 'routeError'
    console.error('Error fetching friends:', routeError)
    return NextResponse.json({ error: 'Failed to fetch friends' }, { status: 500 })
  }
} 