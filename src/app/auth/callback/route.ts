import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      console.log('🔍 Processing auth callback')
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Code exchange error:', error)
        throw error
      }

      console.log('✅ Session established')
      console.log('📝 Session data:', session)

      return NextResponse.redirect(requestUrl.origin)
    } catch (error) {
      console.error('❌ Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/login?error=code`)
}
