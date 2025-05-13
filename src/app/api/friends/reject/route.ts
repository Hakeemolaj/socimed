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

    // Update the request status to rejected
    const updatedRequest = await db.friendRequest.update({
      where: { id: requestId },
      data: { status: 'rejected' }
    })

    return NextResponse.json({ 
      success: true,
      data: {
        requestId,
        status: 'rejected'
      }
    })
  } catch (error) {
    console.error('Error rejecting friend request:', error)
    return NextResponse.json({ error: 'Failed to reject friend request' }, { status: 500 })
  }
} 