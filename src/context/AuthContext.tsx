import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { auth, firestore } from '@/config/firebase';
import { UserProfile } from '@/types/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userRef = doc(firestore, 'users', fbUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUser(docSnap.data() as UserProfile);
        } else {
          // CORRECTED PART: Create a complete user profile object for the client
          const newUserProfile: UserProfile = {
            uid: fbUser.uid,
            name: fbUser.displayName || 'New User',
            email: fbUser.email!,
            avatarUrl: fbUser.photoURL || undefined,
            role: 'user',
            joinedAt: Timestamp.now(), // Use a client-side timestamp as a placeholder
          };
          // Send to Firebase with a server timestamp
          await setDoc(userRef, {
            ...newUserProfile,
            joinedAt: serverTimestamp(),
          });
          setUser(newUserProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
