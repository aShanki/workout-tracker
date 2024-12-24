import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { POST, GET } from '@/app/api/auth/signout/route';

// Mock the modules
jest.mock('@supabase/auth-helpers-nextjs');
jest.mock('next/headers');
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn().mockImplementation((data, init) => ({
      status: init?.status || 200,
      json: async () => data,
      headers: new Headers(init?.headers),
    })),
  },
}));

describe('Sign Out API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully sign out the user', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null });
    const mockSetCookie = jest.fn();
    const mockSupabase = {
      auth: { signOut: mockSignOut }
    };
    
    (createRouteHandlerClient as jest.Mock).mockReturnValue(mockSupabase);
    (cookies as unknown as jest.Mock).mockReturnValue({
      getAll: () => [],
      set: mockSetCookie,
    });

    const req = new Request('http://localhost:3000/api/auth/signout', {
      method: 'POST',
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual({ message: 'Successfully signed out' });
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('should handle GET requests', async () => {
    const response = await GET();
    expect(response.status).toBe(405);  // Fixed syntax error
    const data = await response.json();
    expect(data).toEqual({ error: 'Method not allowed' });
  });
});
