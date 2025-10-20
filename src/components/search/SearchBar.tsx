import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search } from 'react-feather';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import Image from 'next/image';

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
          where('name', '>=', searchTerm),
          where('name', '<=', searchTerm + '\uf8ff'),
          orderBy('name'),
          limit(5)
        );
        const querySnapshot = await getDocs(q);
        const searchResults = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as App));
        setResults(searchResults);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce the search
    const debounceTimeout = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  // Click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchContainerRef]);

  return (
    <div className="relative w-full max-w-xs" ref={searchContainerRef}>
      <div className="relative flex items-center">
        <input
          placeholder="Search apps..."
          className={`h-10 pl-10 pr-4 rounded-full border bg-gray-100 dark:bg-dark-800 border-transparent 
                      text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                      transition-all duration-300 ease-in-out
                      focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand
                      ${isFocused || searchTerm ? 'w-full' : 'w-10'}`}
          name="text"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <div className="absolute left-0 top-0 h-10 w-10 flex items-center justify-center text-gray-400 dark:text-gray-500">
          <Search size={20} />
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isFocused && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 z-50 overflow-hidden">
          {isLoading && <div className="p-4 text-center text-sm text-gray-500">Searching...</div>}
          {!isLoading && results.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              {results.map(app => (
                <Link key={app.id} href={`/app/${app.id}`} onClick={() => setIsFocused(false)}>
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
          {!isLoading && searchTerm.length < 2 && (
             <div className="p-4 text-center text-sm text-gray-500">Enter at least 2 characters to search.</div>
          )}
        </div>
      )}
    </div>
  );
}
