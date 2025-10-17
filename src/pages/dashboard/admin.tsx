import Head from 'next/head';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAdmin } from '@/hooks/useAdmin';
import Loading from '@/components/common/Loading';
import PendingAppRow from '@/components/dashboard/PendingAppRow';

export default function AdminDashboardPage() {
  const { pendingApps, isLoading, error, updateAppStatus, refresh } = useAdmin();

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Head>
        <title>Admin Dashboard - MMN Store</title>
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">Admin Dashboard</h1>
          <button onClick={refresh} className="text-sm text-brand-light hover:underline disabled:text-gray-500" disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>

        <div className="bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-accent-light">Pending Approvals ({pendingApps.length})</h2>
          
          {isLoading && <Loading />}

          {error && <p className="text-red-500 text-center py-5">{error}</p>}
          
          {!isLoading && !error && (
            <>
              {pendingApps.length > 0 ? (
                <div className="space-y-4">
                  {pendingApps.map(app => (
                    <PendingAppRow key={app.id} app={app} onUpdateStatus={updateAppStatus} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-5">No apps are currently pending review. Great job!</p>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
