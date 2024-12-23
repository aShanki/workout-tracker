'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    mode: 'onChange', // Enable real-time validation
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      setIsLoading(true);
      if (isSignUp) {
        await signUpWithEmail(data.email, data.password);
        toast({ description: "Account created successfully!" });
      } else {
        await signInWithEmail(data.email, data.password);
        toast({ description: "Successfully signed in!" });
      }
      reset();
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "Authentication failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
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

      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={onModeToggle}
      >
        {isSignUp 
          ? 'Already have an account? Sign in'
          : "Don't have an account? Sign up"}
      </Button>
    </div>
  );
}
