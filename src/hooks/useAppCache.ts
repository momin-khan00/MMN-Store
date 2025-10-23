import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';

interface AppCacheContextType {
  apps: App[];
  isLoading: boolean;
}

const AppCacheContext = createContext<AppCacheContextType>({ apps: [], isLoading: true });

export const AppCacheProvider = ({ children }: { children: ReactNode }) => {
  const [apps, setApps] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndCacheApps = async () => {
      try {
        const appsRef = collection(firestore, 'apps');
        // We already have an index for this from our homepage
        const q = query(appsRef, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        const approvedApps = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as App));
        
        setApps(approvedApps);
      } catch (err) {
        console.error("Error caching approved apps:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCacheApps();
  }, []);

  return (
    <AppCacheContext.Provider value={{ apps, isLoading }}>
      {children}
    </AppCacheContext.Provider>
  );
};

export const useAppCache = () => useContext(AppCacheContext);
