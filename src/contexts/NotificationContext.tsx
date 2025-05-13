'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import Notification from '@/components/Notification'

interface NotificationContextType {
  showNotification: (params: {
    message: string
    title: string
    type?: 'success' | 'error' | 'info'
  }) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [show, setShow] = useState(false)
  const [notification, setNotification] = useState<{
    message: string
    title: string
    type: 'success' | 'error' | 'info'
  }>({
    message: '',
    title: '',
    type: 'info',
  })

  const showNotification = useCallback(
    ({ message, title, type = 'info' }: {
      message: string
      title: string
      type?: 'success' | 'error' | 'info'
    }) => {
      setNotification({ message, title, type })
      setShow(true)
      setTimeout(() => setShow(false), 5000) // Auto hide after 5 seconds
    },
    []
  )

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification
        show={show}
        message={notification.message}
        title={notification.title}
        type={notification.type}
        onClose={() => setShow(false)}
      />
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
} 