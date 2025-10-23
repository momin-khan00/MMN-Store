import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search } from 'react-feather';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import Image from 'next/image';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
        inputRef.current?.blur(); // Remove focus from input
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchContainerRef]);

  return (
    <div className="relative" ref={searchContainerRef}>
      <div className="search-container">
        <input
          ref={inputRef}
          placeholder="Search..."
          className="search-input"
          name="text"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowResults(true)}
        />
        <div className="search-icon">
          <Search size={20} />
        </div>
        <div className="search-icon-bg"></div>
      </div>

      {showResults && (
        <div className="absolute top-full mt-2 w-[290px] right-0 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700 z-50 overflow-hidden">
          {isLoading && <div className="p-4 text-center text-sm text-gray-500">Searching...</div>}
          {!isLoading && results.length > 0 && (
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              {results.map(app => (
                <Link key={app.id} href={`/app/${app.id}`} onClick={() => { setSearchTerm(''); setShowResults(false); }}>
                  <div className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-dark-700 cursor-pointer">
                    <Image src={app.iconUrl} alt={app.name} width={36} height={36} className="rounded-md" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{app.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{app.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!isLoading && results.length === 0 && searchTerm.length > 1 && (
            <div className="p-4 text-center text-sm text-gray-500">No results for "{searchTerm}"</div>
          )}
          {!isLoading && searchTerm.length < 2 && (
             <div className="p-4 text-center text-sm text-gray-500">Enter 2+ characters.</div>
          )}
        </div>
      )}
    </div>
  );
}
