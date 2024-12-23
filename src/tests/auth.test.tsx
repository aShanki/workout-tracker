import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from './test-utils';
import { LoginForm } from '@/components/forms/login-form';
import { SignupForm } from '@/components/forms/signup-form';
import { supabase } from '@/lib/supabase';
import { useToast, toast } from '@/components/ui/toast';

// Mock Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signInWithOAuth: jest.fn()
    }
  }
}));

// Mock toast hook
jest.mock('@/components/ui/toast', () => {
  const toastFn = jest.fn();
  return {
    useToast: () => ({ toast: toastFn }),
    toast: toastFn
  };
});

describe('Authentication Forms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Login Form', () => {
    it('renders login form with required fields', () => {
      render(<LoginForm />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^sign in$/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
      render(<LoginForm />);
      const submitButton = screen.getByRole('button', { name: /^sign in$/i, type: 'submit' });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
      });
    });

    it('handles successful login', async () => {
      const mockSignIn = jest.fn().mockResolvedValue({ data: {}, error: null });
      (supabase.auth.signInWithPassword as jest.Mock).mockImplementation(mockSignIn);

      render(<LoginForm />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      });
      
      const submitButton = screen.getByRole('button', { name: /^sign in$/i, type: 'submit' });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockSignIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });
  });

  describe('Signup Form', () => {
    it('renders signup form with required fields', () => {
      render(<SignupForm />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('shows validation errors for empty fields', async () => {
      render(<SignupForm />);
      const submitButton = screen.getByRole('button', { name: /sign up/i });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      });
    });

    it('handles successful signup', async () => {
      const mockSignUp = jest.fn().mockResolvedValue({ data: {}, error: null });
      (supabase.auth.signUp as jest.Mock).mockImplementation(mockSignUp);

      render(<SignupForm />);
      
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      });
      fireEvent.change(screen.getByLabelText(/full name/i), {
        target: { value: 'Test User' }
      });
      
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      
      await waitFor(() => {
        expect(mockSignUp).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          options: {
            data: {
              full_name: 'Test User'
            }
          }
        });
      });
    });
  });
});
