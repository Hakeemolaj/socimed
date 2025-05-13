'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from './ui/Button'
import TextArea from './ui/TextArea'
import { z } from 'zod'

interface CreatePostProps {
  onPostCreated: (post: any) => void
}

// Validation schema for post content
const postSchema = z.object({
  content: z
    .string()
    .min(1, "Post content cannot be empty")
    .max(2000, "Post content is too long (max 2000 characters)")
})

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateContent = () => {
    try {
      postSchema.parse({ content })
      setError('')
      return true
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
        return false
      }
      setError('Invalid content')
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading || !session?.user) return
    
    if (!validateContent()) {
      toast.error(error)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const newPost = await response.json()
      onPostCreated(newPost)
      setContent('')
      toast.success('Post created successfully!')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create post')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="rounded-lg bg-slate-800/80 p-6 shadow-lg backdrop-blur-lg ring-1 ring-white/10">
        <p className="text-center text-gray-400">Sign in to create posts</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-slate-800/80 p-6 shadow-lg backdrop-blur-lg ring-1 ring-white/10">
      <div className="flex space-x-4">
        <div className="h-10 w-10 flex-shrink-0">
          {session.user.image ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-slate-700" />
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex-1">
          <TextArea
            id="post-content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            error={error}
            rows={3}
            maxLength={2000}
          />
          <div className="mt-2 flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 