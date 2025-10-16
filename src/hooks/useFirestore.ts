import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';

export function useApprovedApps() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const appsRef = collection(firestore, 'apps');
        const q = query(
          appsRef,
          where('status', '==', 'approved'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const approvedApps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as App));
        
        setApps(approvedApps);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching approved apps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  return { apps, loading, error };
}
