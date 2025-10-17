import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, firestore } from '@/config/firebase';
import { UserProfile } from '@/types/auth';

// THE FIX: Exposing firebaseUser to get the token
interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null; // <-- ADD THIS LINE
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, firebaseUser: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null); // <-- ADD THIS LINE
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser); // <-- ADD THIS LINE
      if (fbUser) {
        const userRef = doc(firestore, 'users', fbUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUser(docSnap.data() as UserProfile);
        } else {
          const newUserProfile: Omit<UserProfile, 'joinedAt'> = {
            uid: fbUser.uid, name: fbUser.displayName || 'New User', email: fbUser.email!,
            avatarUrl: fbUser.photoURL || undefined, role: 'user',
          };
          await setDoc(userRef, { ...newUserProfile, joinedAt: serverTimestamp() });
          setUser({ ...newUserProfile, joinedAt: new Timestamp(Date.now() / 1000, 0) });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
