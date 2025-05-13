'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Button } from './ui/Button'
import TextArea from './ui/TextArea'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

export interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    image: string | null
  }
}

export interface CommentSectionProps {
  postId: string
  initialComments?: Comment[]
}

// Validation schema for comment content
const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long (max 500 characters)")
})

export default function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLoadingComments, setIsLoadingComments] = useState(!initialComments.length)

  useEffect(() => {
    if (!initialComments.length) {
      fetchComments()
    }
  }, [postId, initialComments.length])

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true)
      const response = await fetch(`/api/posts/${postId}/comments`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments')
      }
      
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Failed to load comments')
    } finally {
      setIsLoadingComments(false)
    }
  }

  const validateComment = () => {
    try {
      commentSchema.parse({ content: newComment })
      setError('')
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
        return false
      }
      setError('Invalid comment')
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || !session?.user) return
    
    if (!validateComment()) {
      toast.error(error)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add comment')
      }

      const comment = await response.json()
      setComments(prev => [comment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Error adding comment:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add comment')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {session?.user ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <TextArea
            id="comment-content"
            name="content"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            error={error}
            rows={2}
            maxLength={500}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              size="sm"
              isLoading={isLoading}
              disabled={isLoading || !newComment.trim()}
            >
              Comment
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-center text-sm text-gray-400">Sign in to add comments</p>
      )}

      {isLoadingComments ? (
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-2">
                <div className="h-8 w-8 rounded-full bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-slate-700" />
                  <div className="h-4 w-full rounded bg-slate-700" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map(comment => (
            <div key={comment.id} className="rounded-md bg-slate-800/50 p-3">
              <div className="flex items-start space-x-2">
                <div className="mt-1">
                  {comment.user.image ? (
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      <Image 
                        src={comment.user.image} 
                        alt={comment.user.name || 'User'} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-700" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{comment.user.name}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-gray-400">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
} 