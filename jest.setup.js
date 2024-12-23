import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';

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

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

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
