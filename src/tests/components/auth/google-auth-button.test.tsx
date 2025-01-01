import { render, screen, waitFor, act } from '@testing-library/react';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';

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
    // Trigger onLoad immediately in test environment
    setTimeout(() => {
      onLoad?.();
    }, 0);
    return null;
  },
}));

describe('GoogleAuthButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show loading state initially', () => {
    render(<GoogleAuthButton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render Google Sign-In button after loading', async () => {
    render(<GoogleAuthButton />);
    
    // Allow script onLoad to execute
    await act(async () => {
      jest.advanceTimersByTime(100);
    });
    
    await waitFor(() => {
      expect(mockGoogleAccounts.id.initialize).toHaveBeenCalled();
      expect(screen.getByTestId('google-button')).toBeInTheDocument();
    });
  });

  it('should initialize Google Sign-In with correct parameters', async () => {
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'test-client-id';
    
    render(<GoogleAuthButton />);
    
    await act(async () => {
      jest.advanceTimersByTime(100);
    });

    await waitFor(() => {
      expect(mockGoogleAccounts.id.initialize).toHaveBeenCalledWith(
        expect.objectContaining({
          client_id: 'test-client-id',
          auto_select: false,
          use_fedcm_for_prompt: true,
        })
      );
    });
  });
});