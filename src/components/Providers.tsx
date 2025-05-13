'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ThemeProvider } from '@/context/ThemeContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <NotificationProvider>
          <Toaster position="bottom-right" />
          {children}
        </NotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  )
} 