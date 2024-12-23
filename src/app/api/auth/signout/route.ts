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
    const supabase = createRouteHandlerClient({
      cookies: () => ({
        async get(name: string) {
          try {
            const cookie = await Promise.resolve(cookieStore.get(name))
            return cookie?.value
          } catch (error) {
            console.error('Error getting cookie:', error)
            return null
          }
        },
        async set(name: string, value: string, options: any) {
          cookieStore.set(name, value, options)
        },
        async remove(name: string, options: any) {
          cookieStore.delete(name, options)
        }
      })
    })

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

    // Clear all auth cookies
    const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
    const cookiesToClear = [
      `sb-${PROJECT_ID}-auth-token`,
      `sb-${PROJECT_ID}-auth-token-code-verifier`
    ]

    cookiesToClear.forEach(name => {
      response.cookies.set(name, '', {
        expires: new Date(0),
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        httpOnly: true
      })
    })

    return response
  } catch (error) {
    console.error('Unexpected error during signout:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
