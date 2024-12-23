import { renderHook, act } from '@testing-library/react';
import { useProfile } from '@/hooks/use-profile';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(),
      update: jest.fn(),
      eq: jest.fn(),
      single: jest.fn(),
    })),
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('useProfile', () => {
  const mockProfile = {
    id: '1',
    user_id: '123',
    username: 'testuser',
    full_name: 'Test User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });
  });

  it('should fetch profile data', async () => {
    const mockSelect = jest.fn().mockResolvedValue({
      data: mockProfile,
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: mockSelect,
        }),
      }),
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.fetchProfile();
    });

    expect(result.current.profile).toEqual(mockProfile);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle update profile', async () => {
    const updateData = { username: 'newusername' };
    const mockUpdate = jest.fn().mockResolvedValue({
      data: { ...mockProfile, ...updateData },
      error: null,
    });

    (supabase.from as jest.Mock).mockReturnValue({
      update: () => ({
        eq: () => ({
          select: () => ({
            single: mockUpdate,
          }),
        }),
      }),
    });

    const { result } = renderHook(() => useProfile());

    await act(async () => {
      await result.current.updateProfile(updateData);
    });

    expect(result.current.profile?.username).toBe('newusername');
  });
});
