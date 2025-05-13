import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = new URL(request.url).searchParams
    const query = searchParams.get('q')
    const currentUserId = session.user.id

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Search for users using raw SQL query
    const likeQuery = `%${query}%`;
    const users = await prisma.$queryRaw`
      SELECT id, name, image, username, email
      FROM "User"
      WHERE id != ${currentUserId}
      AND (
        name ILIKE ${likeQuery}
        OR username ILIKE ${likeQuery}
        OR email ILIKE ${query + '%'}
      )
    `;

    // Get arrays of user IDs for later queries
    // @ts-ignore - handling raw query results
    const userIds = Array.isArray(users) ? users.map((u: any) => u.id) : [];
    
    let friendships: any[] = [];
    let friendRequests: any[] = [];

    // Only run these queries if we found users
    if (userIds.length > 0) {
      // Find friendships using raw SQL query
      const userIdsParam = Prisma.join(userIds.map(id => Prisma.sql`${id}`));
      friendships = await prisma.$queryRaw`
        SELECT "userId", "friendId"
        FROM "Friend"
        WHERE 
          ("userId" = ${currentUserId} AND "friendId" IN (${userIdsParam}))
          OR
          ("friendId" = ${currentUserId} AND "userId" IN (${userIdsParam}))
      `;

      // Find friend requests using raw SQL query 
      friendRequests = await prisma.$queryRaw`
        SELECT id, "senderId", "receiverId", status
        FROM "FriendRequest"
        WHERE 
          ("senderId" = ${currentUserId} AND "receiverId" IN (${userIdsParam}))
          OR
          ("receiverId" = ${currentUserId} AND "senderId" IN (${userIdsParam}))
      `;
    }

    // Add relationship status to each user
    // @ts-ignore - handling raw query results
    const resultsWithStatus = Array.isArray(users) ? users.map(user => {
      // Check if they're friends
      const isFriend = Array.isArray(friendships) && friendships.some(
        (f: any) => (f.userId === currentUserId && f.friendId === user.id) || 
             (f.userId === user.id && f.friendId === currentUserId)
      );
      
      // Check for friend requests
      const pendingRequest = Array.isArray(friendRequests) && friendRequests.find(
        (r: any) => (r.senderId === currentUserId && r.receiverId === user.id) || 
             (r.senderId === user.id && r.receiverId === currentUserId)
      );
      
      let status = 'none';
      
      if (isFriend) {
        status = 'friends';
      } else if (pendingRequest) {
        if (pendingRequest.status === 'pending') {
          status = pendingRequest.senderId === currentUserId ? 'sent' : 'received';
        } else {
          status = pendingRequest.status;
        }
      }
      
      return {
        ...user,
        status
      };
    }) : [];

    return NextResponse.json(resultsWithStatus)
  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json({ error: 'Failed to search users' }, { status: 500 })
  }
} 