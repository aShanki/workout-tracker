import { screen } from '@testing-library/react';
import { render } from '@/tests/utils/test-utils';
import SignUpPage from '@/app/(auth)/signup/page';
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

describe('SignUpPage', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      error: null,
    });
  });

  it('should render signup form', () => {
    render(<SignUpPage />);
    
    expect(screen.getByRole('heading', { name: /create an account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account\? sign in/i)).toBeInTheDocument();
  });

  it('should redirect if already authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
      error: null,
    });

    render(<SignUpPage />);
    
    expect(screen.queryByRole('heading', { name: /create an account/i })).not.toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      error: null,
    });

    render(<SignUpPage />);
    
    expect(screen.getByTestId('auth-loading')).toBeInTheDocument();
  });
});
