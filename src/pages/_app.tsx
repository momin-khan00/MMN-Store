import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
