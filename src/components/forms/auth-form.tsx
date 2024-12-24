'use client';

import { useState, useCallback } from 'react';
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
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase';
import { AuthFormValues, authSchema } from '@/lib/validations/auth';

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
  
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur', // Enable validation on blur
  });

  const onSubmit = useCallback(async (data: AuthFormValues) => {
    try {
      if (isSignUp) {
        await signUpWithEmail(data.email, data.password)
      } else {
        await signInWithEmail(data.email, data.password)
      }
    } catch (error) {
      console.error('Auth error:', error)
    }
  }, [isSignUp]);

  return (
    <div className="w-full max-w-md space-y-6">
      <form 
        className="space-y-4" 
        onSubmit={form.handleSubmit(onSubmit)}
        role="form"
        aria-label={isSignUp ? 'Sign up form' : 'Sign in form'}
      >
        <div className="space-y-2">
          <Input
            {...form.register('email', { 
              required: true,
              validate: (value) => {
                try {
                  authSchema.shape.email.parse(value);
                  return true;
                } catch (error) {
                  return false;
                }
              }
            })}
            type="email"
            placeholder="Email"
            aria-label="email"
            aria-invalid={!!form.formState.errors.email}
            aria-describedby={form.formState.errors.email ? "email-error" : undefined}
          />
          {form.formState.errors.email && (
            <p role="alert" id="email-error" className="text-sm text-red-500">
              {form.formState.errors.email.message || 'Invalid email address'}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Input
            {...form.register('password', {
              required: true,
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            type="password"
            placeholder="Password"
            aria-label="password"
            aria-invalid={!!form.formState.errors.password}
            aria-describedby={form.formState.errors.password ? "password-error" : undefined}
          />
          {form.formState.errors.password && (
            <p role="alert" id="password-error" className="text-sm text-red-500">
              {form.formState.errors.password.message || 'Invalid password'}
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
