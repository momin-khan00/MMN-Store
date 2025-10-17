import type { App } from '@/types/app';
import Image from 'next/image';
import { Edit, Trash2 } from 'react-feather'; // We will install this icon library

interface DeveloperAppRowProps {
  app: App;
  onDelete: (appId: string, appName: string) => void;
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

export default function DeveloperAppRow({ app, onDelete }: DeveloperAppRowProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-dark-900 rounded-lg border border-dark-700">
      <div className="flex items-center space-x-3">
        <Image src={app.iconUrl} alt={app.name} width={40} height={40} className="rounded-md object-cover" />
        <div className="min-w-0">
          <p className="font-bold text-white truncate">{app.name}</p>
          <p className="text-sm text-gray-400">v{app.version}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <StatusBadge status={app.status} />
        <button className="text-gray-400 hover:text-brand-light transition" title="Update App (Coming Soon)">
          <Edit size={18} />
        </button>
        <button onClick={() => onDelete(app.id, app.name)} className="text-gray-400 hover:text-red-500 transition" title="Delete App">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
