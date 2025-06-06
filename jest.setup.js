import '@testing-library/jest-dom'

// Polyfill for Request
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init) {
      this.url = input;
      this.method = init?.method || 'GET';
      this.headers = new Headers(init?.headers);
      // Add other properties and methods as needed for your tests
    }
  };
}

// Polyfill for Headers, Request, Response
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init) {
      this._headers = {};
      if (init) {
        for (const [key, value] of Object.entries(init)) {
          this._headers[key.toLowerCase()] = value;
        }
      }
    }
    append(name, value) {
      this._headers[name.toLowerCase()] = value;
    }
    get(name) {
      return this._headers[name.toLowerCase()];
    }
    // Add other methods as needed
  };
}

if (typeof global.Response === 'undefined') {
  global.Response = class Response {
    constructor(body, init) {
      this.body = body; // In a real Response, body would be a ReadableStream
      this.status = init?.status || 200;
      this.statusText = init?.statusText || '';
      this.headers = new Headers(init?.headers);
      this.ok = this.status >= 200 && this.status < 300;
    }

    async json() {
      // In a real Response, this would consume the body stream
      return JSON.parse(this.body);
    }

    static json(data, init) {
      const body = JSON.stringify(data);
      const headers = new Headers(init?.headers);
      headers.append('Content-Type', 'application/json');
      return new Response(body, { ...init, headers });
    }
    // Add other methods as needed (e.g., text(), blob(), etc.)
  };
}

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