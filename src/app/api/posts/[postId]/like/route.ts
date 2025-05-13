import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse } from '@/lib/api-utils'
import { NextRequest } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401)
  }

  const { postId } = await params
  if (!postId) {
    return createErrorResponse('Post ID is required', 400)
  }

  // Handle case when prisma is not available
  if (!prisma) {
    console.warn('Prisma not initialized, using mock response for like')
    // Return mock like response
    return createSuccessResponse({ 
      id: `like-${Date.now()}`,
      userId: session.user.id,
      postId 
    }, 201)
  }

  try {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return createErrorResponse('Post not found', 404)
    }

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    })

    if (existingLike) {
      return createErrorResponse('Post already liked', 409)
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        userId: session.user.id,
        postId,
      },
    })

    return createSuccessResponse(like, 201)
  } catch (error) {
    console.error('Error liking post:', error)
    return createErrorResponse('Failed to like post', 500, error)
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401)
  }

  const { postId } = await params
  if (!postId) {
    return createErrorResponse('Post ID is required', 400)
  }

  // Handle case when prisma is not available
  if (!prisma) {
    console.warn('Prisma not initialized, using mock response for unlike')
    // Return mock unlike response
    return createSuccessResponse({ success: true })
  }

  try {
    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      return createErrorResponse('Post not found', 404)
    }

    // Check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    })

    if (!existingLike) {
      return createErrorResponse('Post not liked', 404)
    }

    // Delete like
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId,
        },
      },
    })

    return createSuccessResponse({ success: true })
  } catch (error) {
    console.error('Error unliking post:', error)
    return createErrorResponse('Failed to unlike post', 500, error)
  }
} 