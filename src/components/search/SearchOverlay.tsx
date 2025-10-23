import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'react-feather';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import Image from 'next/image';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setResults([]);
      return;
    }
    const performSearch = async () => {
      setIsLoading(true);
      try {
        const appsRef = collection(firestore, 'apps');
        const q = query(
          appsRef,
          where('status', '==', 'approved'),
          where('name', '>=', searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)),
          where('name', '<=', searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1) + '\uf8ff'),
          orderBy('name'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        setResults(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App)));
      } catch (error) { console.error("Search error:", error); } 
      finally { setIsLoading(false); }
    };
    
    const debounceTimeout = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  return (
    <div 
      className={`fixed inset-0 bg-gray-100 dark:bg-dark-900 z-50 transform transition-transform duration-300 ease-in-out
                  ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              placeholder="Search for apps and games..."
              className="w-full h-12 pl-12 pr-4 rounded-full border-2 bg-gray-200 dark:bg-dark-800 
                         border-transparent focus:outline-none focus:border-brand transition-colors"
              name="text"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Search size={22} />
            </div>
          </div>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 font-semibold">
            Cancel
          </button>
        </div>

        <div className="mt-6">
          {isLoading && <div className="p-4 text-center text-sm text-gray-500">Searching...</div>}
          {!isLoading && results.length > 0 && (
            <div className="space-y-3">
              {results.map(app => (
                <Link key={app.id} href={`/app/${app.id}`} onClick={onClose}>
                  <div className="flex items-center space-x-4 p-3 bg-white dark:bg-dark-800 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-700 cursor-pointer">
                    <Image src={app.iconUrl} alt={app.name} width={48} height={48} className="rounded-lg" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{app.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{app.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!isLoading && results.length === 0 && searchTerm.length > 1 && (
            <div className="p-4 text-center text-sm text-gray-500">No results found for "{searchTerm}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
