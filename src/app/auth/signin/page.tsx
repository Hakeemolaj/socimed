'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'

export default function SignIn() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'
  const error = searchParams?.get('error')
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({
    credentials: false,
    google: false,
    github: false
  })

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(prev => ({ ...prev, [provider]: true }))
      
      // Call NextAuth signIn method with the selected provider
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      setIsLoading(prev => ({ ...prev, [provider]: false }))
    }
  }

  const handleCredentialsSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(prev => ({ ...prev, credentials: true }))
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    
    try {
      const result = await signIn('credentials', { 
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }
      
      if (result?.ok) {
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsLoading(prev => ({ ...prev, credentials: false }))
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-center text-blue-600">Socimed</h1>
          <h2 className="mt-6 text-2xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-gray-400">Connect with friends and share moments</p>

        {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500">
              {error === 'CredentialsSignin' && 'Invalid credentials.'}
              {error === 'OAuthSignin' && 'Error signing in with OAuth provider.'}
              {error === 'OAuthCallback' && 'Error during OAuth callback.'}
              {error === 'OAuthCreateAccount' && 'Error creating OAuth account.'}
              {error === 'EmailCreateAccount' && 'Error creating email account.'}
              {error === 'Callback' && 'Error during callback.'}
              {error === 'OAuthAccountNotLinked' && 'Email already in use with different provider.'}
              {error === 'EmailSignin' && 'Error sending email.'}
              {error === 'SessionRequired' && 'Please sign in to access this page.'}
              {error === 'invalid_client' && (
                <span>
                  Authentication configuration error. The OAuth client was not found.
                  <br />
                  Please check your application&apos;s OAuth settings.
                </span>
              )}
              {!['CredentialsSignin', 'OAuthSignin', 'OAuthCallback', 'OAuthCreateAccount', 
                  'EmailCreateAccount', 'Callback', 'OAuthAccountNotLinked', 'EmailSignin', 
                  'SessionRequired', 'invalid_client'].includes(error) && 'An error occurred.'}
            </div>
          )}
          </div>

        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              variant="outline"
              className="w-full py-6 flex items-center justify-center space-x-2"
              isLoading={isLoading.google}
              disabled={isLoading.google}
            >
              {!isLoading.google && (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 488 512" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C315.9 98.6 282.2 78 248 78c-97.2 0-176 79.8-176 178 0 98.2 78.8 178 176 178 84.8 0 155.2-57.3 173.5-133H248v-85.2h236.1c2.3 12.7 3.9 24.9 3.9 41.2z"/>
                  </svg>
                )}
              <span>Sign in with Google</span>
            </Button>
            
            <Button
              type="button"
              onClick={() => handleOAuthSignIn('github')}
              variant="outline"
              className="w-full py-6 flex items-center justify-center space-x-2"
              isLoading={isLoading.github}
              disabled={isLoading.github}
            >
              {!isLoading.github && (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                  </svg>
                )}
              <span>Sign in with GitHub</span>
            </Button>
          </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-950 text-gray-400">Or continue with</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleCredentialsSignIn}>
              <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
                </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg bg-slate-700/50 px-3 py-2 text-gray-100 
                  placeholder-gray-400 ring-1 ring-white/10 transition-all 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              </div>
              
              <div>
              <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg bg-slate-700/50 px-3 py-2 text-gray-100 
                  placeholder-gray-400 ring-1 ring-white/10 transition-all 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
              </div>
              </div>
              
            <div>
              <Button
                type="submit"
                className="w-full py-6"
                isLoading={isLoading.credentials}
                disabled={isLoading.credentials}
              >
                Sign in
              </Button>
                </div>
            </form>
        </div>
      </div>
    </div>
  )
} 