import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    console.log('🔍 Checking session in middleware')
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Middleware session error:', error)
      return res
    }

    console.log('📝 Session state:', session ? 'active' : 'none')

    // Refresh session if exists
    if (session) {
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession()
      
      if (refreshError) {
        console.error('❌ Session refresh error:', refreshError)
      } else {
        console.log('✅ Session refreshed')
      }
    }

  } catch (error) {
    console.error('❌ Middleware error:', error)
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}
