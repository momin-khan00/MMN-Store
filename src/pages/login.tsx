import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { Sun } from 'react-feather'; // Just for a cool icon

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login page sign-in error:", error);
    }
  };

  // If user is already logged in, redirect them to the homepage
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  return (
    <>
      <Head>
        <title>Login - MMN Store</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <div className="mb-8 p-6 bg-brand-light/20 rounded-full">
            <Sun size={48} className="text-brand" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
          Welcome to MMN Store
        </h1>
        <p className="max-w-md mt-4 text-lg text-gray-600 dark:text-gray-400">
          Sign in to discover, download, and share your favorite apps.
        </p>

        <div className="mt-12">
          <button 
            onClick={handleSignIn}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white
                       bg-gradient-to-r from-brand to-accent rounded-full
                       overflow-hidden transition-all duration-300 ease-in-out
                       hover:scale-105"
          >
            {/* Animated Background */}
            <span className="absolute h-0 w-0 rounded-full bg-white opacity-10 transition-all duration-500 ease-out 
                             group-hover:h-56 group-hover:w-56">
            </span>
            <span className="relative">
              Sign in with Google
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
