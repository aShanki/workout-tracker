'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileForm } from '@/components/forms/profile-form';
import { ImageUpload } from '@/components/profile/image-upload';
import { useProfile } from '@/hooks/use-profile';
import { useTheme } from 'next-themes';

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const { theme } = useTheme();

  const handleImageUpload = async (url: string) => {
    if (profile) {
      await updateProfile({
        ...profile,
        avatar_url: url,
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 transition-colors duration-300">
      <Card className="p-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              <div>
                <ImageUpload
                  currentImageUrl={profile?.avatar_url}
                  onUpload={handleImageUpload}
                />
              </div>
              <ProfileForm />
            </div>
          </TabsContent>
          <TabsContent value="settings">
            {/* Settings content here */}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
