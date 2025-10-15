import React from 'react';
import Head from 'next/head';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import ModeratorDashboard from '../../components/dashboard/ModeratorDashboard';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const ModeratorDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['moderator']}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Head>
          <title>Moderator Dashboard - MMN Store</title>
          <meta name="description" content="Review and manage app content" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex-grow">
          <ModeratorDashboard />
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default ModeratorDashboardPage;
