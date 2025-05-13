'use client'

import { useState, useRef, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'

interface Chat {
  id: string
  name: string
  online: boolean
}

interface Message {
  id: string
  content: string
  timestamp: string
  sender: 'user' | 'other'
}

interface ChatWindowProps {
  chat: Chat
}

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey, how are you?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    sender: 'other',
  },
  {
    id: '2',
    content: "I'm good, thanks! How about you?",
    timestamp: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    sender: 'user',
  },
  {
    id: '3',
    content: 'Working on the new project. Making good progress!',
    timestamp: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    sender: 'other',
  },
  {
    id: '4',
    content: "That's great to hear! Need any help?",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    sender: 'user',
  },
]

export default function ChatWindow({ chat }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: 'user',
    }

    setMessages((prev) => [...prev, message])
    setNewMessage('')
  }

  return (
    <div className="flex h-full flex-col">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center space-x-3">
          <div className="relative h-10 w-10">
            <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75" />
            <div className="absolute inset-0.5 rounded-full bg-slate-900">
              <div className="h-full w-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900" />
            </div>
            {chat.online && (
              <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-slate-900" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-white">{chat.name}</h3>
            <p className="text-sm text-gray-400">
              {chat.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-gradient-to-b from-slate-900/50 to-slate-800/30">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-lg backdrop-blur-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/20'
                    : 'bg-white/10 text-gray-100 shadow-slate-900/20 ring-1 ring-white/10'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="mt-1 text-right text-xs opacity-70">
                  {formatDistanceToNow(new Date(message.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="border-t border-white/10 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-xl bg-slate-800 px-4 py-2 text-white placeholder-gray-400 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
} 