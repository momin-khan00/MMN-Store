import { useState } from 'react';
import { supabase } from '@/config/supabase';

/**
 * Custom hook to handle file uploads to a specific Supabase bucket.
 */
export function useSupabaseStorage() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Uploads a file to a predefined 'apps' bucket.
   * @param file The file object to upload.
   * @param path The full path including folders and filename for the object in the bucket.
   * @returns The public URL of the uploaded file, or null if an error occurred.
   */
  const uploadFile = async (file: File, path: string): Promise<string | null> => {
    setIsUploading(true);
    setError(null);
    try {
      // THE FIX: The function correctly takes 2 arguments and uses the 'apps' bucket.
      const { data, error: uploadError } = await supabase.storage
        .from('apps') 
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('apps').getPublicUrl(data.path);
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
