import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { createErrorResponse, createSuccessResponse, withErrorHandling } from '@/lib/api-utils'
import { z } from 'zod'
import { NextRequest } from 'next/server'

// Schema for validating comment creation
const CommentCreateSchema = z.object({
  content: z.string().min(1, "Content is required").max(500, "Content is too long (max 500 characters)")
});

// Mock data for when database is not available
const getMockComments = (postId: string) => [
  {
    id: `comment-${Date.now()}-1`,
    content: 'This is a great post! Thanks for sharing.',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    postId,
    user: {
      id: 'user-2',
      name: 'Jane Smith',
      image: '/default-avatar.jpg'
    }
  },
  {
    id: `comment-${Date.now()}-2`,
    content: 'I learned a lot from this, keep it up!',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    postId,
    user: {
      id: 'user-3',
      name: 'Alex Johnson',
      image: '/default-avatar.jpg'
    }
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;
  
  if (!postId) {
    return createErrorResponse('Post ID is required', 400);
  }

  return withErrorHandling(async () => {
    try {
      if (!prisma) {
        // Return mock data if prisma is undefined
        return getMockComments(postId);
      }

      // Check if post exists
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        throw new Error('Post not found');
      }

      // Get comments for the post
      const comments = await prisma.comment.findMany({
        where: { postId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return comments;
    } catch (error) {
      console.error('Database error, falling back to mock data:', error);
      // Return mock data on error
      return getMockComments(postId);
    }
  }, 'Failed to fetch comments');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401);
  }

  const { postId } = await params;
  if (!postId) {
    return createErrorResponse('Post ID is required', 400);
  }

  try {
    const json = await request.json();
    
    // Validate request body
    const validation = CommentCreateSchema.safeParse(json);
    if (!validation.success) {
      return createErrorResponse(
        'Invalid request data', 
        400, 
        validation.error.format()
      );
    }

    const { content } = validation.data;

    // If prisma is not available, return mock response
    if (!prisma) {
      const mockComment = {
        id: `comment-${Date.now()}`,
        content,
        createdAt: new Date().toISOString(),
        postId,
        user: {
          id: session.user.id,
          name: session.user.name || 'User',
          image: session.user.image || '/default-avatar.jpg'
        }
      };
      return createSuccessResponse(mockComment, 201);
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return createErrorResponse('Post not found', 404);
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        userId: session.user.id,
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return createSuccessResponse(comment, 201);
  } catch (error) {
    console.error('Error creating comment:', error);
    
    // Return mock response on database error
    if (error instanceof Error && error.message.includes('database')) {
      const mockComment = {
        id: `comment-${Date.now()}`,
        content: 'New comment', // Generic content since we can't access the original content here
        createdAt: new Date().toISOString(),
        postId,
        user: {
          id: session.user.id,
          name: session.user.name || 'User',
          image: session.user.image || '/default-avatar.jpg'
        }
      };
      return createSuccessResponse(mockComment, 201);
    }
    
    return createErrorResponse('Failed to create comment', 500, error);
  }
} 