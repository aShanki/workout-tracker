import { render, screen, fireEvent } from '@testing-library/react';
import { AuthNav } from '@/components/layout/nav/auth-nav';
import { useAuth } from '@/hooks/use-auth';

jest.mock('@/hooks/use-auth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('AuthNav', () => {
  it('should show login and signup buttons when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });

    render(<AuthNav />);
    
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  it('should show user menu when authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { email: 'test@example.com' },
      loading: false,
      error: null,
    });

    render(<AuthNav />);
    
    // Check for avatar fallback with first letter of email
    expect(screen.getByText('T')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /user menu/i })).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    render(<AuthNav />);
    
    expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
  });
});
