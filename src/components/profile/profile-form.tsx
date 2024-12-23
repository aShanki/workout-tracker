'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/hooks/use-profile';
import type { ProfileFormData } from '@/types/profile';

const profileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters'),
  full_name: z.string().optional(),
  bio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .transform(val => val === '' ? undefined : val),
});

export function ProfileForm() {
  const { profile, isLoading, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username,
        full_name: profile.full_name,
        bio: profile.bio,
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await updateProfile(data);
      if (error) throw error;
      
      toast({
        description: "Profile updated successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username *
          </label>
          <Input
            id="username"
            {...register('username')}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? "username-error" : undefined}
          />
          {errors.username && (
            <p id="username-error" className="text-sm text-red-500" role="alert">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="full_name">Full Name</label>
          <Input
            id="full_name"
            {...register('full_name')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bio">Bio</label>
          <Textarea
            id="bio"
            {...register('bio')}
            aria-invalid={!!errors.bio}
          />
          {errors.bio && (
            <p className="text-sm text-red-500">{errors.bio.message}</p>
          )}
        </div>

        <Button type="submit" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Card>
  );
}
