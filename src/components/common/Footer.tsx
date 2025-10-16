import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-800/50 border-t border-dark-700 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400">
        <div className="mb-4">
          {(user?.role === 'developer' || user?.role === 'admin') && (
            <Link href="/dashboard/developer" className="text-brand-light hover:underline mx-3">
              Developer Dashboard
            </Link>
          )}
          {/* We can add more links here later, like About Us, Contact, etc. */}
        </div>
        <p>&copy; {currentYear} MMN Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
