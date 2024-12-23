import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ 
      cookies: () => cookieStore 
    })

    // Clear server-side session
    await supabase.auth.signOut()
    
    // Create response with no-cache headers
    const response = NextResponse.json(
      { success: true },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store'
        }
      }
    )

    // Clear all auth cookies
    const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
    const cookiesToClear = [
      `sb-${PROJECT_ID}-auth-token`,
      'sb-access-token',
      'sb-refresh-token',
      'supabase-auth-token'
    ]

    cookiesToClear.forEach(name => {
      response.cookies.set(name, '', {
        path: '/',
        expires: new Date(0),
        maxAge: 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })
    })

    return response
  } catch (error) {
    console.error('Sign out error:', error)
    return NextResponse.json(
      { error: 'Internal server error during sign out' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
