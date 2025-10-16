import Head from 'next/head';
import ProtectedRoute from '@/components/common/ProtectedRoute';


export default function DeveloperDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['developer', 'admin']}>
      <Head>
        <title>Developer Dashboard - MMN Store</title>
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-white">Developer Dashboard</h1>
        </div>
        
        {/* We will divide the dashboard into sections */}
        <div className="bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-brand-light">Upload New App</h2>
            <AppUploadForm />
        </div>

        <div className="mt-12 bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">My Apps</h2>
            <p className="text-gray-400">Your submitted apps will appear here.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
