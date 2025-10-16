import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Loading from './Loading';
import type { UserRole } from '@/types/auth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <Loading />;
  }

  // If user is not logged in OR their role is not in the allowed list, redirect to home
  if (!user || !allowedRoles.includes(user.role)) {
    // A useEffect is safer for client-side redirects to avoid errors
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return (
      <div className="text-center p-10">
        <p>Access Denied. Redirecting...</p>
      </div>
    );
  }

  return <>{children}</>;
}
