import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';
import { UserProfile } from '../types/auth';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userRef = doc(firestore, 'users', fbUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUser({ uid: fbUser.uid, ...docSnap.data() } as UserProfile);
        } else {
          const newUser: Omit<UserProfile, 'uid' | 'joinedAt'> = {
            name: fbUser.displayName || 'Anonymous User',
            email: fbUser.email!,
            avatarUrl: fbUser.photoURL,
            role: 'user',
          };
          await setDoc(userRef, { ...newUser, joinedAt: serverTimestamp() });
          setUser({ uid: fbUser.uid, ...newUser, joinedAt: new Date() } as UserProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = { user, firebaseUser, loading };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

// Custom hook for easy access
export const useAuth = () => {
  return useContext(AuthContext);
};
