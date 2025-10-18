import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/context/AuthContext';
import type { App } from '@/types/app';

// Helper function to get the file path from a Supabase URL
const getPathFromUrl = (url: string) => {
  try {
    const urlObject = new URL(url);
    // Path is everything after the bucket name in the pathname
    const pathParts = urlObject.pathname.split('/');
    return pathParts.slice(2).join('/'); // e.g., /apps/apks/userid/file.apk -> apks/userid/file.apk
  } catch (error) {
    console.error("Invalid URL for storage object:", url);
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

  const deleteApp = async (app: App) => {
    try {
      const filesToDelete: string[] = [];
      const apkPath = getPathFromUrl(app.apkUrl);
      const iconPath = getPathFromUrl(app.iconUrl);
      if (apkPath) filesToDelete.push(apkPath);
      if (iconPath) filesToDelete.push(iconPath);
      
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage.from('apps').remove(filesToDelete);
        if (storageError) throw new Error(`Supabase Error: ${storageError.message}`);
      }

      await deleteDoc(doc(firestore, 'apps', app.id));
      setApps(prevApps => prevApps.filter(a => a.id !== app.id));
      return true;
    } catch (error) {
      console.error("Error deleting app:", error);
      return false;
    }
  };

  return { apps, isLoading, deleteApp, refresh: fetchApps };
}
