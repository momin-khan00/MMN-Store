// src/components/app/AppCard.tsx
import React from 'react';
import Link from 'next/link';
import { AppData } from '../../types/app';

interface AppCardProps {
  app: AppData;
}

const AppCard: React.FC<AppCardProps> = ({ app }) => {
  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link href={`/app/${app.id}`}>
        <div className="cursor-pointer">
          <div className="relative h-40 bg-gray-100 flex items-center justify-center">
            <img 
              src={app.iconUrl} 
              alt={app.name}
              className="h-32 w-32 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/icons/default-app-icon.png';
              }}
            />
            {app.featured && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                Featured
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 truncate mb-1">{app.name}</h3>
            <p className="text-sm text-gray-600 truncate mb-2">{app.developerName}</p>
            
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="text-sm text-gray-700 ml-1">{app.rating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({app.reviewsCount})
              </span>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-gray-500">{formatSize(app.size)}</span>
              <span className="text-xs text-gray-500">{app.version}</span>
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
              Download
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default AppCard;
