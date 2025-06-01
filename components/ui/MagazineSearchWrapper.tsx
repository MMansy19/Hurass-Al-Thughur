'use client';

import { memo, useCallback } from 'react';
import { IntegratedSearchInterface } from './IntegratedComponents';

interface MagazineSearchWrapperProps {
  placeholder?: string;
  className?: string;
  suggestions?: string[];
  locale?: string;
}

export const MagazineSearchWrapper = memo<MagazineSearchWrapperProps>(({
  placeholder = "Search...",
  className = "max-w-2xl mx-auto",
  suggestions = [],
  locale = "en"
}) => {
  const handleSearch = useCallback((query: string) => {
    // Implement search functionality here
    console.log("Search query:", query);
    // You can add more sophisticated search logic here
    // For example, filtering through issues, redirecting to search results page, etc.
  }, []);

  return (
    <IntegratedSearchInterface
      placeholder={placeholder}
      onSearch={handleSearch}
      className={className}
      suggestions={suggestions}
      locale={locale}
    />
  );
});

MagazineSearchWrapper.displayName = 'MagazineSearchWrapper';
