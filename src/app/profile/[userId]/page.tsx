'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Post from '@/components/Post'
import { PencilSquareIcon, UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import ErrorBoundary from '@/components/ErrorBoundary'
import { getSafeUserFromSession, isCurrentUser } from '@/lib/session-helpers'

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  bio?: string | null
}

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
}

export default function UserProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams() as { userId: string }
  const userId = params.userId

  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      // Check if this is the current user's profile using helper function
      setIsCurrentUserProfile(isCurrentUser(session, userId))
    }
  }, [status, session, userId])

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        // In a real app, this would be an API call to get user data
        // For now we'll use session data for the current user
        // and mock data for other users
        if (isCurrentUser(session, userId)) {
          const safeUser = getSafeUserFromSession(session)
          if (safeUser) {
            setUser({
              ...safeUser,
              bio: "Welcome to my profile!"
            })
          }
        } else {
          // Mock user data for other profiles
          // In a real app, this would be an API call
          const mockUser = {
            id: userId,
            name: `User ${userId.substring(0, 5)}`,
            email: null,
            image: '/default-avatar.jpg',
            bio: "This is a demo user profile."
          }
          setUser(mockUser)
        }

        // Fetch posts
        const response = await fetch('/api/posts')
        const data = await response.json()
        setPosts(data.filter((post: Post) => post.user.id === userId))
      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId, session])

  const handleFollow = () => {
    // In a real app, this would call an API to follow/unfollow the user
    setIsFollowing(!isFollowing)
    toast.success(isFollowing ? 'Unfollowed user' : 'Following user')
  }

  const handleSaveBio = () => {
    // In a real app, this would call an API to update the bio
    if (user) {
      setUser({ ...user, bio })
      setIsEditing(false)
      toast.success('Profile updated successfully')
    }
  }

  const handleLike = (postId: string, liked: boolean) => {
    // Update the like count in the UI
    setPosts(
      posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            _count: {
              ...post._count,
              likes: liked 
                ? post._count.likes + 1 
                : Math.max(0, post._count.likes - 1)
            },
            likes: liked 
              ? [...post.likes, { userId: session?.user?.id || '' }]
              : post.likes.filter(like => like.userId !== session?.user?.id)
          }
        }
        return post
      })
    )
  }

  return (
    <ErrorBoundary>
      {loading && (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        </div>
      )}

      {!loading && !user && (
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-lg bg-slate-800/80 p-8 text-center shadow-lg backdrop-blur-lg ring-1 ring-white/10">
            <h1 className="text-2xl font-bold text-white">User not found</h1>
            <p className="mt-2 text-gray-400">The user you're looking for doesn't exist or has been removed.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Go Home
            </button>
          </div>
        </div>
      )}

      {!loading && user && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Profile Info */}
            <div className="space-y-6">
              <div className="rounded-lg bg-slate-800/80 p-6 shadow-lg backdrop-blur-lg ring-1 ring-white/10">
                <div className="flex flex-col items-center space-y-4">
                  {user.image ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-blue-500">
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-slate-700" />
                  )}
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                    {user.email && isCurrentUserProfile && (
                      <p className="text-gray-400">{user.email}</p>
                    )}
                  </div>

                  {/* Profile Actions */}
                  <div className="flex w-full justify-center space-x-2">
                    {isCurrentUserProfile ? (
                      <button
                        onClick={() => {
                          setIsEditing(!isEditing)
                          setBio(user.bio || '')
                        }}
                        className="flex items-center rounded-lg bg-slate-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-600"
                      >
                        <PencilSquareIcon className="mr-1.5 h-4 w-4" />
                        Edit Profile
                      </button>
                    ) : (
                      <button
                        onClick={handleFollow}
                        className={`flex items-center rounded-lg px-3 py-1.5 text-sm font-medium ${
                          isFollowing 
                            ? 'bg-slate-700 text-white hover:bg-red-600' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinusIcon className="mr-1.5 h-4 w-4" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="mr-1.5 h-4 w-4" />
                            Follow
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-semibold text-white">Bio</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-md bg-slate-700 p-2 text-white"
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="rounded-lg bg-slate-600 px-3 py-1 text-sm text-white hover:bg-slate-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveBio}
                          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300">{user.bio || "No bio available."}</p>
                  )}
                </div>
              </div>

              <div className="rounded-lg bg-slate-800/80 p-6 shadow-lg backdrop-blur-lg ring-1 ring-white/10">
                <h2 className="mb-4 text-lg font-semibold text-white">Stats</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-500">
                      {posts.length}
                    </div>
                    <div className="text-sm text-gray-400">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">{isFollowing ? 1 : 0}</div>
                    <div className="text-sm text-gray-400">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">0</div>
                    <div className="text-sm text-gray-400">Following</div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Posts */}
            <div className="md:col-span-2">
              <h2 className="mb-4 text-xl font-bold text-white">Posts</h2>
              <div className="space-y-6">
                {posts.map((post) => (
                  <Post key={post.id} post={post} onLike={handleLike} />
                ))}
                {posts.length === 0 && (
                  <div className="rounded-lg bg-slate-800/80 p-6 text-center shadow-lg backdrop-blur-lg ring-1 ring-white/10">
                    <p className="text-gray-400">No posts yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  )
} 