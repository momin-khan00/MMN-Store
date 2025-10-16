import React from 'react';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import AppList from '../components/app/AppList';
import FeaturedCarousel from '../components/app/FeaturedCarousel';
import AdBanner from '../components/common/AdBanner';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const HomePage: React.FC = () => {
  const { userRole } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>MMN Store - Modern Multi-Role App Store</title>
        <meta name="description" content="Discover and download amazing apps" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to MMN Store
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover, download, and share amazing apps. Join our community of developers and users.
          </p>
          
          {userRole === 'developer' && (
            <div className="mt-6">
              <a 
                href="/upload" 
                className="inline-block bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Upload Your App
              </a>
            </div>
          )}
        </section>

        {/* Featured Apps Carousel */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Apps</h2>
            <a href="/apps?featured=true" className="text-blue-600 hover:underline">
              View All
            </a>
          </div>
          <FeaturedCarousel />
        </section>

        {/* Ad Banner */}
        <div className="my-8">
          <AdBanner type="banner" />
        </div>

        {/* Trending Apps */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Trending Apps</h2>
            <a href="/apps?trending=true" className="text-blue-600 hover:underline">
              View All
            </a>
          </div>
          <AppList trending={true} limit={8} />
        </section>

        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['Games', 'Productivity', 'Social', 'Entertainment', 'Education'].map((category) => (
              <a 
                key={category}
                href={`/apps?category=${category.toLowerCase()}`}
                className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl mb-2">
                  {category === 'Games' && '🎮'}
                  {category === 'Productivity' && '💼'}
                  {category === 'Social' && '👥'}
                  {category === 'Entertainment' && '🎬'}
                  {category === 'Education' && '📚'}
                </div>
                <h3 className="font-medium text-gray-800">{category}</h3>
              </a>
            ))}
          </div>
        </section>

        {/* Recent Apps */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recently Added</h2>
            <a href="/apps" className="text-blue-600 hover:underline">
              View All
            </a>
          </div>
          <AppList limit={8} />
        </section>

        {/* Ad Banner */}
        <div className="my-8">
          <AdBanner type="native" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
