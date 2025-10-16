import Head from 'next/head';
import AppCard from '@/components/app/AppCard';
import type { App } from '@/types/app';

// DUMMY DATA for designing the UI. We will replace this with Firestore data later.
const mockApps: App[] = [
  { id: '1', name: 'Photo Editor Pro', developerName: 'Pixel Perfect Inc.', category: 'Photography', iconUrl: '/icons/default-app-icon.png', rating: 4.5 },
  { id: '2', name: 'Task Manager Deluxe', developerName: 'Productivity Hub', category: 'Productivity', iconUrl: '/icons/default-app-icon.png', rating: 4.8 },
  { id: '3', name: 'Galaxy Warriors', developerName: 'Galaxy Games', category: 'Games', iconUrl: '/icons/default-app-icon.png', rating: 4.2 },
  { id: '4', name: 'Finance Tracker', developerName: 'MoneyWise', category: 'Finance', iconUrl: '/icons/default-app-icon.png', rating: 4.9 },
  { id: '5', name: 'Music Stream+', developerName: 'SoundWave', category: 'Music', iconUrl: '/icons/default-app-icon.png', rating: 4.6 },
  { id: '6', name: 'Super VPN', developerName: 'SecureNet', category: 'Tools', iconUrl: '/icons/default-app-icon.png', rating: 4.7 },
  { id: '7', name: 'Weather Now', developerName: 'Forecast Co.', category: 'Weather', iconUrl: '/icons/default-app-icon.png', rating: 4.4 },
  { id: '8', name: 'Recipe Finder', developerName: 'Kitchen Helper', category: 'Food', iconUrl: '/icons/default-app-icon.png', rating: 4.3 },
];

export default function Home() {
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockApps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
