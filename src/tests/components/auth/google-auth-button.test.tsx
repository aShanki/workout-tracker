import { render, screen, waitFor, act } from '@testing-library/react';
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
  default: ({ onLoad, onError }) => {
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

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should show loading state initially', () => {
    render(<GoogleAuthButton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should initialize Google Sign-In after script loads', async () => {
    render(<GoogleAuthButton />);
    
    await waitFor(() => {
      expect(mockGoogleAccounts.id.initialize).toHaveBeenCalled();
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
      expect(screen.getByText('Failed to load Google Sign-In')).toBeInTheDocument();
    });
  });
});