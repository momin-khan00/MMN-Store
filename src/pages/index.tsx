import { useAuth } from "@/context/AuthContext";
import Head from 'next/head';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <>
      <Head>
        <title>MMN Store - Discover Amazing Apps</title>
      </Head>
      <div className="container mx-auto p-4 md:p-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Welcome to the <span className="text-cyan-400">MMN Store</span>
          </h1>
          {loading ? (
            <p className="text-lg text-gray-400">Loading your profile...</p>
          ) : user ? (
            <p className="text-lg text-gray-300">
              {/* CORRECTED: Added a fallback for user name */}
              You are logged in as <span className="font-bold text-white">{user.name || 'User'}</span>.
            </p>
          ) : (
            <p className="text-lg text-gray-400">
              Please log in to discover and download apps.
            </p>
          )}
        </div>

        {/* Placeholder for app list */}
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Featured Apps</h2>
            <div className="h-64 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">App list coming soon...</p>
            </div>
        </div>
      </div>
    </>
  );
}
