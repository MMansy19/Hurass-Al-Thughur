// Component-level performance optimizations using React.memo, useMemo, and useCallback
"use client";

import React, {
  memo,
  useMemo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from "react";
import { Category } from "@/types";

// Memoized category filter component
interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
}

export const MemoizedCategoryFilter = memo<CategoryFilterProps>(
  ({ categories, selectedCategory, onCategoryChange, className = "" }) => {
    // Memoize sorted categories
    const sortedCategories = useMemo(() => {
      return [...categories].sort((a, b) => a.name.localeCompare(b.name, "ar"));
    }, [categories]);

    // Memoized click handler factory
    const createClickHandler = useCallback(
      (categoryId: string) => {
        return () => onCategoryChange(categoryId);
      },
      [onCategoryChange],
    );

    return (
      <div
        className={`flex flex-wrap gap-2 ${className}`}
        role="tablist"
        aria-label="فلترة حسب الفئة"
      >
        <button
          onClick={createClickHandler("")}
          className={`sm:px-4 px-2 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            selectedCategory === ""
              ? "bg-blue-600 text-white"
              : "bg-gray-200  text-gray-700  hover:bg-gray-300 :bg-gray-600"
          }`}
          role="tab"
          aria-selected={selectedCategory === ""}
        >
          جميع الفئات
        </button>
        {sortedCategories.map((category) => (
          <button
            key={category.id}
            onClick={createClickHandler(category.id)}
            className={`sm:px-4 px-2 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              selectedCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200  text-gray-700  hover:bg-gray-300 :bg-gray-600"
            }`}
            role="tab"
            aria-selected={selectedCategory === category.id}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>
    );
  },
);

MemoizedCategoryFilter.displayName = "MemoizedCategoryFilter";

// Memoized search component with debouncing
interface SearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

export const MemoizedSearch = memo<SearchProps>(
  ({
    onSearch,
    placeholder = "البحث في المجلات...",
    className = "",
    debounceMs = 300,
  }) => {
    const [query, setQuery] = useState("");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Debounced search effect
    useEffect(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        onSearch(query);
      }, debounceMs);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [query, onSearch, debounceMs]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
      },
      [],
    );

    const handleClear = useCallback(() => {
      setQuery("");
    }, []);

    return (
      <div className={`relative ${className}`}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full sm:px-4 px-2 py-2 pr-10 pl-10 border border-gray-300  rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white  text-gray-900  placeholder-gray-500 "
            dir="rtl"
            aria-label="البحث في المجلات"
          />

          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
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

          {query && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600 :text-gray-300"
              aria-label="مسح البحث"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  },
);

MemoizedSearch.displayName = "MemoizedSearch";

// Memoized pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
}

export const MemoizedPagination = memo<PaginationProps>(
  ({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
    showFirstLast = true,
    showPrevNext = true,
    maxVisiblePages = 5,
  }) => {
    // Memoize visible page numbers
    const visiblePages = useMemo(() => {
      const half = Math.floor(maxVisiblePages / 2);
      let start = Math.max(1, currentPage - half);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }, [currentPage, totalPages, maxVisiblePages]);

    // Memoized click handlers
    const handleFirst = useCallback(() => onPageChange(1), [onPageChange]);
    const handlePrev = useCallback(
      () => onPageChange(Math.max(1, currentPage - 1)),
      [onPageChange, currentPage],
    );
    const handleNext = useCallback(
      () => onPageChange(Math.min(totalPages, currentPage + 1)),
      [onPageChange, currentPage, totalPages],
    );
    const handleLast = useCallback(
      () => onPageChange(totalPages),
      [onPageChange, totalPages],
    );

    const createPageHandler = useCallback(
      (page: number) => {
        return () => onPageChange(page);
      },
      [onPageChange],
    );

    if (totalPages <= 1) return null;

    return (
      <nav
        className={`flex items-center justify-center space-x-2 ${className}`}
        aria-label="تصفح الصفحات"
      >
        {showFirstLast && currentPage > 1 && (
          <button
            onClick={handleFirst}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700    :bg-gray-700 :text-white"
            aria-label="الصفحة الأولى"
          >
            الأولى
          </button>
        )}

        {showPrevNext && currentPage > 1 && (
          <button
            onClick={handlePrev}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700    :bg-gray-700 :text-white"
            aria-label="الصفحة السابقة"
          >
            السابقة
          </button>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={createPageHandler(page)}
            className={`px-3 py-2 text-sm font-medium rounded-lg ${
              page === currentPage
                ? "text-blue-600 bg-blue-50 border border-blue-300   "
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700    :bg-gray-700 :text-white"
            }`}
            aria-label={`الصفحة ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {showPrevNext && currentPage < totalPages && (
          <button
            onClick={handleNext}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700    :bg-gray-700 :text-white"
            aria-label="الصفحة التالية"
          >
            التالية
          </button>
        )}

        {showFirstLast && currentPage < totalPages && (
          <button
            onClick={handleLast}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700    :bg-gray-700 :text-white"
            aria-label="الصفحة الأخيرة"
          >
            الأخيرة
          </button>
        )}
      </nav>
    );
  },
);

MemoizedPagination.displayName = "MemoizedPagination";

// Memoized loading skeleton
interface SkeletonProps {
  className?: string;
  count?: number;
  height?: number;
  width?: number | string;
  rounded?: boolean;
}

export const MemoizedSkeleton = memo<SkeletonProps>(
  ({
    className = "",
    count = 1,
    height = 20,
    width = "100%",
    rounded = false,
  }) => {
    const skeletons = useMemo(() => {
      return Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`animate-pulse bg-gray-200  ${rounded ? "rounded-full" : "rounded"} ${className}`}
          style={{ height: `${height}px`, width }}
          aria-hidden="true"
        />
      ));
    }, [count, height, width, rounded, className]);

    return <>{skeletons}</>;
  },
);

MemoizedSkeleton.displayName = "MemoizedSkeleton";

// Export all memoized components
export default {
  MemoizedCategoryFilter,
  MemoizedSearch,
  MemoizedPagination,
  MemoizedSkeleton,
};
