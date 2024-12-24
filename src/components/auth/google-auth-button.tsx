'use client';

import { createClient } from '@/lib/supabase/client';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

declare global {
  interface Window {
    google: any;
    handleSignInWithGoogle: (response: any) => Promise<void>;
  }
}

export function GoogleAuthButton() {
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Successfully signed in with Google',
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign in with Google',
        variant: 'destructive',
      });
    }
  }, [router, supabase.auth, toast]);

  useEffect(() => {
    window.handleSignInWithGoogle = handleCredentialResponse;
  }, [handleCredentialResponse]);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => {
          window.google?.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: window.handleSignInWithGoogle,
            auto_select: true,
            use_fedcm_for_prompt: true,
          });
          window.google?.accounts.id.renderButton(
            document.getElementById('google-button'),
            {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'pill',
              width: 300,
            }
          );
        }}
        strategy="afterInteractive"
        id="google-signin"
      />
      <div className="w-full flex justify-center items-center">
        <div 
          id="google-button"
          data-testid="google-button"
          className="w-[300px] h-[40px] flex justify-center items-center"
        />
      </div>
    </>
  );
}
