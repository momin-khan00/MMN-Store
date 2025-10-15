import { backblazeConfig } from '../config/backblaze';

// Get Backblaze B2 authorization token
export const getB2AuthToken = async () => {
  try {
    const credentials = btoa(`${backblazeConfig.applicationKeyId}:${backblazeConfig.applicationKey}`);
    const response = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to authenticate with Backblaze B2');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting B2 auth token:', error);
    throw error;
  }
};

// Get upload URL
export const getUploadUrl = async (bucketId: string, authToken: string, apiUrl: string) => {
  try {
    const response = await fetch(`${apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: 'POST',
      headers: {
        'Authorization': authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bucketId: bucketId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to get upload URL');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting upload URL:', error);
    throw error;
  }
};

// Upload file to Backblaze B2
export const uploadFileToB2 = async (
  file: File,
  uploadUrl: string,
  uploadAuthToken: string
) => {
  try {
    const sha1Hash = await calculateSHA1(file);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': uploadAuthToken,
        'X-Bz-File-Name': encodeURIComponent(file.name),
        'Content-Type': 'application/octet-stream',
        'Content-Length': file.size.toString(),
        'X-Bz-Content-Sha1': sha1Hash,
      },
      body: file,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload file');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Calculate SHA1 hash of a file
const calculateSHA1 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Get public URL for a file
export const getPublicUrl = (fileName: string): string => {
  return `${backblazeConfig.bucketUrl}/${encodeURIComponent(fileName)}`;
};
