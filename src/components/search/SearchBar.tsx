import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X } from 'react-feather';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import Image from 'next/image';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Firestore search logic
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
          where('name_lowercase', '>=', searchTerm.toLowerCase()),
          where('name_lowercase', '<=', searchTerm.toLowerCase() + '\uf8ff'),
          orderBy('name_lowercase'),
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

  // Open search and focus input
  const openSearch = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100); // Focus after transition
  };
  
  // Close search and clear term
  const closeSearch = () => {
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <>
      {/* The Search Icon Button in the Header */}
      <button onClick={openSearch} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors">
        <Search size={20} className="text-gray-600 dark:text-gray-300" />
      </button>

      {/* The Fullscreen Search Overlay */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div 
          className="absolute inset-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md"
          onClick={closeSearch}
        ></div>
        
        <div className="relative container mx-auto px-4 pt-4">
          {/* Search Input and Close Button */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                placeholder="Search for amazing apps..."
                className="w-full h-12 pl-12 pr-4 rounded-full border-2 
                           bg-white dark:bg-dark-800 
                           border-gray-300 dark:border-dark-700
                           text-lg text-gray-900 dark:text-gray-100
                           focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={22} />
              </div>
            </div>
            <button onClick={closeSearch} className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          {/* Search Results */}
          <div className="mt-4 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700">
            {isLoading && <div className="p-4 text-center text-sm text-gray-500">Searching...</div>}
            {!isLoading && results.length > 0 && (
              <div className="divide-y divide-gray-200 dark:divide-dark-700">
                {results.map(app => (
                  <Link key={app.id} href={`/app/${app.id}`} onClick={closeSearch}>
                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-dark-700 cursor-pointer">
                      <Image src={app.iconUrl} alt={app.name} width={40} height={40} className="rounded-md" />
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
    </>
  );
}
