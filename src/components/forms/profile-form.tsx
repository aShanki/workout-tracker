'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useProfile } from '@/hooks/use-profile';
import type { ProfileFormData } from '@/types/profile';

const profileSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  full_name: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export function ProfileForm() {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
    },
    values: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast({ description: "Profile updated successfully" });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to update profile",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          {...register('username')}
          placeholder="Username"
          aria-label="username"
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <p className="text-sm text-red-500" role="alert">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          {...register('full_name')}
          placeholder="Full Name"
          aria-label="full name"
        />
      </div>

      <div className="space-y-2">
        <Textarea
          {...register('bio')}
          placeholder="Bio"
          aria-label="bio"
          className="min-h-[100px]"
        />
        {errors.bio && (
          <p className="text-sm text-red-500" role="alert">
            {errors.bio.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={!isDirty}>
        Save Changes
      </Button>
    </form>
  );
}
