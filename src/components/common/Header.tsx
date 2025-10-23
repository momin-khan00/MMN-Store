import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/config/firebase';
import ThemeChanger from './ThemeChanger';
import SearchBar from '../search/SearchBar';

export default function Header() {
  const { user } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <header className="bg-white/80 dark:bg-dark-800/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 dark:border-dark-700">
      <nav className="container mx-auto flex justify-between items-center p-4 gap-4">
        {/* Left: Store Name */}
        <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-brand transition-colors">
          MMN Store
        </Link>
        
        {/* Right: Icons and Search */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <SearchBar />
          <ThemeChanger />
          {user ? (
            <Link href="/profile">
              <div className="cursor-pointer block">
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
            <button onClick={handleSignIn} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-semibold rounded-md transition-colors hidden sm:block">
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
