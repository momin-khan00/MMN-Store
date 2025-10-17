import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { doc, getDoc, Timestamp, updateDoc, increment } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import { ParsedUrlQuery } from 'querystring';

// We'll create a new type for the page props where dates are guaranteed to be strings
interface AppForPage extends Omit<App, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string | null;
}

interface AppDetailProps {
  app: AppForPage | null;
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
    
    const serializedApp: AppForPage = {
      id: docSnap.id, ...appData,
      createdAt: (appData.createdAt as Timestamp).toDate().toISOString(),
      updatedAt: appData.updatedAt ? (appData.updatedAt as Timestamp).toDate().toISOString() : null,
    } as AppForPage;

    return { props: { app: JSON.parse(JSON.stringify(serializedApp)) } };
  } catch (error) {
    console.error('Error fetching app details:', error);
    return { props: { app: null } };
  }
};

const AppDetailPage: NextPage<AppDetailProps> = ({ app }) => {
  if (!app) {
    return <div className="text-center p-10">Error loading app details.</div>;
  }
  
  // THE FIX for the Date error
  const lastUpdatedDate = new Date(app.updatedAt || app.createdAt).toLocaleDateString();

  // Function to handle the download count
  const handleDownload = async () => {
    const appRef = doc(firestore, 'apps', app.id);
    await updateDoc(appRef, {
      downloadCount: increment(1)
    });
  };

  return (
    <>
      <Head><title>{app.name} - MMN Store</title></Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section (Your preferred design) */}
        <header className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <div className="flex-shrink-0">
            <Image src={app.iconUrl} alt={`${app.name} icon`} width={128} height={128} className="rounded-3xl object-cover" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-extrabold text-white">{app.name}</h1>
            <p className="text-xl text-brand-light mt-1">{app.developerName}</p>
            <p className="text-md text-gray-400">{app.category}</p>
          </div>
          <div className="sm:ml-auto pt-4 sm:pt-0">
            {/* THE FIX for the download URL */}
            <a 
              href={`/.netlify/functions/download?fileUrl=${encodeURIComponent(app.apkUrl)}`}
              onClick={handleDownload}
              className="bg-accent hover:bg-accent-dark text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-300 w-full sm:w-auto inline-block">
              Download
            </a>
            <p className="text-center text-gray-500 text-sm mt-2">{app.downloadCount.toLocaleString()} downloads</p>
          </div>
        </header>

        {/* Other sections (Your preferred design) */}
        <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
            <div className="h-64 bg-dark-800 rounded-2xl flex items-center justify-center">
                <p className="text-gray-500">Screenshots Coming Soon...</p>
            </div>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Description</h2>
          <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{app.description}</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
          <div className="bg-dark-800 p-4 rounded-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div><strong className="text-gray-400">Version:</strong> {app.version}</div>
              <div><strong className="text-gray-400">Updated On:</strong> {lastUpdatedDate}</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AppDetailPage;
