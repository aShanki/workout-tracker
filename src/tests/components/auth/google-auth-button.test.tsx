import { render, screen, waitFor } from '@testing-library/react';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

// Mock the hooks
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithIdToken: jest.fn(),
    },
  }),
}));

// Mock the google accounts library
const mockGoogleAccounts = {
  id: {
    initialize: jest.fn(),
    renderButton: jest.fn(),
  },
};

// Mock window.google
global.window.google = {
  accounts: mockGoogleAccounts,
};

// Mock next/script
jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ onLoad }) => {
    // Simulate successful script load after a short delay
    setTimeout(() => {
      onLoad?.();
    }, 0);
    return null;
  },
}));

describe('GoogleAuthButton', () => {
  const mockToast = jest.fn();
  const mockPush = jest.fn();
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    // Set up test environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'test-client-id',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should show loading state initially', () => {
    render(<GoogleAuthButton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should initialize Google Sign-In after script loads', async () => {
    render(<GoogleAuthButton />);
    
    await waitFor(() => {
      expect(mockGoogleAccounts.id.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: 'test-client-id',
          auto_select: false,
        })
      );
    });
  });

  it('should render Google button container after initialization', async () => {
    render(<GoogleAuthButton />);
    
    await waitFor(() => {
      expect(screen.getByTestId('google-button')).toBeInTheDocument();
    });
  });

  it('should handle initialization failure gracefully', async () => {
    // Mock initialization failure
    mockGoogleAccounts.id.initialize.mockImplementationOnce(() => {
      throw new Error('Failed to initialize');
    });

    render(<GoogleAuthButton />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to initialize Google Sign-In')).toBeInTheDocument();
    });
  });

  it('should show error when Google Client ID is not configured', async () => {
    // Remove the client ID from env
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = '';
    
    render(<GoogleAuthButton />);
    
    await waitFor(() => {
      expect(screen.getByText('Google Client ID not configured')).toBeInTheDocument();
    });
  });
});