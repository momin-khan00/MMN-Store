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
        // User is logged in, check Firestore
        const userRef = doc(firestore, 'users', fbUser.uid);
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          // User document already exists, just set the state
          setUser(docSnap.data() as UserProfile);
        } else {
          // New user, create the document in Firestore
          const newUserProfile: Omit<UserProfile, 'joinedAt'> = {
            uid: fbUser.uid,
            name: fbUser.displayName || 'New User',
            email: fbUser.email!,
            avatarUrl: fbUser.photoURL || undefined,
            role: 'user', // Default role
          };
          
          try {
            await setDoc(userRef, {
              ...newUserProfile,
              joinedAt: serverTimestamp(), // Let server set the timestamp
            });
            // Set user state with a client-side placeholder for the date
            setUser({ ...newUserProfile, joinedAt: new Timestamp(Date.now() / 1000, 0) });
          } catch (error) {
            console.error("Error creating user document:", error);
          }
        }
      } else {
        // User is logged out
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
