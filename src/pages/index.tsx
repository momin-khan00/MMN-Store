import Head from 'next/head';
import AppCard from '@/components/app/AppCard';
import { useApprovedApps } from '@/hooks/useFirestore';
import Loading from '@/components/common/Loading';

export default function Home() {
  const { apps, loading, error } = useApprovedApps();

  return (
    <>
      <Head>
        <title>MMN Store - Discover Amazing Apps</title>
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Featured Apps</h2>
          <div className="h-64 bg-gray-200 dark:bg-dark-800 rounded-2xl flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Carousel Coming Soon...</p>
          </div>
        </section>

        {/* App Grid Section */}
        <section>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Discover Apps</h2>
          {loading && <Loading />}
          {error && <p className="text-center text-red-500 bg-red-100 dark:bg-dark-800 p-8 rounded-2xl">Error loading apps. Please try again later.</p>}
          {!loading && !error && (
            <>
              {apps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apps.map(app => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-200 dark:bg-dark-800 rounded-2xl">
                  <p className="text-gray-500 dark:text-gray-400">No apps found. Check back later!</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
