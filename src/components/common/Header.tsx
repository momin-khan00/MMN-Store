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
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          MMN Store
        </Link>
        <div>
          {user ? (
            <button onClick={() => signOut(auth)} className="bg-red-600 px-4 py-2 rounded">
              Logout
            </button>
          ) : (
            <button onClick={handleSignIn} className="bg-blue-600 px-4 py-2 rounded">
              Login with Google
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
