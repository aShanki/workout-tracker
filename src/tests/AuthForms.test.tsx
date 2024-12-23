import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/tests/utils/test-utils';
import { AuthForm } from '@/components/forms/auth-form';

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockUseAuth = jest.fn();

jest.mock('@/hooks/use-auth', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/lib/supabase', () => ({
  signInWithEmail: (...args: any[]) => mockSignIn(...args),
  signUpWithEmail: (...args: any[]) => mockSignUp(...args),
}));

// Mock useRouter
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('AuthForm', () => {
  const mockOnModeToggle = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    jest.clearAllMocks();
  });

  it('should toggle between login and signup modes', () => {
    render(<AuthForm onModeToggle={mockOnModeToggle} />);
    const toggleButton = screen.getByRole('button', { name: /don't have an account\? sign up/i });
    fireEvent.click(toggleButton);
    expect(mockOnModeToggle).toHaveBeenCalled();
  });

  it('should show correct mode text for signup', () => {
    render(<AuthForm isSignUp={true} />);
    
    // Check for submit button text
    const submitButton = screen.getByRole('button', { name: /^sign up$/i, type: 'submit' });
    expect(submitButton).toBeInTheDocument();
    
    // Check for mode toggle text
    const toggleButton = screen.getByRole('button', { 
      name: /already have an account\? sign in/i,
      type: 'button'
    });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    render(<AuthForm />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' },
    });
    
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/invalid email address/i);
    });
  });

  it('should validate password length', async () => {
    render(<AuthForm />);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    fireEvent.change(passwordInput, {
      target: { value: '12345' },
    });
    
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/password must be at least 6 characters/i);
    });
  });

  it('should handle successful login', async () => {
    render(<AuthForm />);
    mockSignIn.mockResolvedValueOnce({ user: { id: '1' } });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should call onModeToggle when toggling modes', () => {
    render(<AuthForm onModeToggle={mockOnModeToggle} />);
    const toggleButton = screen.getByRole('button', {
      name: /don't have an account\? sign up/i
    });
    fireEvent.click(toggleButton);
    expect(mockOnModeToggle).toHaveBeenCalled();
  });
});
