import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';

export function useAdmin() {
  const [pendingApps, setPendingApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingApps = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const appsRef = collection(firestore, 'apps');
      const q = query(appsRef, where('status', '==', 'pending'), orderBy('createdAt', 'asc'));
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
      setPendingApps(apps);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching pending apps:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingApps();
  }, [fetchPendingApps]);

  const updateAppStatus = async (appId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const appRef = doc(firestore, 'apps', appId);
      await updateDoc(appRef, {
        status: newStatus,
        updatedAt: serverTimestamp(), // Use server timestamp for accuracy
      });
      setPendingApps(prevApps => prevApps.filter(app => app.id !== appId));
      return true;
    } catch (err: any) {
      console.error("Error updating app status:", err);
      setError(`Failed to update status for app ${appId}.`);
      return false;
    }
  };

  return { pendingApps, isLoading, error, updateAppStatus, refresh: fetchPendingApps };
}
