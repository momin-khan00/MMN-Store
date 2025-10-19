import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import AppCard from '@/components/app/AppCard';
import { ParsedUrlQuery } from 'querystring';

interface CategoryPageProps {
  apps: App[];
  categoryName: string;
}

interface Params extends ParsedUrlQuery {
  name: string;
}

export const getServerSideProps: GetServerSideProps<CategoryPageProps, Params> = async (context) => {
  try {
    const { name } = context.params!;
    const categoryName = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize first letter

    const appsRef = collection(firestore, 'apps');
    const q = query(
      appsRef,
      where('status', '==', 'approved'),
      where('category', '==', categoryName),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    // IMPORTANT: Firestore Timestamps are not directly serializable for page props
    const apps = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate().toISOString(),
            updatedAt: data.updatedAt ? data.updatedAt.toDate().toISOString() : null,
        }
    }) as App[];

    return { props: { apps, categoryName } };
  } catch (error) {
    console.error(`Error fetching apps for category:`, error);
    return { props: { apps: [], categoryName: 'Error' } };
  }
};

const CategoryPage: NextPage<CategoryPageProps> = ({ apps, categoryName }) => {
  return (
    <>
      <Head>
        <title>{categoryName} Apps - MMN Store</title>
      </Head>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <Link href="/" className="text-brand hover:underline mb-8 inline-block">
                &larr; Back to Home
            </Link>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">
                Category: <span className="text-brand">{categoryName}</span>
            </h1>
        </div>

        {apps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {apps.map(app => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-100 dark:bg-dark-800 rounded-2xl">
            <p className="text-gray-500 dark:text-gray-400">No apps found in this category.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPage;
