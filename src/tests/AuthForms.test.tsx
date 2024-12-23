import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '@/components/forms/auth-form';
import { ToastProvider } from '@/components/ui/toast';

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

describe('AuthForm', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });
    render(
      <ToastProvider>
        <AuthForm />
      </ToastProvider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should toggle between login and signup modes', () => {
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/need an account/i));
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('should validate email format', async () => {
    const emailInput = screen.getByLabelText(/email/i);
    
    // Type invalid email
    fireEvent.change(emailInput, {
      target: { value: 'invalid-email' },
    });
    
    // Trigger blur event to force validation
    fireEvent.blur(emailInput);
    
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/invalid email address/i);
    });
  });

  it('should validate password length', async () => {
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Type short password
    fireEvent.change(passwordInput, {
      target: { value: '12345' },
    });
    
    // Trigger blur event
    fireEvent.blur(passwordInput);
    
    await waitFor(() => {
      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveTextContent(/password must be at least 6 characters/i);
    });
  });

  it('should handle successful login', async () => {
    mockSignIn.mockResolvedValueOnce({ user: { id: '1' } });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
