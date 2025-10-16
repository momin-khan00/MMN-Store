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
        {/* Featured Section Placeholder */}
        <section className="mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-4">Featured Apps</h2>
          <div className="h-64 bg-dark-800 rounded-2xl flex items-center justify-center">
            <p className="text-gray-500">Carousel Coming Soon...</p>
          </div>
        </section>

        {/* App Grid Section */}
        <section>
          <h2 className="text-3xl font-extrabold text-white mb-4">Discover Apps</h2>
          {loading && <Loading />}
          {error && <p className="text-red-500">Error loading apps. Please try again later.</p>}
          {!loading && !error && (
            <>
              {apps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apps.map(app => (
                    <AppCard key={app.id} app={app} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-dark-800 rounded-2xl">
                  <p className="text-gray-400">No apps found. Check back later!</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
}
