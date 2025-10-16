import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/config/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export default function Header() {
  const { user } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      // You can add a user-facing error message here
    }
  };

  return (
    <header className="bg-dark-800 text-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold hover:text-brand-light transition-colors">
          MMN Store
        </Link>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm hidden sm:block">Welcome, {user.name.split(' ')[0]}</span>
              <button onClick={() => signOut(auth)} className="bg-red-600 px-3 py-1.5 text-sm font-semibold rounded-md hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleSignIn} className="bg-blue-600 px-3 py-1.5 text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors">
              Login with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
