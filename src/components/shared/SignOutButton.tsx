'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
    }
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to sign out')
      }

      router.push('/login')
      router.refresh()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleSignOut}
      disabled={isLoading}
      className="w-full justify-start"
      data-testid="sign-out-button"
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  )
}
