import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 px-4">
      <div className="text-center max-w-md w-full bg-slate-800/80 backdrop-blur-lg rounded-lg p-8 shadow-lg ring-1 ring-white/10">
        <h1 className="text-5xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          The page you were looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/"
          className="inline-block rounded-md bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
} 