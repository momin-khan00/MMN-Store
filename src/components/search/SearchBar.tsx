import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, X, Clock, TrendingUp } from 'react-feather';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import type { App } from '@/types/app';
import Image from 'next/image';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<App[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
    
    // Mock trending searches - in a real app, you'd fetch this from your backend
    setTrendingSearches(['Social Media', 'Productivity', 'Games', 'Photo Editing']);
  }, []);

  // Save search term to recent searches
  const saveRecentSearch = useCallback((term: string) => {
    if (term.trim() === '') return;
    
    const updatedSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  }, [recentSearches]);

  // Perform search with debouncing
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
      } catch (error) { 
        console.error("Search error:", error); 
      } finally { 
        setIsLoading(false); 
      }
    };
    
    const debounceTimeout = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  // Handle clicks outside the search container
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showResults) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < results.length + recentSearches.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            // Handle selection based on highlighted index
            if (highlightedIndex < recentSearches.length) {
              const selectedSearch = recentSearches[highlightedIndex];
              setSearchTerm(selectedSearch);
              saveRecentSearch(selectedSearch);
            } else {
              const appIndex = highlightedIndex - recentSearches.length;
              if (appIndex < results.length) {
                window.location.href = `/app/${results[appIndex].id}`;
              }
            }
          }
          break;
        case 'Escape':
          setShowResults(false);
          setHighlightedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showResults, highlightedIndex, results, recentSearches, saveRecentSearch]);

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  // Handle search input focus
  const handleInputFocus = () => {
    setShowResults(true);
    setHighlightedIndex(-1);
  };

  // Handle search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      saveRecentSearch(searchTerm);
      // In a real app, you might navigate to a search results page
      setShowResults(false);
    }
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="search-container relative flex items-center">
          <div className="absolute left-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            ref={inputRef}
            placeholder="Search apps..."
            className="search-input w-full sm:w-64 md:w-80 pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-dark-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:bg-white dark:focus:bg-dark-600 transition-all duration-200"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors duration-200"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div 
          ref={resultsRef}
          className="absolute top-full mt-2 w-full sm:w-80 md:w-96 bg-white dark:bg-dark-800 rounded-xl shadow-xl border border-gray-200 dark:border-dark-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="p-4 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Searching...</span>
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!isLoading && searchTerm.length < 2 && recentSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100 dark:border-dark-700">
              <div className="flex items-center space-x-2 mb-2">
                <Clock size={14} className="text-gray-400" />
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Searches</h3>
              </div>
              <div className="space-y-1">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors duration-150 flex items-center space-x-2 ${
                      highlightedIndex === index ? 'bg-gray-100 dark:bg-dark-700' : ''
                    }`}
                    onClick={() => {
                      setSearchTerm(term);
                      saveRecentSearch(term);
                      inputRef.current?.focus();
                    }}
                  >
                    <Search size={14} className="text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {!isLoading && searchTerm.length < 2 && trendingSearches.length > 0 && (
            <div className="p-3 border-b border-gray-100 dark:border-dark-700">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp size={14} className="text-gray-400" />
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trending</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term, index) => (
                  <button
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-full text-xs text-gray-700 dark:text-gray-300 transition-colors duration-150"
                    onClick={() => {
                      setSearchTerm(term);
                      inputRef.current?.focus();
                    }}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              <div className="divide-y divide-gray-100 dark:divide-dark-700">
                {results.map((app, index) => {
                  const actualIndex = recentSearches.length + index;
                  return (
                    <Link key={app.id} href={`/app/${app.id}`} onClick={() => { 
                      setSearchTerm(''); 
                      setShowResults(false); 
                      saveRecentSearch(app.name);
                    }}>
                      <div className={`flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition-colors duration-150 ${
                        highlightedIndex === actualIndex ? 'bg-gray-50 dark:bg-dark-700' : ''
                      }`}>
                        <div className="relative flex-shrink-0">
                          <Image src={app.iconUrl} alt={app.name} width={40} height={40} className="rounded-lg" />
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-800"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{app.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{app.category}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">{app.rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg key={i} className={`w-3 h-3 ${i < Math.floor(app.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isLoading && results.length === 0 && searchTerm.length > 1 && (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-dark-700 rounded-full mb-3">
                <Search size={20} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No results for "{searchTerm}"</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Try searching with different keywords</p>
            </div>
          )}

          {/* View All Results Link */}
          {!isLoading && results.length > 0 && (
            <div className="p-3 border-t border-gray-100 dark:border-dark-700">
              <Link href={`/search?q=${encodeURIComponent(searchTerm)}`} className="block w-full text-center py-2 text-sm font-medium text-brand hover:text-brand/80 transition-colors duration-150">
                View all results
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
