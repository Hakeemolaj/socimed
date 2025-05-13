import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'
import { Metadata, Viewport } from 'next'

// Initialize MSW in development
export const initMocks = async () => {
  if (typeof window === 'undefined') return

  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('../mocks/browser')
    await worker.start()
  }
}

// Add a separate viewport export
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'Socimed - Social Media Platform',
    template: '%s | Socimed'
  },
  description: 'A modern social media platform built with Next.js, Prisma, and TypeScript',
  keywords: ['social media', 'nextjs', 'react', 'typescript'],
  authors: [
    { name: 'Socimed Team' }
  ],
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Socimed - Social Media Platform',
    description: 'Connect with friends, share moments, and discover what\'s happening around you',
    siteName: 'Socimed',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Socimed - Social Media Platform',
    description: 'Connect with friends, share moments, and discover what\'s happening around you',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Initialize MSW in development mode
  if (process.env.NODE_ENV === 'development') {
    initMocks()
  }
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-gray-200 antialiased">
        <Providers>
          <Navbar />
          <main className="flex min-h-[calc(100vh-4rem)] flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
