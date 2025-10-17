import { useState } from 'react';
import type { App } from '@/types/app';
import Image from 'next/image';
import Link from 'next/link';

interface PendingAppRowProps {
  app: App;
  onUpdateStatus: (appId: string, newStatus: 'approved' | 'rejected') => Promise<boolean>;
}

export default function PendingAppRow({ app, onUpdateStatus }: PendingAppRowProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleUpdate = async (newStatus: 'approved' | 'rejected') => {
    setAction(newStatus);
    setIsProcessing(true);
    await onUpdateStatus(app.id, newStatus);
    // No need to set isProcessing back to false, as the component will be removed from the list on success
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-700 gap-4">
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <Image src={app.iconUrl} alt={app.name} width={48} height={48} className="rounded-lg object-cover flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <Link href={`/app/${app.id}`} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:underline truncate block">{app.name}</Link>
          <p className="text-sm text-gray-400 truncate">{app.developerName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 flex-shrink-0 w-full sm:w-auto justify-end">
        <button
          onClick={() => handleUpdate('approved')}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition disabled:bg-gray-500 w-1/2 sm:w-auto"
        >
          {isProcessing && action === 'approve' ? '...' : 'Approve'}
        </button>
        <button
          onClick={() => handleUpdate('rejected')}
          disabled={isProcessing}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition disabled:bg-gray-500 w-1/2 sm:w-auto"
        >
          {isProcessing && action === 'reject' ? '...' : 'Reject'}
        </button>
      </div>
    </div>
  );
}
