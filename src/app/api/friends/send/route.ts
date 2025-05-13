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
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    if (userId === currentUserId) {
      return NextResponse.json({ error: 'Cannot send friend request to yourself' }, { status: 400 })
    }

    // Check if user exists in the database
    const targetUser = await db.user.findUnique({
      where: { id: userId }
    })
    
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if a friend request already exists
    const existingRequest = await db.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId }
        ]
      }
    })

    if (existingRequest) {
      return NextResponse.json({ error: 'A friend request already exists' }, { status: 400 })
    }

    // Check if they are already friends
    const existingFriendship = await db.friend.findFirst({
      where: {
        OR: [
          { userId: currentUserId, friendId: userId },
          { userId: userId, friendId: currentUserId }
        ]
      }
    })

    if (existingFriendship) {
      return NextResponse.json({ error: 'Already friends' }, { status: 400 })
    }

    // Create the friend request in the database
    const friendRequest = await db.friendRequest.create({
      data: {
        senderId: currentUserId,
        receiverId: userId,
        status: 'pending'
      }
    })

    return NextResponse.json({ 
      success: true,
      data: {
        id: friendRequest.id,
        status: friendRequest.status,
        created: friendRequest.createdAt
      }
    })

  } catch (error) {
    console.error('Error sending friend request:', error)
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 })
  }
} 