import { useState } from 'react';
import { getB2AuthToken, getUploadUrl, uploadFileToB2, getPublicUrl } from '../lib/backblaze';

export const useBackblaze = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFiles = async (files: { [key: string]: File }) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get Backblaze B2 authorization
      const b2Auth = await getB2AuthToken();
      
      // Get upload URL
      const uploadUrlData = await getUploadUrl(
        b2Auth.allowed.bucketId,
        b2Auth.authorizationToken,
        b2Auth.apiUrl
      );

      const uploadedFiles: { [key: string]: string } = {};
      const fileKeys = Object.keys(files);
      const totalFiles = fileKeys.length;

      for (let i = 0; i < totalFiles; i++) {
        const key = fileKeys[i];
        const file = files[key];
        
        if (file) {
          const fileData = await uploadFileToB2(
            file,
            uploadUrlData.uploadUrl,
            uploadUrlData.authorizationToken
          );
          
          uploadedFiles[key] = getPublicUrl(fileData.fileName);
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
