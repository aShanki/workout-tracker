import { POST } from '@/app/api/auth/route';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

const mockRequest = (body: any) => new Request('http://localhost/api/auth', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

describe('Auth API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth', () => {
    it('should handle sign up', async () => {
      const mockSupabase = jest.requireMock('@/lib/supabase').supabase;
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: { user: { id: '1' } },
        error: null,
      });

      const response = await POST(mockRequest({
        email: 'test@example.com',
        password: 'password123',
        action: 'signup',
      }));

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('user');
    });

    it('should handle sign in', async () => {
      const mockSupabase = jest.requireMock('@/lib/supabase').supabase;
      mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: { id: '1' } },
        error: null,
      });

      const response = await POST(mockRequest({
        email: 'test@example.com',
        password: 'password123',
        action: 'signin',
      }));

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('user');
    });

    it('should handle errors', async () => {
      const mockSupabase = jest.requireMock('@/lib/supabase').supabase;
      mockSupabase.auth.signUp.mockResolvedValueOnce({
        data: null,
        error: new Error('Invalid password'),
      });

      const response = await POST(mockRequest({
        email: 'test@example.com',
        password: 'short',
        action: 'signup',
      }));

      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });
});
