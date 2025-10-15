'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface LibraryFiltersProps {
  categories: string[];
  messages: any;
  currentCategory?: string;
  currentSearch?: string;
}

export default function LibraryFilters({ 
  categories, 
  messages, 
  currentCategory, 
  currentSearch 
}: LibraryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    router.push(`?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const params = new URLSearchParams(searchParams);
    
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }

    router.push(`?${params.toString()}`);
  };

  const removeFilter = (filterType: 'category' | 'search') => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterType);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200/50">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                name="search"
                defaultValue={currentSearch || ''}
                placeholder={messages.library.searchPlaceholder || 'Search PDFs...'}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Category Filter */}
          <div>
            <select
              name="category"
              value={currentCategory || ''}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">{messages.library.allCategories || 'All Categories'}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(currentCategory || currentSearch) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {currentCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                {messages.library.category}: {currentCategory}
                <button
                  onClick={() => removeFilter('category')}
                  className="ml-2 hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                {messages.library.search}: {currentSearch}
                <button
                  onClick={() => removeFilter('search')}
                  className="ml-2 hover:text-green-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}