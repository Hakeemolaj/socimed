'use client'

import { formatDistanceToNow } from 'date-fns'

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: string
  unread: number
  online: boolean
}

interface ChatListProps {
  chats: Chat[]
  selectedChatId: string | null
  onChatSelect: (chatId: string) => void
}

export default function ChatList({ chats, selectedChatId, onChatSelect }: ChatListProps) {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatSelect(chat.id)}
          className={`group w-full rounded-xl p-3 text-left transition-all duration-200 ${
            selectedChatId === chat.id
              ? 'bg-blue-500/10 ring-1 ring-blue-500/50'
              : 'hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative h-12 w-12 flex-shrink-0">
              <div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 group-hover:opacity-100" />
              <div className="absolute inset-0.5 rounded-full bg-slate-900">
                <div className="h-full w-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900" />
              </div>
              {chat.online && (
                <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-slate-900" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white group-hover:text-blue-400 transition-colors">{chat.name}</h3>
                <p className="text-sm text-gray-400">
                  {formatDistanceToNow(new Date(chat.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <p className="truncate text-sm text-gray-400">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white shadow-lg shadow-blue-500/20">
                {chat.unread}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
} 