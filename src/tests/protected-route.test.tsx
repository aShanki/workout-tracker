import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '@/components/layout/protected-route';

// Mock the Spinner component
jest.mock('@/components/ui/spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

// Mock the entire auth hook module
jest.mock('@/hooks/use-auth', () => ({
  useAuth: jest.fn(() => ({
    user: null,
    loading: false,
    error: null,
  })),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

// Get the mocked function
const mockUseAuth = jest.requireMock('@/hooks/use-auth').useAuth;

describe('ProtectedRoute', () => {
  it('should show loading state when authenticating', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true, error: null });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should render children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
      error: null,
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', async () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false, error: null });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    await waitFor(() => {
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });
});
