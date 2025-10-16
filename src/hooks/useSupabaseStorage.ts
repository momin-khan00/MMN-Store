import { useState } from 'react';
import { supabase } from '@/config/supabase';

export function useSupabaseStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads a file to a specified path within a bucket.
   * @param file The file to upload.
   * @param bucket The name of the storage bucket (e.g., 'apps').
   * @param path The full path for the file within the bucket (e.g., 'apks/user123/app.apk').
   * @returns The public URL of the uploaded file, or null on failure.
   */
  const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Upload the file
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false }); // upsert: false prevents overwriting

      if (uploadError) {
        // Handle specific error for already existing file
        if (uploadError.message.includes('duplicate key value violates unique constraint')) {
          throw new Error(`File already exists at path: ${path}. Please try again.`);
        }
        throw uploadError;
      }

      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
      
      return publicUrl;
    } catch (err: any) {
      console.error("Supabase Upload Error:", err);
      setError(err.message || "An error occurred during file upload.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading, error };
}
