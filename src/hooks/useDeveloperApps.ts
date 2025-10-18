import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/context/AuthContext';
import type { App } from '@/types/app';

// Helper function to get the file path from a full Supabase URL
const getPathFromUrl = (url: string): string | null => {
  try {
    const urlObject = new URL(url);
    // The path is everything after the bucket name in the URL's pathname
    // e.g., /storage/v1/object/public/apps/apks/userid/file.apk -> apks/userid/file.apk
    const pathParts = urlObject.pathname.split('/');
    // The actual path starts after the bucket name, which is the 4th part of the split array
    return pathParts.slice(4).join('/');
  } catch (error) {
    console.error("Could not parse URL:", url, error);
    return null;
  }
};

export function useDeveloperApps() {
  const { user } = useAuth();
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const appsRef = collection(firestore, 'apps');
      const q = query(
        appsRef,
        where('developerId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const developerApps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
      setApps(developerApps);
    } catch (error) {
      console.error("Error fetching developer apps:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchApps();
  }, [user, fetchApps]);

  const deleteApp = async (app: App): Promise<boolean> => {
    try {
      // 1. Collect all file paths to delete from Supabase
      const filesToDelete: string[] = [];
      const apkPath = getPathFromUrl(app.apkUrl);
      const iconPath = getPathFromUrl(app.iconUrl);
      
      if (apkPath) filesToDelete.push(apkPath);
      if (iconPath) filesToDelete.push(iconPath);
      // TODO: Add screenshots to this array when implemented

      // 2. Delete files from Supabase Storage if any exist
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage.from('apps').remove(filesToDelete);
        if (storageError) {
          // Even if storage fails, proceed to delete from Firestore but log the error
          console.error(`Supabase Error: Could not delete files for ${app.name}.`, storageError.message);
        }
      }

      // 3. Delete the document from Firestore
      await deleteDoc(doc(firestore, 'apps', app.id));
      
      // 4. Update UI by removing the deleted app from state
      setApps(prevApps => prevApps.filter(a => a.id !== app.id));
      return true;
    } catch (error) {
      console.error("Error deleting app:", error);
      return false;
    }
  };

  return { apps, isLoading, deleteApp, refresh: fetchApps };
}
