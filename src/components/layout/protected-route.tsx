'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
