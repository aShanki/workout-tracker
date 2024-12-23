import { useRouter } from 'next/navigation'
import { useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const useSignOut = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const signOut = useCallback(async () => {
    try {
      console.log('Starting client-side sign-out')
      
      // Clear all Supabase state
      await supabase.auth.signOut()
      
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') || key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key)
        }
      })

      // Clear any session storage
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('sb-') || key.startsWith('supabase.auth.')) {
          sessionStorage.removeItem(key)
        }
      })

      // Make server-side sign-out request
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      })

      // Force a full page reload to clear all React state
      window.location.assign('/login')
    } catch (error) {
      console.error('Sign out error:', error)
      // Force reload anyway
      window.location.reload()
    }
  }, [supabase])

  return { signOut }
}
