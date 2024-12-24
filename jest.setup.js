import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

// Set up test environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
      update: jest.fn(),
      eq: jest.fn(),
      single: jest.fn(),
    })),
    auth: {
      getSession: jest.fn(() => Promise.resolve({
        data: { session: null },
        error: null,
      })),
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: (data, init) => new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'content-type': 'application/json',
          ...init?.headers,
        },
      }),
    },
  };
});

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => ({
    auth: {
      signOut: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
    },
  })),
  createRouteHandlerClient: jest.fn(),
}));

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

global.Request = class extends Request {
  constructor(input, init) {
    if (typeof input === 'string') {
      super(input, init);
    } else {
      super('http://localhost', init);
    }
  }
};

// Global setup
global.Response = class Response {
  constructor(body, init) {
    this.body = body;
    this.init = init;
    this.status = init?.status || 200;
  }

  async json() {
    return JSON.parse(this.body);
  }
};

// Suppress console errors during tests
console.error = jest.fn();
