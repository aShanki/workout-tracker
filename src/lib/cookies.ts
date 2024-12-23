import { cookies } from 'next/headers'
import { type ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

export const clearAuthCookies = async () => {
  console.log('🚀 Starting cookie clearing process')
  const cookieStore = await cookies()
  
  console.log('📝 Initial cookies:', await cookieStore.getAll())
  
  const PROJECT_ID = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID
  console.log('🔑 Project ID:', PROJECT_ID)

  const baseOptions: Partial<ResponseCookie> = {
    path: '/',
    expires: new Date(0),
    maxAge: -1,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }

  const cookieNames = [
    'sb-access-token',
    'sb-refresh-token',
    `sb-${PROJECT_ID}-auth-token`,
    `sb-${PROJECT_ID}-auth-token-code-verifier`,
    'supabase-auth-token'
  ]

  console.log('🍪 Cookies to clear:', cookieNames)

  await Promise.all(
    cookieNames.flatMap(name => [
      cookieStore.set(name, '', baseOptions),
      cookieStore.set(name, '', { ...baseOptions, domain: 'localhost' }),
      cookieStore.delete(name),
      cookieStore.delete(name, { path: '/' }),
      cookieStore.delete(name, { path: '/api' })
    ])
  )

  console.log('📝 Remaining cookies:', await cookieStore.getAll())
  console.log('✅ Cookie clearing complete')

  return cookieNames
}
