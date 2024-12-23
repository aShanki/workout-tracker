'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, ProfileFormData } from '@/types/profile';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to fetch profile'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updateData: Partial<ProfileFormData>) => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to update profile'));
      return { data: null, error: e };
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, isLoading, error, updateProfile, fetchProfile };
}
