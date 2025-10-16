import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/context/AuthContext';

export function useSupabaseStorage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    if (!user) {
      setError("User not authenticated.");
      return null;
    }
    
    setUploading(true);
    setError(null);

    try {
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false, // Don't overwrite existing files
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded file
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
      return publicUrl;
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during upload.");
      console.error("Upload Error:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
}
