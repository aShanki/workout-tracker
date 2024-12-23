import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function POST() {
  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      return NextResponse.json(
        { error: signOutError.message },
        { status: 500 }
      )
    }

    const response = NextResponse.json(
      { message: 'Successfully signed out' },
      { status: 200 }
    )

    // Clear all auth-related cookies
    const cookiesToClear = [
      'supabase-auth-token',
      'sb-access-token',
      'sb-refresh-token',
      `sb-${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}-auth-token`
    ]

    cookiesToClear.forEach(name => {
      cookieStore.delete(name)
      cookieStore.delete(name, { path: '/' })
      response.cookies.delete(name)
      response.cookies.delete(name, { path: '/' })
    })

    // Set redirect URL in the response
    response.headers.set('Location', '/login')

    return response
  } catch (error) {
    console.error('Unexpected error during signout:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
