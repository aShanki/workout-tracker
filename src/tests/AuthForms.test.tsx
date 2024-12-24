import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthForm } from '@/components/forms/auth-form';
import { renderWithProviders } from './test-utils';

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

  it('should render login form by default', () => {
    renderWithProviders(<AuthForm />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should render signup form when isSignUp is true', () => {
    renderWithProviders(<AuthForm isSignUp />)
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

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
    renderWithProviders(<AuthForm />);
    const user = userEvent.setup();
    const emailInput = screen.getByPlaceholderText(/email/i);
    
    await user.type(emailInput, 'invalid-email');
    fireEvent.blur(emailInput); // Trigger validation
    
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(/invalid email address/i);
    });
  });

  it('should validate password length', async () => {
    renderWithProviders(<AuthForm />);
    const user = userEvent.setup();
    const passwordInput = screen.getByPlaceholderText(/password/i);
    
    await user.type(passwordInput, '12345');
    fireEvent.blur(passwordInput); // Trigger validation
    
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage).toHaveTextContent(/password must be at least 6 characters/i);
    });
  });

  it('should handle successful login', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ user: { id: '1' } });
    
    renderWithProviders(<AuthForm />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const form = screen.getByRole('form');

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    // Use form submission instead of button click
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    }, { timeout: 3000 });
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
