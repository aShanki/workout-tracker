'use client';

import { createClient } from '@/lib/supabase/client';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useState, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    handleSignInWithGoogle: (response: any) => Promise<void>;
  }
}

const supabase = createClient();

export function GoogleAuthButton() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const buttonContainerRef = useRef<HTMLDivElement>(null);
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
  }, [router, toast]);

  useEffect(() => {
    window.handleSignInWithGoogle = handleCredentialResponse;
  }, [handleCredentialResponse]);

  const initializeGoogleSignIn = useCallback(() => {
    if (!window.google?.accounts?.id) {
      setHasError(true);
      setErrorMessage('Google API not available');
      return;
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      setHasError(true);
      setErrorMessage('Google Client ID not configured');
      return;
    }

    if (!buttonContainerRef.current) {
      console.error('Button container not found');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: window.handleSignInWithGoogle,
        auto_select: false,
      });

      window.google.accounts.id.renderButton(
        buttonContainerRef.current,
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          width: 300,
        }
      );

      setIsScriptLoaded(true);
    } catch (err) {
      console.error('Failed to initialize Google Sign-In:', err);
      setHasError(true);
      setErrorMessage('Failed to initialize Google Sign-In');
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded && buttonContainerRef.current) {
      initializeGoogleSignIn();
    }
  }, [isScriptLoaded, initializeGoogleSignIn]);

  if (hasError) {
    return (
      <div className="w-full text-center text-red-500">
        <p>{errorMessage}</p>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-blue-500 hover:underline mt-2"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => {
          setHasError(true);
          setErrorMessage('Failed to load Google script');
        }}
        id="google-signin"
      />
      <div className="w-full flex justify-center items-center min-h-[40px]">
        {!isScriptLoaded ? (
          <Loader2 
            className="h-6 w-6 animate-spin" 
            role="status" 
            aria-label="Loading Google Sign-In" 
          />
        ) : (
          <div 
            ref={buttonContainerRef}
            id="google-button"
            data-testid="google-button"
            className="w-[300px] h-[40px] flex justify-center items-center"
          />
        )}
      </div>
    </>
  );
}