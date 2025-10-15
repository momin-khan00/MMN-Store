import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import { AppData } from '../../types/app';
import Link from 'next/link';

const DeveloperDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    if (!currentUser) return;

    const fetchApps = async () => {
      try {
        const appsQuery = query(
          collection(db, 'apps'),
          where('developerId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(appsQuery);
        const appsData: AppData[] = [];
        
        querySnapshot.forEach((doc) => {
          appsData.push({ id: doc.id, ...doc.data() } as AppData);
        });
        
        setApps(appsData);
      } catch (error) {
        console.error('Error fetching apps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [currentUser]);

  const handleDeleteApp = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;
    
    try {
      await deleteDoc(doc(db, 'apps', appId));
      setApps(apps.filter(app => app.id !== appId));
      alert('App deleted successfully');
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('Failed to delete app');
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

  const filteredApps = apps.filter(app => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  const totalDownloads = apps.reduce((sum, app) => sum + app.downloadCount, 0);

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Developer Dashboard</h1>
        <p className="text-gray-600">Manage your apps and track performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Apps</h3>
          <p className="text-3xl font-bold text-blue-600">{apps.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Downloads</h3>
          <p className="text-3xl font-bold text-green-600">{totalDownloads.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {apps.filter(app => app.status === 'pending').length}
          </p>
        </div>
      </div>

      {/* Upload New App Button */}
      <div className="mb-6">
        <Link href="/upload">
          <a className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            Upload New App
          </a>
        </Link>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-6 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)} ({apps.filter(app => tab === 'all' || app.status === tab).length})
              </button>
            ))}
          </nav>
        </div>

        {/* Apps List */}
        <div className="p-6">
          {filteredApps.length === 0 ? (
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
                  {filteredApps.map((app) => (
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
                        <button
                          onClick={() => handleDeleteApp(app.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
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

export default DeveloperDashboard;
