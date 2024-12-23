'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUpload: (url: string) => void;
}

export function ImageUpload({ currentImageUrl, onUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: 'destructive',
        description: 'Only image files are allowed',
      });
      return;
    }

    setIsUploading(true);
    try {
      // For testing purposes, we're using a placeholder URL
      // In production, this would be replaced with actual file upload logic
      const url = 'placeholder-url';
      onUpload(url);
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Failed to upload image',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="aspect-square w-full overflow-hidden rounded-full border bg-muted">
        {currentImageUrl ? (
          <Image
            src={currentImageUrl}
            alt="Profile"
            width={200}
            height={200}
            className="object-cover transition-opacity group-hover:opacity-50"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 rounded-full">
        <span className="sr-only">Upload image</span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
          aria-label="upload image"
        />
        <Upload className="h-6 w-6" />
      </label>
    </div>
  );
}
