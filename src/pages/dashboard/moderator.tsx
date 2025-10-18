import Head from 'next/head';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useModerator } from '@/hooks/useModerator';
import Loading from '@/components/common/Loading';
import ModeratorAppRow from '@/components/dashboard/ModeratorAppRow';

export default function ModeratorDashboardPage() {
  const { apps, isLoading, error, toggleFlagStatus, refresh } = useModerator();

  return (
    <ProtectedRoute allowedRoles={['moderator', 'admin']}>
      <Head>
        <title>Moderator Dashboard - MMN Store</title>
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Moderator Dashboard</h1>
          <button onClick={refresh} className="text-sm text-brand hover:underline disabled:text-gray-500" disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh All Apps'}
          </button>
        </div>

        <div className="bg-white dark:bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">All Apps ({apps.length})</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Review all submitted apps. Flag any app that violates the store's policy. Flagged apps will be prioritized for admin review.</p>
          
          {isLoading && <Loading />}
          {error && <p className="text-red-500 text-center py-5">{error}</p>}
          
          {!isLoading && !error && (
            <>
              {apps.length > 0 ? (
                <div className="space-y-3">
                  {apps.map(app => (
                    <ModeratorAppRow key={app.id} app={app} onToggleFlag={toggleFlagStatus} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-5">No apps found in the store yet.</p>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
