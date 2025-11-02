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
  const [selectedTitle, setSelectedTitle] = useState<string>('');

  // Get unique authors from articles
  const uniqueAuthors = useMemo(() => {
    const authors = articles.map((article) => article.author);
    return Array.from(new Set(authors)).sort();
  }, [articles]);

  // Get unique titles from articles
  const uniqueTitles = useMemo(() => {
    const titles = articles.map((article) => article.title);
    return Array.from(new Set(titles)).sort();
  }, [articles]);

  // Filter articles based on selected filters
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by author
    if (selectedAuthor) {
      filtered = filtered.filter((article) => article.author === selectedAuthor);
    }

    // Filter by title
    if (selectedTitle) {
      filtered = filtered.filter((article) => article.title === selectedTitle);
    }

    return filtered;
  }, [articles, selectedAuthor, selectedTitle]);

  // Update parent component when filtered articles change
  useMemo(() => {
    onFilteredArticlesChange(filteredArticles);
  }, [filteredArticles, onFilteredArticlesChange]);

  const handleAuthorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAuthor(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTitle(e.target.value);
  };

  const clearFilters = () => {
    setSelectedAuthor('');
    setSelectedTitle('');
  };

  const hasActiveFilters = selectedAuthor || selectedTitle;

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Title Filter */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor="title-filter"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {messages.articles.filterByTitle || 'Filter by Title'}
          </label>
          <select
            id="title-filter"
            value={selectedTitle}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
          >
            <option value="">
              {messages.articles.allTitles || 'All Titles'}
            </option>
            {uniqueTitles.map((title) => (
              <option key={title} value={title}>
                {title.length > 50 ? `${title.substring(0, 50)}...` : title}
              </option>
            ))}
          </select>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white"
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
            {selectedTitle && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {messages.articles.title}: "{selectedTitle.length > 30 ? `${selectedTitle.substring(0, 30)}...` : selectedTitle}"
                <button
                  onClick={() => setSelectedTitle('')}
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
