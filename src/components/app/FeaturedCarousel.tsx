import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AppData } from '../../types/app';

const FeaturedCarousel: React.FC = () => {
  const [featuredApps, setFeaturedApps] = useState<AppData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedApps = async () => {
      try {
        const appsQuery = query(
          collection(db, 'apps'),
          where('status', '==', 'approved'),
          where('featured', '==', true),
          orderBy('downloadCount', 'desc'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(appsQuery);
        const appsData: AppData[] = [];
        
        querySnapshot.forEach((doc) => {
          appsData.push({ id: doc.id, ...doc.data() } as AppData);
        });
        
        setFeaturedApps(appsData);
      } catch (error) {
        console.error('Error fetching featured apps:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedApps();
  }, []);

  useEffect(() => {
    if (featuredApps.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredApps.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredApps.length]);

  if (loading) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
    );
  }

  if (featuredApps.length === 0) {
    return (
      <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No featured apps available</p>
      </div>
    );
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredApps.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredApps.length);
  };

  return (
    <div className="relative h-64 md:h-80 bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative h-full">
        {featuredApps.map((app, index) => (
          <div
            key={app.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex h-full">
              <div className="w-1/3 h-full bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={app.iconUrl}
                  alt={app.name}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/icons/default-app-icon.png';
                  }}
                />
              </div>
              <div className="w-2/3 p-6 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{app.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{app.description}</p>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-700 ml-1">{app.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({app.reviewsCount} reviews)
                  </span>
                  <span className="text-sm text-gray-500 ml-4">
                    {app.downloadCount.toLocaleString()} downloads
                  </span>
                </div>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-32">
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 focus:outline-none"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredApps.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
