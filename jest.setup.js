import '@testing-library/jest-dom'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    }
  },
  usePathname() {
    return ''
  },
}))

// Mock next-auth
jest.mock('next-auth/react', () => {
  const originalModule = jest.requireActual('next-auth/react')
  const mockSession = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    user: { 
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      image: '/default-avatar.jpg' 
    }
  }
  
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return { data: mockSession, status: 'authenticated' }
    }),
    getSession: jest.fn(() => Promise.resolve(mockSession)),
    signIn: jest.fn(() => Promise.resolve({ ok: true })),
    signOut: jest.fn(() => Promise.resolve({ ok: true })),
  }
})

// Mock fetch
global.fetch = jest.fn()

// Global setup
global.beforeEach(() => {
  // Reset mocks
  jest.clearAllMocks()
  
  // Setup fetch mock default
  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({}),
  })
}) 