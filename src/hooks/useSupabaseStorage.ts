import { useState } from 'react';
import { supabase } from '@/config/supabase';

export function useSupabaseStorage() {
  const [isUploading, setIsUploading] = useState(false);

  // This function now throws a detailed error on failure.
  const uploadFile = async (file: File, path: string): Promise<string> => {
    setIsUploading(true);
    try {
      const { data, error: uploadError } = await supabase.storage
        .from('apps')
        .upload(path, file, { upsert: false });

      if (uploadError) {
        // Throw the actual, detailed error from Supabase
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage.from('apps').getPublicUrl(data.path);
      return publicUrl;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
}
