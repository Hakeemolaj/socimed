import { Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface NotificationProps {
  show: boolean
  message: string
  title: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export default function Notification({
  show,
  message,
  title,
  type = 'info',
  onClose,
}: NotificationProps) {
  const bgColor = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    error: 'bg-gradient-to-r from-red-500 to-rose-500',
    info: 'bg-gradient-to-r from-blue-500 to-indigo-500',
  }[type]

  return (
    <div className="fixed top-4 right-4 z-50">
      <Transition
        show={show}
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={`rounded-xl shadow-lg ${bgColor} max-w-sm w-full pointer-events-auto`}>
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {title}
                </p>
                <p className="mt-1 text-sm text-white/90">
                  {message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  className="inline-flex text-white hover:text-white/80 focus:outline-none"
                  onClick={onClose}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  )
} 