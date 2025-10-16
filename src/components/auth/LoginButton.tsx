import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import Image from 'next/image';

const LoginButton = () => {
  const { user } = useAuth();

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <Image
          src={user.avatarUrl || '/icons/default-avatar.png'}
          alt={user.name}
          width={32}
          height={32}
          className="rounded-full"
        />
        <button
          onClick={handleSignOut}
          className="bg-red-600 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
    >
      Login with Google
    </button>
  );
};

export default LoginButton;
