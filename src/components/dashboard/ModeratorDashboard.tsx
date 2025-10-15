import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { AppData } from '../../types/app';
import Link from 'next/link';

const ModeratorDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'flagged'>('pending');

  useEffect(() => {
    if (!currentUser) return;

    const fetchApps = async () => {
      try {
        const appsQuery = query(
          collection(db, 'apps'),
          where('status', '==', activeTab === 'flagged' ? 'approved' : activeTab)
        );
        
        const querySnapshot = await getDocs(appsQuery);
        const appsData: AppData[] = [];
        
        querySnapshot.forEach((doc) => {
          appsData.push({ id: doc.id, ...doc.data() } as AppData);
        });
        
        // If looking for flagged apps, filter further
        if (activeTab === 'flagged') {
          // In a real implementation, you would have a separate field for flagged apps
          // For now, we'll just show all approved apps
        }
        
        setApps(appsData);
      } catch (error) {
        console.error('Error fetching apps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [currentUser, activeTab]);

  const handleFlagApp = async (appId: string) => {
    if (!confirm('Are you sure you want to flag this app for review?')) return;
    
    try {
      // In a real implementation, you would update a 'flagged' field
      await updateDoc(doc(db, 'apps', appId), {
        flagged: true,
        flaggedBy: currentUser?.uid,
        flaggedAt: new Date()
      });
      
      alert('App flagged successfully');
    } catch (error) {
      console.error('Error flagging app:', error);
      alert('Failed to flag app');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Moderator Dashboard</h1>
        <p className="text-gray-600">Review and manage app content</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['pending', 'approved', 'rejected', 'flagged'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Apps List */}
        <div className="p-6">
          {apps.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No apps found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      App
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Developer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {apps.map((app) => (
                    <tr key={app.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={app.iconUrl}
                              alt={app.name}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/icons/default-app-icon.png';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{app.name}</div>
                            <div className="text-sm text-gray-500">{app.version}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.developerName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.downloadCount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/app/${app.id}`}>
                          <a className="text-blue-600 hover:text-blue-900 mr-3">View</a>
                        </Link>
                        {app.status === 'approved' && (
                          <button
                            onClick={() => handleFlagApp(app.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Flag
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModeratorDashboard;
