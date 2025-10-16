// src/pages/index.tsx
import React from 'react';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import FeaturedCarousel from '../components/app/FeaturedCarousel';
import AppList from '../components/app/AppList';
import CategoryGrid from '../components/app/CategoryGrid';
import AdBanner from '../components/common/AdBanner';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HomePage: React.FC = () => {
  const { userRole } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>MMN Store - Modern Multi-Role App Store</title>
        <meta name="description" content="Discover and download amazing apps" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Welcome to MMN Store
              </h1>
              <p className="text-xl max-w-2xl mx-auto mb-8">
                Discover, download, and share amazing apps. Join our community of developers and users.
              </p>
              
              {userRole === 'developer' && (
                <div>
                  <a 
                    href="/upload" 
                    className="inline-block bg-white text-blue-600 font-medium py-3 px-6 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    Upload Your App
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Search Bar for Mobile */}
        <div className="md:hidden px-4 py-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search apps and games"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Featured Apps Carousel */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Apps</h2>
            <a href="/apps?featured=true" className="text-blue-600 hover:text-blue-800 font-medium">
              See all
            </a>
          </div>
          <FeaturedCarousel />
        </section>

        {/* Ad Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdBanner type="banner" />
        </div>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
            <a href="/categories" className="text-blue-600 hover:text-blue-800 font-medium">
              See all
            </a>
          </div>
          <CategoryGrid />
        </section>

        {/* Trending Apps */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Trending Apps</h2>
            <a href="/apps?trending=true" className="text-blue-600 hover:text-blue-800 font-medium">
              See all
            </a>
          </div>
          <AppList trending={true} limit={8} />
        </section>

        {/* Recommended for You */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recommended for You</h2>
            <a href="/apps?recommended=true" className="text-blue-600 hover:text-blue-800 font-medium">
              See all
            </a>
          </div>
          <AppList limit={8} />
        </section>

        {/* Ad Banner */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <AdBanner type="native" />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
