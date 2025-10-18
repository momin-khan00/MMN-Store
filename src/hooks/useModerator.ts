import { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';

export function useModerator() {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllApps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const appsRef = collection(firestore, 'apps');
      // Order by flagged status first, then by date
      const q = query(appsRef, orderBy('isFlagged', 'desc'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const allApps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
      setApps(allApps);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching all apps for moderation:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllApps();
  }, [fetchAllApps]);

  // Function to toggle the 'isFlagged' status of an app
  const toggleFlagStatus = async (app: App) => {
    try {
      const appRef = doc(firestore, 'apps', app.id);
      const newFlagStatus = !app.isFlagged; // Toggle the current status
      await updateDoc(appRef, {
        isFlagged: newFlagStatus,
      });
      // Update the UI instantly
      setApps(prevApps =>
        prevApps.map(currentApp =>
          currentApp.id === app.id ? { ...currentApp, isFlagged: newFlagStatus } : currentApp
        )
      );
      return true;
    } catch (err: any) {
      console.error("Error toggling flag status:", err);
      setError(`Failed to update flag for app ${app.id}.`);
      return false;
    }
  };

  return { apps, isLoading, error, toggleFlagStatus, refresh: fetchAllApps };
}
