import { useState } from 'react';
import Head from 'next/head';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import AppUploadForm from '@/components/upload/AppUploadForm';
import { useDeveloperApps } from '@/hooks/useDeveloperApps';
import DeveloperAppRow from '@/components/dashboard/DeveloperAppRow';
import Loading from '@/components/common/Loading';
import { Plus, X } from 'react-feather';
import type { App } from '@/types/app';
import ConfirmModal from '@/components/common/ConfirmModal'; // Import the new modal

export default function DeveloperDashboardPage() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { apps, isLoading, deleteApp, refresh } = useDeveloperApps();

  // State for the confirmation modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<App | null>(null);

  const handleDeleteClick = (app: App) => {
    setAppToDelete(app);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (appToDelete) {
      await deleteApp(appToDelete);
      setAppToDelete(null);
      setIsModalOpen(false);
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
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Developer Dashboard</h1>
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
          <div className="bg-white dark:bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg mb-12 relative">
            <button onClick={() => setIsFormVisible(false)} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-brand">Upload New App</h2>
            <AppUploadForm onUploadSuccess={onUploadSuccess} />
          </div>
        )}

        <div className="bg-white dark:bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Apps ({apps.length})</h2>
              <button onClick={refresh} className="text-sm text-brand hover:underline" disabled={isLoading}>
                {isLoading ? '...' : 'Refresh'}
              </button>
            </div>
            {isLoading ? (
              <Loading />
            ) : apps.length > 0 ? (
              <div className="space-y-3">
                {apps.map(app => (
                  <DeveloperAppRow key={app.id} app={app} onDelete={handleDeleteClick} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-5">You haven't uploaded any apps yet. Click 'Upload New App' to get started.</p>
            )}
        </div>
      </div>

      {/* The Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${appToDelete?.name}"? This will permanently remove the app and all its files from storage.`}
      />
    </ProtectedRoute>
  );
}
