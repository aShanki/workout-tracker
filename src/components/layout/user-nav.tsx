'use client'

import { useAuth } from '@/hooks/use-auth'
import { SignInButton } from '@/components/auth/sign-in-button'
import { UserNavSkeleton } from '@/components/ui/user-nav-skeleton'
// ...existing imports...

export function UserNav() {
  const { user, loading } = useAuth()

  console.log('🧭 UserNav state:', { 
    isLoading: loading, 
    isAuthenticated: !!user,
    user: user ? 'exists' : 'null'
  })

  if (loading) {
    return <UserNavSkeleton />
  }

  if (!user) {
    return <SignInButton />
  }

  return (
    // ...existing render code...
  )
}