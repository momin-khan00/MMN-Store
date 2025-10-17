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
  // THE FIX: The state now correctly matches the status values
  const [action, setAction] = useState<'approved' | 'rejected' | null>(null);

  const handleUpdate = async (newStatus: 'approved' | 'rejected') => {
    // THE FIX: `setAction` is now receiving the correct type
    setAction(newStatus);
    setIsProcessing(true);
    await onUpdateStatus(app.id, newStatus);
    // Component will be removed, so no need to reset state
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-dark-900 rounded-lg border border-dark-700 gap-4">
      <div className="flex items-center space-x-4 w-full sm:w-auto">
        <Image src={app.iconUrl} alt={app.name} width={48} height={48} className="rounded-lg object-cover flex-shrink-0" />
        <div className="min-w-0 flex-1">
          {/* A temporary link to check app details; we need to adjust security rules for this to work for admins */}
          <p className="font-bold text-white truncate block">{app.name}</p>
          <p className="text-sm text-gray-400 truncate">{app.developerName}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3 flex-shrink-0 w-full sm:w-auto justify-end">
        <button
          onClick={() => handleUpdate('approved')}
          disabled={isProcessing}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-md transition disabled:bg-gray-500 w-1/2 sm:w-auto"
        >
          {isProcessing && action === 'approved' ? '...' : 'Approve'}
        </button>
        <button
          onClick={() => handleUpdate('rejected')}
          disabled={isProcessing}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-md transition disabled:bg-gray-500 w-1/2 sm:w-auto"
        >
          {isProcessing && action === 'rejected' ? '...' : 'Reject'}
        </button>
      </div>
    </div>
  );
}
