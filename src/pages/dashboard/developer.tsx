import { useState } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AppUploadForm from '@/components/upload/AppUploadForm';
import { useDeveloperApps } from '@/hooks/useDeveloperApps';
import DeveloperAppRow from '@/components/dashboard/DeveloperAppRow';
import Loading from '@/components/common/Loading';
import { Plus } from 'react-feather';

export default function DeveloperDashboardPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { apps, isLoading, deleteApp, refresh } = useDeveloperApps();

  const handleDelete = (appId: string, appName: string) => {
    if (window.confirm(`Are you sure you want to delete "${appName}"? This action cannot be undone.`)) {
      deleteApp(appId);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['developer', 'admin']}>
      <Head>
        <title>Developer Dashboard - MMN Store</title>
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">Developer Dashboard</h1>
          {!isFormVisible && (
            <button 
              onClick={() => setIsFormVisible(true)}
              className="bg-accent hover:bg-accent-dark text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus size={20} />
              <span>Upload New App</span>
            </button>
          )}
        </div>
        
        {/* The Upload Form is now conditional */}
        {isFormVisible && (
          <div className="bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-brand-light">Upload New App</h2>
              <button onClick={() => setIsFormVisible(false)} className="text-gray-400 hover:text-white">Close</button>
            </div>
            <AppUploadForm />
          </div>
        )}

        {/* The "My Apps" List */}
        <div className="bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Apps ({apps.length})</h2>
              <button onClick={refresh} className="text-sm text-brand-light hover:underline" disabled={isLoading}>
                {isLoading ? '...' : 'Refresh'}
              </button>
            </div>
            {isLoading ? (
              <Loading />
            ) : apps.length > 0 ? (
              <div className="space-y-3">
                {apps.map(app => (
                  <DeveloperAppRow key={app.id} app={app} onDelete={handleDelete} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-5">You haven't uploaded any apps yet.</p>
            )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
