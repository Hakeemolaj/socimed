'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error caught:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="text-center max-w-md w-full bg-slate-800/80 backdrop-blur-lg rounded-lg p-8 shadow-lg ring-1 ring-red-500/20">
        <h2 className="text-2xl font-semibold text-white mb-4">Something went wrong</h2>
        <p className="text-gray-400 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={reset}
            className="w-full sm:w-auto rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
          <Link 
            href="/"
            className="w-full sm:w-auto rounded-md bg-slate-700 px-5 py-2.5 font-medium text-white hover:bg-slate-600 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
} 