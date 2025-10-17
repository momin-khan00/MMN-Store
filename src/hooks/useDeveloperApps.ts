import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import type { App } from '@/types/app';

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
    fetchApps();
  }, [fetchApps]);

  const deleteApp = async (appId: string) => {
    try {
      await deleteDoc(doc(firestore, 'apps', appId));
      // Update UI by removing the deleted app
      setApps(prevApps => prevApps.filter(app => app.id !== appId));
      return true;
    } catch (error) {
      console.error("Error deleting app:", error);
      return false;
    }
  };

  return { apps, isLoading, deleteApp, refresh: fetchApps };
}
