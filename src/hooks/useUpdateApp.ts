import { useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { supabase } from '@/config/supabase';
import type { App } from '@/types/app';

// Helper function to get the file path from a Supabase URL
const getPathFromUrl = (url: string): string | null => {
  try {
    const urlObject = new URL(url);
    const pathParts = urlObject.pathname.split('/');
    return pathParts.slice(4).join('/'); // e.g., /storage/v1/object/public/apps/apks/userid/file.apk -> apks/userid/file.apk
  } catch (error) {
    console.error("Could not parse URL for deletion:", url, error);
    return null;
  }
};

export function useUpdateApp() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const updateApp = async (
    originalApp: App,
    newData: { name: string; description: string; version: string; category: string },
    newFiles: { apk: File | null; icon: File | null }
  ) => {
    setIsUpdating(true);
    setStatusMessage('Starting update process...');
    
    try {
      let apkUrl = originalApp.apkUrl;
      let iconUrl = originalApp.iconUrl;
      const filesToDelete: string[] = [];

      // --- Prepare secure upload URLs if new files are provided ---
      setStatusMessage('Preparing secure storage...');
      const response = await fetch('/.netlify/functions/createSignedUrls', {
          method: 'POST',
          body: JSON.stringify({
              uid: originalApp.developerId,
              apkFileName: newFiles.apk?.name || 'no-apk',
              iconFileName: newFiles.icon?.name || 'no-icon',
          }),
      });
      if (!response.ok) throw new Error('Could not prepare secure storage.');
      const signedUrlData = await response.json();

      // --- Handle APK Update ---
      if (newFiles.apk) {
        setStatusMessage('Uploading new APK...');
        await fetch(signedUrlData.apkSignedUrl, { method: 'PUT', body: newFiles.apk });
        apkUrl = signedUrlData.apkUrl; // Get the new public URL
        const oldApkPath = getPathFromUrl(originalApp.apkUrl);
        if (oldApkPath) filesToDelete.push(oldApkPath);
      }

      // --- Handle Icon Update ---
      if (newFiles.icon) {
        setStatusMessage('Uploading new Icon...');
        await fetch(signedUrlData.iconSignedUrl, { method: 'PUT', body: newFiles.icon });
        iconUrl = signedUrlData.iconUrl; // Get the new public URL
        const oldIconPath = getPathFromUrl(originalApp.iconUrl);
        if (oldIconPath) filesToDelete.push(oldIconPath);
      }
      
      // --- Update Firestore Document ---
      setStatusMessage('Saving updated details...');
      const appRef = doc(firestore, 'apps', originalApp.id);
      await updateDoc(appRef, {
        ...newData,
        apkUrl,
        iconUrl,
        status: 'pending', // IMPORTANT: Set status to pending for re-approval
        updatedAt: serverTimestamp(),
      });

      // --- Delete old files from Supabase Storage ---
      if (filesToDelete.length > 0) {
        setStatusMessage('Cleaning up old files...');
        await supabase.storage.from('apps').remove(filesToDelete);
      }
      
      setStatusMessage('✅ App updated successfully! It is now pending re-approval.');
      return true;

    } catch (error: any) {
      console.error("Update Error:", error);
      setStatusMessage(`❌ FAILED: ${error.message}`);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return { isUpdating, statusMessage, updateApp };
}
