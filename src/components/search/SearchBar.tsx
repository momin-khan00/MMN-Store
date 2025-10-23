import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft } from 'react-feather';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import Image from 'next/image';

interface SearchBarProps {
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
}

export default function SearchBar({ isSearching, setIsSearching }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleFocus = () => {
    setIsSearching(true);
  };
  
  const handleClose = () => {
    setIsSearching(false);
    setSearchTerm('');
    inputRef.current?.blur();
  };

  useEffect(() => {
    if (isSearching) {
        inputRef.current?.focus();
    }
  }, [isSearching]);


  return (
    <div className={`relative w-full transition-all duration-300 ease-in-out ${isSearching ? 'z-20' : ''}`} ref={searchContainerRef}>
      {/* This is the Search icon button when the bar is closed */}
      {!isSearching && (
        <button onClick={handleFocus} className="p-2 rounded-full bg-gray-200 dark:bg-dark-700/50 hover:bg-gray-300 dark:hover:bg-dark-700 transition-colors">
            <Search size={20} className="text-gray-600 dark:text-gray-300"/>
        </button>
      )}

      {/* This is the expanded search bar */}
      <div className={`absolute top-1/2 -translate-y-1/2 right-0 flex items-center transition-all duration-300 ease-in-out ${isSearching ? 'w-full' : 'w-0 opacity-0'}`}>
        <button onClick={handleClose} className="p-2 text-gray-600 dark:text-gray-300">
          <ArrowLeft size={24} />
        </button>
        <input
          ref={inputRef}
          placeholder="Search for apps..."
          className="h-12 w-full bg-transparent border-none focus:outline-none text-lg"
          name="text"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Search Results Dropdown */}
      {isSearching && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 z-10 overflow-hidden">
          {/* Results logic remains the same */}
          {isLoading && <div className="p-4 text-center text-sm text-gray-500">Searching...</div>}
          {!isLoading && results.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              {results.map(app => (
                <Link key={app.id} href={`/app/${app.id}`} onClick={handleClose}>
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-dark-700 cursor-pointer">
                    <Image src={app.iconUrl} alt={app.name} width={36} height={36} className="rounded-md" />
                    <div>
                      <p className="font-semibold text-sm">{app.name}</p>
                      <p className="text-xs text-gray-500">{app.category}</p>
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
      )}
    </div>
  );
}
