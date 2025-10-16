import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import LoginButton from '../auth/LoginButton';
import SearchBar from '../app/SearchBar'; // We will create this later

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="bg-gray-800/80 backdrop-blur-md sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <a className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                MMN Store
              </a>
            </Link>
            {/* Navigation links can go here */}
          </div>

          <div className="flex-1 px-8">
            {/* <SearchBar /> */}
            <p className="text-center text-gray-400">Search coming soon...</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'developer' && (
                  <Link href="/dashboard/developer">
                    <a className="text-sm font-medium hover:text-cyan-400">Dashboard</a>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link href="/dashboard/admin">
                    <a className="text-sm font-medium hover:text-cyan-400">Admin Panel</a>
                  </Link>
                )}
                 <LoginButton />
              </>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
