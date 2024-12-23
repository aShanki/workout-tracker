import { useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false,
        error: error,
      }));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          loading: false,
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
