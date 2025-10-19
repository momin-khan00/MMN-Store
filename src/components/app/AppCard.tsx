import Image from 'next/image';
import Link from 'next/link';
import type { App } from '@/types/app';

interface AppCardProps {
  app: App;
}

export default function AppCard({ app }: AppCardProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white dark:bg-dark-800 rounded-2xl 
                    hover:bg-gray-50 dark:hover:bg-dark-700 transition-all duration-300
                    transform hover:-translate-y-1 shadow-sm hover:shadow-md">
      
      <Link href={`/app/${app.id}`} className="flex-shrink-0">
        <Image src={app.iconUrl} alt={`${app.name} icon`} width={72} height={72} className="rounded-xl object-cover" />
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/app/${app.id}`}>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate hover:text-brand transition-colors">
                {app.name}
            </p>
        </Link>
        <Link href={`/category/${app.category.toLowerCase()}`}>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate hover:underline">
                {app.category}
            </p>
        </Link>
      </div>

      <div className="ml-auto self-center">
        <Link href={`/app/${app.id}`}>
            <button className="bg-accent/10 text-accent font-bold py-2 px-5 rounded-full
                             hover:bg-accent hover:text-white transition-all duration-300">
                View
            </button>
        </Link>
      </div>
    </div>
  );
}
