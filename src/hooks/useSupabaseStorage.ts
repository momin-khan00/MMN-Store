import { useState } from 'react';
import { supabase } from '../config/supabase';

export const useSupabaseStorage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const filePath = `${bucket}/${path}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return data.path;
  };

  const getPublicUrl = (bucket: string, path: string) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  };

  const uploadFiles = async (files: { [key: string]: File }) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles: { [key: string]: string } = {};
      const fileKeys = Object.keys(files);
      const totalFiles = fileKeys.length;

      for (let i = 0; i < totalFiles; i++) {
        const key = fileKeys[i];
        const file = files[key];
        
        if (file) {
          let bucket = 'apps';
          let folder = 'others';
          
          // Determine bucket and folder based on file type
          if (key === 'apk') {
            bucket = 'apps';
            folder = 'apks';
          } else if (key === 'icon') {
            bucket = 'apps';
            folder = 'icons';
          } else if (key.startsWith('screenshot')) {
            bucket = 'apps';
            folder = 'screenshots';
          }
          
          const path = await uploadFile(file, bucket, folder);
          uploadedFiles[key] = getPublicUrl(bucket, path);
          setUploadProgress(((i + 1) / totalFiles) * 100);
        }
      }

      return uploadedFiles;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return { isUploading, uploadProgress, uploadFiles };
};
