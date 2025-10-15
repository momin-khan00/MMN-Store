import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import LoginButton from '../auth/LoginButton';

const Header: React.FC = () => {
  const { currentUser, userRole } = useAuth();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold text-primary">MMN Store</a>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className="text-gray-700 hover:text-primary">Home</a>
            </Link>
            <Link href="/apps">
              <a className="text-gray-700 hover:text-primary">Apps</a>
            </Link>
            <Link href="/categories">
              <a className="text-gray-700 hover:text-primary">Categories</a>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {userRole === 'developer' && (
                  <Link href="/upload">
                    <a className="text-sm font-medium text-white bg-primary rounded-md px-3 py-1.5 hover:bg-blue-600">
                      Upload App
                    </a>
                  </Link>
                )}
                {userRole && (
                  <Link href={`/dashboard/${userRole}`}>
                    <a className="text-sm font-medium text-gray-700 hover:text-primary">
                      Dashboard
                    </a>
                  </Link>
                )}
                <div className="relative group">
                  <img
                    src={currentUser.photoURL || '/icons/default-avatar.png'}
                    alt={currentUser.displayName || 'User'}
                    className="h-8 w-8 rounded-full cursor-pointer"
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link href="/profile">
                      <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                    </Link>
                    <button
                      onClick={() => {/* Handle logout */}}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
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
