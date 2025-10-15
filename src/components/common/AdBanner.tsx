import React from 'react';

interface AdBannerProps {
  type: 'banner' | 'native' | 'square';
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const getAdDimensions = () => {
    switch (type) {
      case 'banner':
        return 'w-full h-16 md:h-20';
      case 'native':
        return 'w-full h-32 md:h-40';
      case 'square':
        return 'w-full h-64 md:w-64 md:h-64';
      default:
        return 'w-full h-16';
    }
  };

  return (
    <div className={`bg-gray-200 flex items-center justify-center ${getAdDimensions()} ${className}`}>
      <div className="text-center text-gray-500">
        <p className="text-sm font-medium">Advertisement</p>
        <p className="text-xs">AdSense / Adsterra Placeholder</p>
      </div>
    </div>
  );
};

export default AdBanner;
