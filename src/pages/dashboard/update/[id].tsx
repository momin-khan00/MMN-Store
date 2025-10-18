import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import { ParsedUrlQuery } from 'querystring';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

// We'll create a type for the page props where dates are guaranteed to be strings
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

    if (!docSnap.exists()) {
      return { notFound: true };
    }
    
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

    // Security Check: Ensure the logged-in user is the owner of this app
    if (user?.uid !== app.developerId) {
        return <div className="text-center p-10">Access Denied: You are not the developer of this app.</div>;
    }

    // TODO: Build the update form here. For now, it's a placeholder.
    return (
        <ProtectedRoute allowedRoles={['developer', 'admin']}>
            <Head>
                <title>Update {app.name} - MMN Store</title>
            </Head>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-4xl font-extrabold text-white mb-8">Update "{app.name}"</h1>

                <div className="bg-dark-800 p-6 sm:p-8 rounded-2xl shadow-lg">
                    <p className="text-xl text-brand-light mb-4">Update form is coming in the next step!</p>
                    <p>You will be able to update the app name, description, and upload new APK/Icon files here.</p>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default UpdateAppPage;
