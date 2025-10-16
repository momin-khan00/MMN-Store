// src/components/common/Header.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import LoginButton from '../auth/LoginButton';

const Header: React.FC = () => {
  const { currentUser, userRole } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-xl font-bold text-gray-900">MMN Store</span>
              </a>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/">
              <a className="text-gray-700 hover:text-blue-600 font-medium">Home</a>
            </Link>
            <Link href="/apps">
              <a className="text-gray-700 hover:text-blue-600 font-medium">Apps</a>
            </Link>
            <Link href="/games">
              <a className="text-gray-700 hover:text-blue-600 font-medium">Games</a>
            </Link>
            <Link href="/categories">
              <a className="text-gray-700 hover:text-blue-600 font-medium">Categories</a>
            </Link>
          </nav>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search apps and games"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                {userRole === 'developer' && (
                  <Link href="/upload">
                    <a className="hidden md:block text-sm font-medium text-white bg-blue-600 rounded-full px-4 py-2 hover:bg-blue-700">
                      Upload App
                    </a>
                  </Link>
                )}
                {userRole && (
                  <Link href={`/dashboard/${userRole}`}>
                    <a className="hidden md:block text-sm font-medium text-gray-700 hover:text-blue-600">
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
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <LoginButton />
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Home</a>
              </Link>
              <Link href="/apps">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Apps</a>
              </Link>
              <Link href="/games">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Games</a>
              </Link>
              <Link href="/categories">
                <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Categories</a>
              </Link>
              {currentUser && userRole === 'developer' && (
                <Link href="/upload">
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Upload App</a>
                </Link>
              )}
              {currentUser && userRole && (
                <Link href={`/dashboard/${userRole}`}>
                  <a className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Dashboard</a>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
