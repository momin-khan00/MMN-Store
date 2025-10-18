import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import { ParsedUrlQuery } from 'querystring';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import AppUpdateForm from '@/components/update/AppUpdateForm'; // Import the new form
import Link from 'next/link';

// Use the existing type for page props where dates are strings
interface AppForPage extends Omit<App, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string | null;
}

interface UpdatePageProps {
  app: AppForPage | null;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<UpdatePageProps, Params> = async (context) => {
  try {
    const { id } = context.params!;
    const appRef = doc(firestore, 'apps', id);
    const docSnap = await getDoc(appRef);

    if (!docSnap.exists()) return { notFound: true };
    
    const appData = docSnap.data();
    const serializedApp: AppForPage = {
      id: docSnap.id, ...appData,
      createdAt: (appData.createdAt as Timestamp).toDate().toISOString(),
      updatedAt: appData.updatedAt ? (appData.updatedAt as Timestamp).toDate().toISOString() : null,
    } as AppForPage;

    return { props: { app: JSON.parse(JSON.stringify(serializedApp)) } };
  } catch (error) {
    console.error('Error fetching app details for update:', error);
    return { props: { app: null } };
  }
};

const UpdateAppPage: NextPage<UpdatePageProps> = ({ app }) => {
    const { user } = useAuth();

    if (!app) {
        return <div className="text-center p-10">App not found.</div>;
    }

    // Security Check: Ensure the logged-in user is the owner of this app (or an admin)
    if (user && user.uid !== app.developerId && user.role !== 'admin') {
        return <div className="text-center p-10">Access Denied: You do not have permission to edit this app.</div>;
    }

    return (
        <ProtectedRoute allowedRoles={['developer', 'admin']}>
            <Head>
                <title>Update {app.name} - MMN Store</title>
            </Head>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link href="/dashboard/developer" className="text-brand-light hover:underline mb-8 inline-block">
                    &larr; Back to Dashboard
                </Link>
                <h1 className="text-4xl font-extrabold text-white mb-8">Update "{app.name}"</h1>

                <div className="bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <AppUpdateForm app={app as App} />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default UpdateAppPage;
