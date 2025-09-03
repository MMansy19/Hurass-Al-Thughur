'use client';

import { useState, useMemo } from 'react';
import { ArticleInterface } from '@/types/articles';

interface ArticleFiltersProps {
  articles: ArticleInterface[];
  locale: string;
  messages: any;
  onFilteredArticlesChange: (filteredArticles: ArticleInterface[]) => void;
}

export function ArticleFilters({
  articles,
  locale,
  messages,
  onFilteredArticlesChange,
}: ArticleFiltersProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [searchTitle, setSearchTitle] = useState<string>('');

  // Get unique authors from articles
  const uniqueAuthors = useMemo(() => {
    const authors = articles.map((article) => article.author);
    return Array.from(new Set(authors)).sort();
  }, [articles]);

  // Filter articles based on selected filters
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by author
    if (selectedAuthor) {
      filtered = filtered.filter((article) => article.author === selectedAuthor);
    }

    // Filter by title search
    if (searchTitle.trim()) {
      filtered = filtered.filter((article) =>
        article.title.toLowerCase().includes(searchTitle.toLowerCase().trim())
      );
    }

    return filtered;
  }, [articles, selectedAuthor, searchTitle]);

  // Update parent component when filtered articles change
  useMemo(() => {
    onFilteredArticlesChange(filteredArticles);
  }, [filteredArticles, onFilteredArticlesChange]);

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthor(e.target.value);
  };

  const handleTitleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(e.target.value);
  };

  const clearFilters = () => {
    setSelectedAuthor('');
    setSearchTitle('');
  };

  const hasActiveFilters = selectedAuthor || searchTitle.trim();

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Title Search */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor="title-search"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {messages.articles.searchByTitle || 'Search by Title'}
          </label>
          <div className="relative">
            <input
              id="title-search"
              type="text"
              value={searchTitle}
              onChange={handleTitleSearchChange}
              placeholder={messages.articles.searchTitlePlaceholder || 'Search article titles...'}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            />
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Author Filter */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor="author-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {messages.articles.filterByAuthor || 'Filter by Author'}
          </label>
          <select
            id="author-filter"
            value={selectedAuthor}
            onChange={handleAuthorChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <option value="">
              {messages.articles.allAuthors || 'All Authors'}
            </option>
            {uniqueAuthors.map((author) => (
              <option key={author} value={author}>
                {author}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex-shrink-0">
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              hasActiveFilters
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            {messages.articles.clearFilters || 'Clear Filters'}
          </button>
        </div>
      </div>

      {/* Filter Results Summary */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm text-gray-600">
          {messages.articles.showingResults
            ?.replace('{count}', filteredArticles.length.toString())
            ?.replace('{total}', articles.length.toString()) ||
            `Showing ${filteredArticles.length} of ${articles.length} articles`}
        </div>
        
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedAuthor && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                {messages.articles.author}: {selectedAuthor}
                <button
                  onClick={() => setSelectedAuthor('')}
                  className="ml-2 text-emerald-600 hover:text-emerald-800"
                >
                  ×
                </button>
              </span>
            )}
            {searchTitle.trim() && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {messages.articles.title}: "{searchTitle.trim()}"
                <button
                  onClick={() => setSearchTitle('')}
                  className="ml-2 text-blue-600 hover:text-blue-800"
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
