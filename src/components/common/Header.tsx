import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/config/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export default function Header() {
  const { user } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto flex justify-between items-center p-4">
        {/* CORRECTED: Modern Next.js Link component usage */}
        <Link href="/" className="text-xl font-bold hover:text-cyan-400 transition-colors">
          MMN Store
        </Link>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Welcome, {user.name.split(' ')[0]}</span>
              <button onClick={() => signOut(auth)} className="bg-red-600 px-4 py-2 text-sm font-semibold rounded-md hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={handleSignIn} className="bg-blue-600 px-4 py-2 text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors">
              Login with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
