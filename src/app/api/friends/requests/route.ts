import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { mockFriendRequests } from '@/lib/mock-data'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUserId = session.user.id

    try {
      // Try to fetch friend requests from database
      const requests = await prisma.$transaction(async (tx) => {
        return await tx.$queryRaw`
          SELECT fr.id, fr."senderId" as "userId", u.name, u.image, u.username, fr."createdAt"
          FROM "FriendRequest" fr
          JOIN "User" u ON fr."senderId" = u.id
          WHERE fr."receiverId" = ${currentUserId} AND fr.status = 'pending'
          ORDER BY fr."createdAt" DESC
        `;
      });

      // Format the response for client use
      // @ts-ignore - handling raw query results
      const formattedRequests = Array.isArray(requests) ? requests.map(request => ({
        id: request.id,
        userId: request.userId,
        name: request.name || 'Unknown',
        image: request.image || '/default-avatar.jpg',
        username: request.username,
        createdAt: request.createdAt
      })) : [];

      return NextResponse.json(formattedRequests);
    } catch (dbError) {
      console.error('Database error, using mock data:', dbError);
      // Use mock data if database query fails
      const filteredMockRequests = mockFriendRequests
        .filter(req => req.receiverId === currentUserId && req.status === 'pending')
        .map(req => ({
          id: req.id,
          userId: req.senderId,
          name: req.sender.name,
          image: req.sender.image,
          username: '',
          createdAt: req.createdAt
        }));
      
      return NextResponse.json(filteredMockRequests);
    }
  } catch (error) {
    console.error('Error fetching friend requests:', error)
    return NextResponse.json({ error: 'Failed to fetch friend requests' }, { status: 500 })
  }
} 