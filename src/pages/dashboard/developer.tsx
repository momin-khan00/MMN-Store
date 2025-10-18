import { useState } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AppUploadForm from '@/components/upload/AppUploadForm';
import { useDeveloperApps } from '@/hooks/useDeveloperApps';
import DeveloperAppRow from '@/components/dashboard/DeveloperAppRow';
import Loading from '@/components/common/Loading';
import { Plus, X } from 'react-feather';
import type { App } from '@/types/app';

export default function DeveloperDashboardPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { apps, isLoading, deleteApp, refresh } = useDeveloperApps();

  // THE FIX: The function now receives the full 'app' object
  const handleDelete = async (app: App) => {
    if (window.confirm(`Are you sure you want to delete "${app.name}"? This will permanently remove the app and its files.`)) {
      // THE FIX: We pass the full 'app' object to the hook
      await deleteApp(app);
    }
  };

  const onUploadSuccess = () => {
    setIsFormVisible(false);
    refresh();
  }

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
        
        {isFormVisible && (
          <div className="bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg mb-12 relative">
            <button onClick={() => setIsFormVisible(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-brand-light">Upload New App</h2>
            <AppUploadForm onUploadSuccess={onUploadSuccess} />
          </div>
        )}

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
              <p className="text-gray-400 text-center py-5">You haven't uploaded any apps yet. Click 'Upload New App' to get started.</p>
            )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
