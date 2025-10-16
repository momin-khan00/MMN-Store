import Image from 'next/image';
import Link from 'next/link';
import type { App } from '@/types/app'; // Importing our App type

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/app/${app.id}`} className="block group">
      <div className="flex items-center space-x-4 p-4 bg-dark-800 rounded-2xl 
                      hover:bg-dark-700 transition-all duration-300
                      transform hover:-translate-y-1">
        
        {/* App Icon */}
        <div className="flex-shrink-0">
          <Image
            src={app.iconUrl}
            alt={`${app.name} icon`}
            width={72}
            height={72}
            className="rounded-xl object-cover"
          />
        </div>

        {/* App Info */}
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold text-gray-100 truncate group-hover:text-brand-light transition-colors">
            {app.name}
          </p>
          <p className="text-sm text-gray-400 truncate">
            {app.developerName}
          </p>
          {app.rating && (
            <p className="text-sm text-gray-300 mt-1">
              ⭐ {app.rating.toFixed(1)}
            </p>
          )}
        </div>

        {/* Install Button */}
        <div className="self-center">
            <button className="bg-accent/10 text-accent font-bold py-2 px-5 rounded-full
                             group-hover:bg-accent group-hover:text-white transition-all duration-300">
                View
            </button>
        </div>
      </div>
    </Link>
  );
}
