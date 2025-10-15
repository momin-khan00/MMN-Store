import React from 'react';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppUploadForm from '../components/upload/AppUploadForm';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const UploadPage: React.FC = () => {
  const { userRole } = useAuth();

  return (
    <ProtectedRoute allowedRoles={['developer']}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Head>
          <title>Upload App - MMN Store</title>
          <meta name="description" content="Upload your app to MMN Store" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Upload Your App</h1>
              <p className="text-gray-600">Share your app with the world</p>
            </div>

            <AppUploadForm />
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default UploadPage;
