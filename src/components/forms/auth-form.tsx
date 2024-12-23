'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { signInWithEmail, signUpWithEmail } from '@/lib/supabase';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

export function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
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
      if (isLogin) {
        await signInWithEmail(data.email, data.password);
        toast({ description: "Successfully signed in!" });
      } else {
        await signUpWithEmail(data.email, data.password);
        toast({ description: "Account created successfully!" });
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
      </form>

      <Button
        variant="link"
        className="w-full"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
      </Button>
    </div>
  );
}
