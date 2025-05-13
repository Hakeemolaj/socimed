'use client'

import { useState, useEffect } from 'react'
import CreatePost from './CreatePost'
import Post from './Post'
import { toast } from 'react-hot-toast'
import { useSession } from 'next-auth/react'

interface Post {
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
  comments: Array<{
    id: string
    content: string
    createdAt: string
    user: {
      id: string
      name: string | null
      image: string | null
    }
  }>
}

export default function Feed() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts')
        if (!response.ok) {
          throw new Error('Failed to fetch posts')
        }
        const data = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Error fetching posts:', error)
        toast.error('Failed to load posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev])
    toast.success('Post created!')
  }

  const handlePostLiked = (postId: string, liked: boolean) => {
    if (!session?.user?.id) return

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              _count: {
                ...post._count,
                likes: post._count.likes + (liked ? 1 : -1),
              },
              likes: liked
                ? [...post.likes, { userId: session.user.id }]
                : post.likes.filter((like) => like.userId !== session.user.id),
            }
          : post
      )
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse space-y-3 rounded-lg bg-slate-800/80 p-6 shadow-lg backdrop-blur-lg ring-1 ring-white/10"
          >
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-slate-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 rounded bg-slate-700" />
                <div className="h-3 w-1/3 rounded bg-slate-700" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-700" />
              <div className="h-4 w-5/6 rounded bg-slate-700" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="space-y-4">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLike={handlePostLiked}
          />
        ))}
        {posts.length === 0 && (
          <div className="rounded-lg bg-slate-800/80 p-6 text-center shadow-lg backdrop-blur-lg ring-1 ring-white/10">
            <p className="text-gray-400">No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  )
} 