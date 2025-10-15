import React from 'react';
import Head from 'next/head';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import DeveloperDashboard from '../../components/dashboard/DeveloperDashboard';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const DeveloperDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['developer']}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Head>
          <title>Developer Dashboard - MMN Store</title>
          <meta name="description" content="Manage your apps and track performance" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex-grow">
          <DeveloperDashboard />
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default DeveloperDashboardPage;
