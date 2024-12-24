'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/forms/auth-form';
import { Loader2 } from 'lucide-react';

export default function SignUpPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  const handleModeToggle = () => {
    router.push('/login');
  };

  if (loading) {
    return (
      <div data-testid="auth-loading" className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">
        Create your account
      </h1>
      <p className="text-sm text-muted-foreground">
        Enter your details to get started on your fitness journey
      </p>
      <AuthForm isSignUp onModeToggle={handleModeToggle} />
    </>
  );
}