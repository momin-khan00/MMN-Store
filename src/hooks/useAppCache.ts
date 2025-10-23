import { useState, useEffect, createContext, useContext, ReactNode }'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';

// THE FIX: The type definition was missing.
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
        const q = query(appsRef, where('status', '==', 'approved'), orderBy('createdAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        // We must serialize the Timestamps when caching
        const approvedApps = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
                updatedAt: data.updatedAt ? (data.updatedAt as Timestamp).toDate().toISOString() : null,
            }
        }) as App[];
        
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
