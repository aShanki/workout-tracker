import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, password, action } = await req.json();

    if (!email || !password || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let result;
    if (action === 'signup') {
      result = await supabase.auth.signUp({
        email,
        password,
      });
    } else if (action === 'signin') {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ user: result.data.user });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
