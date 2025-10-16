import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppData } from '../../types/app';
import AppCard from './AppCard';
import SearchBar from './SearchBar';

interface AppListProps {
  category?: string;
  featured?: boolean;
  trending?: boolean;
  limit?: number;
}

const AppList: React.FC<AppListProps> = ({ 
  category, 
  featured = false, 
  trending = false, 
  limit: limitCount = 10 
}) => {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        let appsQuery;
        
        if (featured) {
          appsQuery = query(
            collection(db, 'apps'),
            where('status', '==', 'approved'),
            where('featured', '==', true),
            orderBy('downloadCount', 'desc'),
            limit(limitCount)
          );
        } else if (trending) {
          appsQuery = query(
            collection(db, 'apps'),
            where('status', '==', 'approved'),
            orderBy('downloadCount', 'desc'),
            limit(limitCount)
          );
        } else if (category) {
          appsQuery = query(
            collection(db, 'apps'),
            where('status', '==', 'approved'),
            where('category', '==', category),
            orderBy('downloadCount', 'desc'),
            limit(limitCount)
          );
        } else {
          appsQuery = query(
            collection(db, 'apps'),
            where('status', '==', 'approved'),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
          );
        }

        const querySnapshot = await getDocs(appsQuery);
        const appsData: AppData[] = [];
        
        querySnapshot.forEach((doc) => {
          // Fix: Properly type cast the document data
          const data = doc.data() as DocumentData;
          appsData.push({ 
            id: doc.id, 
            ...data 
          } as AppData);
        });
        
        setApps(appsData);
      } catch (error) {
        console.error('Error fetching apps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [category, featured, trending, limitCount]);

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {!category && !featured && !trending && (
        <div className="mb-6">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Search apps..." 
          />
        </div>
      )}
      
      {filteredApps.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No apps found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppList;
