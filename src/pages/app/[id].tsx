import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import { ParsedUrlQuery } from 'querystring';

interface AppDetailProps {
  app: App | null;
}

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getServerSideProps: GetServerSideProps<AppDetailProps, Params> = async (context) => {
  try {
    const { id } = context.params!;
    const appRef = doc(firestore, 'apps', id);
    const docSnap = await getDoc(appRef);

    if (!docSnap.exists() || docSnap.data().status !== 'approved') {
      return { notFound: true };
    }
    
    const appData = docSnap.data();
    
    const serializedApp = {
      id: docSnap.id, ...appData,
      createdAt: (appData.createdAt as Timestamp).toDate().toISOString(),
      updatedAt: appData.updatedAt ? (appData.updatedAt as Timestamp).toDate().toISOString() : null,
    };

    return { props: { app: JSON.parse(JSON.stringify(serializedApp)) } };
  } catch (error) {
    console.error('Error fetching app details:', error);
    return { props: { app: null } };
  }
};

const AppDetailPage: NextPage<AppDetailProps> = ({ app }) => {
  if (!app) {
    return <div className="text-center p-10">Error loading app details or app not found.</div>;
  }

  // Sanitize the app name for the filename
  const sanitizedAppName = app.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  return (
    <>
      <Head><title>{app.name} - MMN Store</title></Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <div className="flex-shrink-0">
            <Image src={app.iconUrl} alt={`${app.name} icon`} width={128} height={128} className="rounded-3xl object-cover shadow-lg" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-white">{app.name}</h1>
            <p className="text-xl text-brand-light mt-1">{app.developerName}</p>
            <p className="text-md text-gray-400">{app.category}</p>
          </div>
          <div className="sm:ml-auto pt-4 sm:pt-0 w-full sm:w-auto">
            {/* THE FIX: Added the 'download' attribute */}
            <a href={app.apkUrl} target="_blank" rel="noopener noreferrer" download={`${sanitizedAppName}_v${app.version}.apk`}
               className="bg-accent hover:bg-accent-dark text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300 w-full sm:w-auto inline-block text-center">
              Download
            </a>
            <p className="text-center text-gray-500 text-sm mt-2">{app.downloadCount.toLocaleString()} downloads</p>
          </div>
        </header>
        
        {/* Other sections... */}
        <section className="mb-8 bg-dark-800 p-6 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{app.description}</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
          <div className="bg-dark-800 p-6 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><strong className="text-gray-400 block mb-1">Version</strong><span className="text-lg">{app.version}</span></div>
            <div><strong className="text-gray-400 block mb-1">Last Updated</strong><span className="text-lg">{new Date(app.updatedAt || app.createdAt).toLocaleDateString()}</span></div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AppDetailPage;
