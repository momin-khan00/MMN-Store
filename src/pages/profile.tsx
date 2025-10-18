import Head from 'next/head';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { signOut } from 'firebase/auth';
import { auth } from '@/config/firebase';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null; // ProtectedRoute will handle redirect

  return (
    <ProtectedRoute allowedRoles={['user', 'developer', 'moderator', 'admin']}>
      <Head>
        <title>My Profile - MMN Store</title>
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-lg mx-auto bg-white dark:bg-dark-800 rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={user.avatarUrl || '/icons/default-avatar.png'}
                alt="Profile Picture"
                width={128}
                height={128}
                className="rounded-full object-cover border-4 border-brand"
              />
            </div>
            <h1 className="text-3xl font-bold mt-4">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            <span className="mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400">
              {user.role.toUpperCase()}
            </span>

            <button 
              onClick={() => signOut(auth)}
              className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors w-full"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
