import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'
import { createErrorResponse, createSuccessResponse, withErrorHandling } from '@/lib/api-utils'
import { z } from 'zod'

// Import prisma conditionally to handle both database and no-database scenarios
let prisma: any;
try {
  prisma = require('@/lib/prisma').prisma;
} catch (error) {
  console.warn('Prisma not initialized, using mock data');
  prisma = null;
}

// Mock data for when database is not available
const mockPosts = [
  {
    id: '1',
    content: 'Just set up my new Next.js project with Tailwind CSS! 🚀 #webdev #nextjs',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    user: {
      id: 'user-1',
      name: 'Demo User',
      image: '/default-avatar.jpg'
    },
    _count: {
      likes: 12,
      comments: 3
    },
    likes: [],
    comments: [
      {
        id: 'comment-1',
        content: 'That\'s awesome! I love Next.js too.',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        user: {
          id: 'user-2',
          name: 'Jane Smith',
          image: '/default-avatar.jpg'
        }
      }
    ]
  },
  {
    id: '2',
    content: 'Learning about authentication in Next.js today. OAuth integration is so powerful! #coding #auth',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    user: {
      id: 'user-3',
      name: 'Alex Johnson',
      image: '/default-avatar.jpg'
    },
    _count: {
      likes: 8,
      comments: 2
    },
    likes: [],
    comments: []
  },
  {
    id: '3',
    content: 'Just deployed my first app to Vercel. The process was seamless! 👏 #vercel #deployment',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(), // 10 hours ago
    user: {
      id: 'user-1',
      name: 'Demo User',
      image: '/default-avatar.jpg'
    },
    _count: {
      likes: 15,
      comments: 5
    },
    likes: [],
    comments: []
  }
];

// Schema for validating post creation
const PostCreateSchema = z.object({
  content: z.string().min(1, "Content is required").max(2000, "Content is too long (max 2000 characters)")
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return createErrorResponse('Unauthorized', 401);
  }

  try {
    const json = await request.json();
    
    // Validate request body
    const validation = PostCreateSchema.safeParse(json);
    if (!validation.success) {
      return createErrorResponse(
        'Invalid request data', 
        400, 
        validation.error.format()
      );
    }

    const { content } = validation.data;

    // If prisma is available, create in database
    if (prisma) {
      const post = await prisma.post.create({
        data: {
          content,
          userId: session.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
          likes: {
            where: {
              userId: session.user.id,
            },
            select: {
              userId: true,
            },
          },
        },
      });
      return createSuccessResponse(post, 201);
    }
    
    // If prisma is not available, create mock post
    const newPost = {
      id: `post-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      user: {
        id: session.user.id,
        name: session.user.name || 'User',
        image: session.user.image || '/default-avatar.jpg'
      },
      _count: {
        likes: 0,
        comments: 0
      },
      likes: [],
      comments: []
    };
    
    // Add to mock posts for this session
    mockPosts.unshift(newPost);
    
    return createSuccessResponse(newPost, 201);
  } catch (error) {
    console.error('Error creating post:', error);
    return createErrorResponse('Failed to create post', 500, error);
  }
}

export async function GET() {
  return withErrorHandling(async () => {
    // Try to get posts from database, fall back to mock data on error
    try {
      if (prisma) {
        const posts = await prisma.post.findMany({
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
            likes: {
              select: {
                userId: true,
              },
            },
          },
        });
        return posts;
      }
    } catch (error) {
      console.error('Database error, falling back to mock data:', error);
      // Continue to return mock data on error
    }
    
    // Return mock posts if prisma is not available or there was a database error
    return mockPosts;
  }, 'Failed to fetch posts');
} 