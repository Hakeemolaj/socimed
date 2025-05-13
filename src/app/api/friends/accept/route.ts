import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentUserId = session.user.id
    const { requestId } = await request.json()

    if (!requestId) {
      return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
    }

    // Find the friend request
    const friendRequest = await db.friendRequest.findFirst({
      where: {
        id: requestId,
        receiverId: currentUserId,
        status: 'pending'
      }
    })

    if (!friendRequest) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 })
    }

    // Get the sender ID from the friend request
    // @ts-ignore - handle the unknown type from raw query
    const senderId = friendRequest.senderId || friendRequest[0]?.senderId

    if (!senderId) {
      return NextResponse.json({ error: 'Invalid friend request data' }, { status: 500 })
    }

    // Use separate queries instead of a transaction for better type safety
    // Update the request status
    await db.friendRequest.update({
      where: { id: requestId },
      data: { status: 'accepted' }
    })
    
    // Create friendship
    const friendship = await db.friend.create({
      data: {
        userId: currentUserId,
        friendId: senderId
      }
    })

    return NextResponse.json({ 
      success: true,
      data: {
        requestId,
        // @ts-ignore - handle the unknown type from raw query
        friendshipId: friendship.id || friendship[0]?.id
      }
    })
  } catch (error) {
    console.error('Error accepting friend request:', error)
    return NextResponse.json({ error: 'Failed to accept friend request' }, { status: 500 })
  }
} 