'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
  isSignUp?: boolean;
  onModeToggle?: () => void;
}

export function AuthForm({ isSignUp = false, onModeToggle }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: 'onChange', // Enable real-time validation
  });

  const onSubmit = async (values: AuthFormData) => {
    try {
      setIsLoading(true);
      console.log('📝 Submitting auth form:', isSignUp ? 'signup' : 'login');

      const { email, password } = values;
      const { data, error } = isSignUp
        ? await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          })
        : await supabase.auth.signInWithPassword({
            email,
            password,
          });

      if (error) throw error;

      console.log('✅ Auth success:', isSignUp ? 'signup' : 'login');
      console.log('📝 Session data:', data.session);

      // Store session
      if (data.session) {
        localStorage.setItem('supabase.auth.token', data.session.access_token);
        localStorage.setItem('supabase.auth.refreshToken', data.session.refresh_token);
      }

      window.location.href = '/dashboard';
    } catch (error) {
      console.error('❌ Auth error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : "Authentication failed",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            aria-label="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            {...register('password')}
            type="password"
            placeholder="Password"
            aria-label="password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-sm text-red-500" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="flex justify-center w-full">
        <GoogleAuthButton />
      </div>

      <Button
        type="button"
        variant="link"
        className="w-full mt-4 font-normal"
        onClick={onModeToggle}
      >
        {isSignUp 
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"}
      </Button>
    </div>
  );
}
