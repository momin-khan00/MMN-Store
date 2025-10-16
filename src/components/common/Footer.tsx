import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800/50 border-t border-dark-700 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400">
        <div className="mb-4 space-x-6">
          {/* Link for Developers */}
          {(user?.role === 'developer' || user?.role === 'admin') && (
            <Link href="/dashboard/developer" className="text-brand-light hover:underline">
              Developer Dashboard
            </Link>
          )}

          {/* Link for Admins ONLY */}
          {user?.role === 'admin' && (
            <Link href="/dashboard/admin" className="text-accent-light hover:underline">
              Admin Dashboard
            </Link>
          )}
        </div>
        <p>&copy; {currentYear} MMN Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
