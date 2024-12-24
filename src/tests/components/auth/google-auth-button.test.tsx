import { render, screen, waitFor } from '@testing-library/react';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { createClient } from '@/lib/supabase/client';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithIdToken: jest.fn(),
    },
  })),
}));

// Mock window.google
const mockGoogleAccounts = {
  id: {
    initialize: jest.fn(),
    renderButton: jest.fn(),
    prompt: jest.fn(),
  },
};

global.window.google = {
  accounts: mockGoogleAccounts,
};

describe('GoogleAuthButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Google Sign-In with correct parameters', async () => {
    render(<GoogleAuthButton />);

    await waitFor(() => {
      expect(mockGoogleAccounts.id.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: expect.any(Function),
          auto_select: true,
          use_fedcm_for_prompt: true,
        })
      );
    });
  });

  it('should render Google Sign-In button', async () => {
    render(<GoogleAuthButton />);
    
    const buttonContainer = screen.getByTestId('google-button');
    expect(buttonContainer).toBeInTheDocument();
  });
});
