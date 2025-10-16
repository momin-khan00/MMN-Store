import { useState } from 'react';
import type { App } from '@/types/app';
import Image from 'next/image';

interface PendingAppRowProps {
  app: App;
  onUpdateStatus: (appId: string, newStatus: 'approved' | 'rejected') => Promise<boolean>;
}

export default function PendingAppRow({ app, onUpdateStatus }: PendingAppRowProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdate = async (newStatus: 'approved' | 'rejected') => {
    setIsProcessing(true);
    await onUpdateStatus(app.id, newStatus);
    // No need to set isProcessing back to false, as the component will be removed from the list on success
  };

  return (
    <div className="flex items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-700">
      <div className="flex items-center space-x-4">
        <Image src={app.iconUrl} alt={app.name} width={48} height={48} className="rounded-lg" />
        <div>
          <a href={`/app/${app.id}`} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:underline">{app.name}</a>
          <p className="text-sm text-gray-400">{app.developerName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleUpdate('approved')}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition disabled:bg-gray-500"
        >
          {isProcessing ? '...' : 'Approve'}
        </button>
        <button
          onClick={() => handleUpdate('rejected')}
          disabled={isProcessing}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition disabled:bg-gray-500"
        >
          {isProcessing ? '...' : 'Reject'}
        </button>
      </div>
    </div>
  );
}
