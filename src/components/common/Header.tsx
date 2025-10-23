import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import ThemeChanger from './ThemeChanger';
import SearchBar from '../search/SearchBar';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-dark-700">
      <nav className="container mx-auto flex justify-between items-center p-4 gap-2 sm:gap-4">
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">
          MMN Store
        </Link>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <SearchBar />
          <ThemeChanger />
          {user ? (
            <Link href="/profile">
              <div className="cursor-pointer block flex-shrink-0">
                <Image
                  src={user.avatarUrl || '/icons/default-avatar.png'}
                  alt="My Profile"
                  width={36}
                  height={36}
                  className="rounded-full object-cover border-2 border-transparent hover:border-brand transition"
                />
              </div>
            </Link>
          ) : (
            // THE FINAL FIX: This is now a Link component pointing to our new login page
            <Link href="/login">
              <button 
                className="px-4 py-2 text-sm font-semibold rounded-full 
                           bg-gradient-to-r from-brand to-accent text-white
                           shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                           transition-all duration-300 ease-in-out flex-shrink-0"
              >
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
