import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppData } from '../../types/app';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import AdBanner from '../../components/common/AdBanner';
import { useAuth } from '../../context/AuthContext';

const AppDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { currentUser } = useAuth();
  
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchApp = async () => {
      try {
        const appDoc = await getDoc(doc(db, 'apps', id as string));
        
        if (appDoc.exists()) {
          setApp({ id: appDoc.id, ...appDoc.data() } as AppData);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error('Error fetching app:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id, router]);

  const handleDownload = async () => {
    if (!app || isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      // Increment download count
      await updateDoc(doc(db, 'apps', app.id), {
        downloadCount: app.downloadCount + 1
      });
      
      // Update local state
      setApp(prev => prev ? { ...prev, downloadCount: prev.downloadCount + 1 } : null);
      
      // Start download
      window.open(app.apkUrl, '_blank');
    } catch (error) {
      console.error('Error downloading app:', error);
      alert('Failed to download app. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">App Not Found</h1>
            <p className="text-gray-600">The app you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 p-6 bg-gray-100 flex flex-col items-center justify-center">
              <img 
                src={app.iconUrl} 
                alt={app.name}
                className="w-32 h-32 object-contain mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/icons/default-app-icon.png';
                }}
              />
              
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-blue-600 text-white font-medium py-3 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Size: {formatSize(app.size)}</p>
                <p className="text-sm text-gray-600">Version: {app.version}</p>
                <p className="text-sm text-gray-600">Downloads: {app.downloadCount.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="md:w-2/3 p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{app.name}</h1>
              <p className="text-gray-600 mb-4">by {app.developerName}</p>
              
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-lg font-medium text-gray-700 ml-1">{app.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500 ml-2">
                  ({app.reviewsCount} reviews)
                </span>
                <span className="text-gray-500 ml-4">
                  Category: {app.category}
                </span>
              </div>
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{app.description}</p>
              </div>
              
              {app.permissions.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Permissions</h2>
                  <div className="flex flex-wrap gap-2">
                    {app.permissions.map((permission, index) => (
                      <span 
                        key={index} 
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Information</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Updated:</span>
                    <span className="ml-2 text-gray-700">{formatDate(app.updatedAt)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Released:</span>
                    <span className="ml-2 text-gray-700">{formatDate(app.createdAt)}</span>
                  </div>
                </div>
              </div>
              
              {app.screenshots.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Screenshots</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {app.screenshots.map((screenshot, index) => (
                      <img 
                        key={index}
                        src={screenshot} 
                        alt={`${app.name} screenshot ${index + 1}`}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Ad Banner */}
        <div className="my-8">
          <AdBanner type="banner" />
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
          <p className="text-gray-600">Reviews feature coming soon!</p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AppDetailPage;
