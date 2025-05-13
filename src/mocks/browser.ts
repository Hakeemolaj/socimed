// This file is temporarily disabled to avoid import issues with MSW v2
/*
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// Create the MSW worker for the browser environment
export const worker = setupWorker(...handlers)

// Initialize the worker for development mode
if (process.env.NODE_ENV === 'development') {
  worker.start({
    onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
  })
}
*/

// Export a placeholder to avoid import errors
export const worker = {
  start: () => Promise.resolve()
} 