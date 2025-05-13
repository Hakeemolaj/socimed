'use client'

import { useState, lazy, Suspense, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { Comment } from './CommentSection'
import ErrorBoundary from './ErrorBoundary'
import { getSafeUserFromSession, isAuthenticated } from '@/lib/session-helpers'

// Lazy load the comments component for better performance
const CommentSection = lazy(() => import('./CommentSection'))

interface PostProps {
  post: {
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      name: string | null
      image: string | null
    }
    _count: {
      likes: number
      comments: number
    }
    likes: Array<{ userId: string }>
  }
  onLike: (postId: string, liked: boolean) => void
}

export default function Post({ post, onLike }: PostProps) {
  const { data: session } = useSession()
  const safeUser = getSafeUserFromSession(session)
  
  const [isLiked, setIsLiked] = useState(
    safeUser?.id ? post.likes.some((like) => like.userId === safeUser.id) : false
  )
  const [isLiking, setIsLiking] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [loadedComments, setLoadedComments] = useState(false)

  // Pre-fetch comments when post is visible to reduce perceived loading time
  useEffect(() => {
    if (post._count.comments > 0 && !loadedComments) {
      fetchComments()
    }
  }, [post.id, post._count.comments, loadedComments])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/comments`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
        setLoadedComments(true)
      }
    } catch (error) {
      console.error('Error pre-fetching comments:', error)
    }
  }

  const handleLike = async () => {
    if (isLiking || !isAuthenticated(session)) return

    setIsLiking(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to process like')
      }

      setIsLiked(!isLiked)
      onLike(post.id, !isLiked)
    } catch (error) {
      console.error('Error processing like:', error)
      toast.error(isLiked ? 'Failed to unlike post' : 'Failed to like post')
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <ErrorBoundary>
      <div className="rounded-lg bg-slate-800/80 p-6 shadow-lg backdrop-blur-lg ring-1 ring-white/10">
        <div className="flex space-x-4">
          <div className="h-10 w-10 flex-shrink-0">
            {post.user.image ? (
              <Link href={`/profile/${post.user.id}`}>
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image
                    src={post.user.image}
                    alt={post.user.name || 'User'}
                    fill
                    className="object-cover"
                    priority={false}
                    loading="lazy"
                  />
                </div>
              </Link>
            ) : (
              <div className="h-10 w-10 rounded-full bg-slate-700" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Link href={`/profile/${post.user.id}`} className="hover:underline">
                  <h3 className="font-semibold text-white">{post.user.name}</h3>
                </Link>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-gray-300">{post.content}</p>
            <div className="mt-4 flex items-center space-x-4">
              <button
                onClick={handleLike}
                disabled={isLiking || !isAuthenticated(session)}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                } transition-colors ${!isAuthenticated(session) ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {isLiked ? (
                  <HeartIconSolid className="h-5 w-5" />
                ) : (
                  <HeartIcon className="h-5 w-5" />
                )}
                <span>{post._count.likes}</span>
              </button>
              <button 
                onClick={() => setShowComments(!showComments)}
                className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-colors"
              >
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>{post._count.comments}</span>
              </button>
            </div>
            
            {showComments && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Suspense fallback={<div className="text-sm text-gray-400">Loading comments...</div>}>
                  <CommentSection postId={post.id} initialComments={loadedComments ? comments : []} />
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
} 