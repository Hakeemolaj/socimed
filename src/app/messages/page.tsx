'use client'

import { useState, useEffect } from 'react'
import ChatList from '@/components/ChatList'
import ChatWindow from '@/components/ChatWindow'
import { useNotification } from '@/contexts/NotificationContext'

// Mock data for chats
const mockChats = [
  {
    id: '1',
    name: 'Sarah Wilson',
    lastMessage: 'Thanks for the help!',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    unread: 2,
    online: true,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    lastMessage: 'When is the next meeting?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unread: 0,
    online: false,
  },
  {
    id: '3',
    name: 'Emma Davis',
    lastMessage: 'The project looks great!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    unread: 1,
    online: true,
  },
]

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const { showNotification } = useNotification()

  // Simulate receiving a new message
  useEffect(() => {
    const timer = setTimeout(() => {
      showNotification({
        title: 'New Message',
        message: 'You have received a new message from Sarah Wilson',
        type: 'info'
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [showNotification])

  return (
    <div className="bg-[#0B1120] min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto p-4">
        <div className="grid h-full grid-cols-12 gap-4">
          {/* Chat List */}
          <div className="col-span-4 rounded-2xl bg-slate-900/90 p-4 shadow-lg backdrop-blur-lg ring-1 ring-white/10">
            <h2 className="mb-4 text-xl font-semibold text-white">Messages</h2>
            <ChatList
              chats={mockChats}
              selectedChatId={selectedChat}
              onChatSelect={setSelectedChat}
            />
          </div>

          {/* Chat Window */}
          <div className="col-span-8 rounded-2xl bg-slate-900/90 shadow-lg backdrop-blur-lg ring-1 ring-white/10">
            {selectedChat ? (
              <ChatWindow
                chat={mockChats.find((chat) => chat.id === selectedChat)!}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mb-4 text-6xl">💬</div>
                  <p className="text-gray-400">Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 