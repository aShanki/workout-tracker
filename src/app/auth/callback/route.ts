import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    
    try {
      console.log('📝 Exchanging code for session');
      const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ Code exchange error:', error);
        throw error;
      }

      if (session) {
        console.log('✅ Session established');
        
        // Set cookie manually if needed
        cookies().set('sb-auth-token', session.access_token, {
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return NextResponse.redirect(`${origin}${next}`);
      }
    } catch (error) {
      console.error('❌ Callback error:', error);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
