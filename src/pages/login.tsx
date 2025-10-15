import React from 'react';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import LoginButton from '../components/auth/LoginButton';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const LoginPage: React.FC = () => {
  const { userRole } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (userRole) {
      window.location.href = `/dashboard/${userRole}`;
    }
  }, [userRole]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Login - MMN Store</title>
        <meta name="description" content="Login to MMN Store" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to access your account</p>
          </div>

          <div className="flex justify-center">
            <LoginButton />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
