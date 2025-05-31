'use client';

import React, { memo, lazy, Suspense, useMemo, useCallback } from 'react';
import { LoadingSpinner } from './AccessibilityComponents';

// Lazy loaded components for code splitting
const LazyPDFViewer = lazy(() => import('@/components/pdf/PDFViewerSection'));
const LazyImageGallery = lazy(() => import('@/components/ui/ImageGallery').catch(() => ({ default: () => <div>Gallery not available</div> })));

// Memoized Magazine Issue Card
interface MagazineIssue {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  date: string;
}

interface MagazineCardProps {
  issue: MagazineIssue;
  readNowText: string;
  onReadClick?: (issueId: number) => void;
  locale: string;
}

export const MagazineCard = memo<MagazineCardProps>(({ 
  issue, 
  readNowText, 
  onReadClick,
  locale 
}) => {
  const handleClick = useCallback(() => {
    onReadClick?.(issue.id);
  }, [issue.id, onReadClick]);

  const ariaLabel = useMemo(() => 
    `${readNowText} - ${issue.title}`, 
    [readNowText, issue.title]
  );

  return (
    <article 
      className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
      role="listitem"
      aria-labelledby={`issue-title-${issue.id}`}
      aria-describedby={`issue-desc-${issue.id} issue-date-${issue.id}`}
    >
      <div className="aspect-[3/4] relative bg-gray-50" role="img" aria-label={`Cover image - ${issue.title}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-24 h-24 mb-4">
            <svg 
              className="w-full h-full text-emerald-200" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M19 1l-5 5v11l5-4.5V1M1 4v14c0 1.1.9 2 2 2h14c.85 0 1.58-.54 1.87-1.3L7 9.38V4H5v9.38l-3 2.62V5c0-.55.45-1 1-1h15c.55 0 1 .45 1 1v13c0 1.11-.89 2-2 2H6c-2.21 0-4-1.79-4-4" />
            </svg>
          </div>
          <div className="text-xl font-bold text-emerald-800">{issue.title}</div>
        </div>
      </div>
      <div className="p-5">
        <h3 id={`issue-title-${issue.id}`} className="font-bold text-xl mb-2 text-emerald-900">
          {issue.title}
        </h3>
        <p id={`issue-date-${issue.id}`} className="text-emerald-700 text-sm mb-3 flex items-center">
          <svg 
            className="w-4 h-4 mx-1" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <time dateTime={issue.date}>{issue.date}</time>
        </p>
        <p id={`issue-desc-${issue.id}`} className="text-gray-700 mb-5">
          {issue.description}
        </p>
        <button 
          className="w-full px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-sm flex items-center justify-center"
          aria-label={ariaLabel}
          type="button"
          onClick={handleClick}
        >
          <svg 
            className="w-5 h-5 mx-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {readNowText}
        </button>
      </div>
    </article>
  );
});

MagazineCard.displayName = 'MagazineCard';

// Memoized Category Link
interface CategoryLinkProps {
  category: {
    id: number;
    name: string;
  };
  locale: string;
  browseCategoryText: string;
}

export const CategoryLink = memo<CategoryLinkProps>(({ 
  category, 
  locale, 
  browseCategoryText 
}) => {
  const ariaLabel = useMemo(() => 
    `${browseCategoryText}: ${category.name}`, 
    [browseCategoryText, category.name]
  );

  return (
    <a
      href={`/${locale}/magazine/category/${category.id}`}
      className="bg-white border border-gray-200 p-5 rounded-lg text-center hover:bg-emerald-50 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all shadow-sm hover:shadow-md flex items-center justify-center"
      aria-label={ariaLabel}
    >
      <span className="font-medium text-emerald-900">{category.name}</span>
    </a>
  );
});

CategoryLink.displayName = 'CategoryLink';

// Optimized PDF Viewer with Suspense
interface OptimizedPDFViewerProps {
  pdfUrl: string;
  title: string;
  messages: any;
}

export const OptimizedPDFViewer = memo<OptimizedPDFViewerProps>(({ 
  pdfUrl, 
  title, 
  messages 
}) => {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" text="Loading PDF viewer..." />
        </div>
      }
    >
      <LazyPDFViewer 
        pdfUrl={pdfUrl}
        title={title}
        messages={messages}
      />
    </Suspense>
  );
});

OptimizedPDFViewer.displayName = 'OptimizedPDFViewer';

// Virtualized list for large datasets
interface VirtualizedListProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
}

export const VirtualizedList = memo<VirtualizedListProps>(({ 
  items, 
  renderItem, 
  itemHeight, 
  containerHeight 
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);

  const visibleItems = useMemo(() => 
    items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div 
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
      role="list"
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={startIndex + index}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
            role="listitem"
          >
            {renderItem(item, startIndex + index)}
          </div>
        ))}
      </div>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';
