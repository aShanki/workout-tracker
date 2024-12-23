import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ profile });
}

export async function PUT(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const updates = await req.json();

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', session.user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ profile: data });
}
