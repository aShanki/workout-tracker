import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { type User } from '@supabase/auth-helpers-nextjs'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    console.log('🔍 Initializing auth hook')
    
    // Check current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('📝 Current session:', session)
        if (error) console.error('❌ Session error:', error)
        
        setUser(session?.user ?? null)
        console.log('👤 User state:', session?.user ? 'logged in' : 'not logged in')
      } catch (error) {
        console.error('❌ Session check error:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Initial session check
    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      console.log('♻️ Cleaning up auth hook')
      subscription.unsubscribe()
    }
  }, [supabase])

  return { user, loading }
}
