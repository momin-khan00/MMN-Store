import React from 'react';
import Head from 'next/head';
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/common/ProtectedRoute';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';

const AdminDashboardPage: React.FC = () => {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Head>
          <title>Admin Dashboard - MMN Store</title>
          <meta name="description" content="Manage apps, users, and system settings" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <main className="flex-grow">
          <AdminDashboard />
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;
