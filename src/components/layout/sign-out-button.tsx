'use client'

import { Button } from '@/components/ui/button'
import { useSignOut } from '@/hooks/use-sign-out'
import { useState } from 'react'

export function SignOutButton() {
  const { signOut } = useSignOut()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      disabled={isLoading}
      onClick={handleSignOut}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  )
}
