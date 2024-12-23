import { screen } from '@testing-library/react';
import { render } from '@/tests/utils/test-utils';
import LoginPage from '@/app/(auth)/login/page';
import { useAuth } from '@/hooks/use-auth';

jest.mock('@/hooks/use-auth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });
  });

  it('should render login form', () => {
    render(<LoginPage />);
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account\? sign up/i)).toBeInTheDocument();
  });

  it('should redirect if already authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
      error: null,
    });

    render(<LoginPage />);
    
    expect(screen.queryByRole('heading', { name: /sign in/i })).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    render(<LoginPage />);
    
    expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
  });
});
