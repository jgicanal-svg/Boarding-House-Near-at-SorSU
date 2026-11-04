import React, { useEffect, useState } from 'react';
import { History, Search } from 'lucide-react';

interface RecentSearchesProps {
  onSelectSearch: (query: string) => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({ onSelectSearch }) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const loadSearches = () => {
      const saved = localStorage.getItem('ssu_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    };
    loadSearches();
    window.addEventListener('storage', loadSearches);
    return () => window.removeEventListener('storage', loadSearches);
  }, []);

  const handleClearAll = () => {
    localStorage.removeItem('ssu_recent_searches');
    setRecentSearches([]);
  };

  if (recentSearches.length === 0) return null;

  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-700">
        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
          <History className="w-4 h-4 text-[#800000] dark:text-amber-400" />
          Recent Searches
        </h4>
        <button
          type="button"
          onClick={handleClearAll}
          className="text-[10px] text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
        >
          Clear History
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {recentSearches.map((term, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectSearch(term)}
            className="inline-flex items-center gap-1.5 text-xs bg-zinc-100 dark:bg-zinc-900 hover:bg-amber-100 dark:hover:bg-amber-950/50 text-zinc-700 dark:text-zinc-300 hover:text-[#800000] dark:hover:text-amber-300 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 transition-all cursor-pointer font-medium"
          >
            <Search className="w-3 h-3 text-zinc-400" />
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};
