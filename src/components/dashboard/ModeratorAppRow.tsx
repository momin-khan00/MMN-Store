import { useState } from 'react';
import type { App } from '@/types/app';
import Image from 'next/image';
import { Flag } from 'react-feather';

interface ModeratorAppRowProps {
  app: App;
  onToggleFlag: (app: App) => void;
}

const StatusBadge = ({ status }: { status: App['status'] }) => {
  const baseStyle = "text-xs font-semibold px-2.5 py-0.5 rounded-full";
  const styles = {
    pending: `${baseStyle} bg-yellow-500/20 text-yellow-400`,
    approved: `${baseStyle} bg-green-500/20 text-green-400`,
    rejected: `${baseStyle} bg-red-500/20 text-red-400`,
  };
  return <span className={styles[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
};


export default function ModeratorAppRow({ app, onToggleFlag }: ModeratorAppRowProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggle = async () => {
    setIsProcessing(true);
    await onToggleFlag(app);
    setIsProcessing(false); // Reset after action is complete
  };

  return (
    <div className={`flex items-center justify-between p-3 bg-white dark:bg-dark-900 rounded-lg border border-gray-200 dark:border-dark-700 ${app.isFlagged ? 'border-red-500' : ''}`}>
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Image src={app.iconUrl} alt={app.name} width={40} height={40} className="rounded-md object-cover flex-shrink-0" />
        <div className="min-w-0">
          <p className="font-bold text-gray-900 dark:text-white truncate">{app.name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{app.developerName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4 flex-shrink-0">
        <StatusBadge status={app.status} />
        <button 
          onClick={handleToggle}
          disabled={isProcessing}
          className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
            app.isFlagged 
            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
            : 'text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
          }`} 
          title={app.isFlagged ? 'Unflag App' : 'Flag App for Review'}
        >
          {isProcessing ? '...' : <Flag size={18} />}
        </button>
      </div>
    </div>
  );
}
