// Enhanced loading states and skeleton screens for better UX
'use client';

import React, { memo, useMemo } from 'react';
import { useTranslations } from 'next-intl';

// Base loading spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  'aria-label'?: string;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = 'md',
  color = 'primary',
  className = '',
  'aria-label': ariaLabel = 'جاري التحميل...',
}) => {
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-6 h-6';
      case 'lg': return 'w-8 h-8';
      case 'xl': return 'w-12 h-12';
      default: return 'w-6 h-6';
    }
  }, [size]);

  const colorClasses = useMemo(() => {
    switch (color) {
      case 'primary': return 'border-blue-600 border-t-transparent';
      case 'secondary': return 'border-gray-600 border-t-transparent';
      case 'white': return 'border-white border-t-transparent';
      case 'gray': return 'border-gray-300 border-t-transparent';
      default: return 'border-blue-600 border-t-transparent';
    }
  }, [color]);

  return (
    <div
      className={`${sizeClasses} border-2 ${colorClasses} rounded-full animate-spin ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Loading overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
  backdrop?: boolean;
}

export const LoadingOverlay = memo<LoadingOverlayProps>(({
  isLoading,
  children,
  message = 'جاري التحميل...',
  className = '',
  backdrop = true,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {children}
      <div className={`absolute inset-0 flex items-center justify-center z-50 ${
        backdrop ? 'bg-white bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75' : ''
      }`}>
        <div className="flex flex-col items-center space-y-3">
          <LoadingSpinner size="lg" />
          {message && (
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';

// Skeleton components
interface SkeletonProps {
  className?: string;
}

export const SkeletonText = memo<SkeletonProps>(({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-4 ${className}`} />
));

SkeletonText.displayName = 'SkeletonText';

export const SkeletonTitle = memo<SkeletonProps>(({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded h-6 w-3/4 ${className}`} />
));

SkeletonTitle.displayName = 'SkeletonTitle';

export const SkeletonAvatar = memo<SkeletonProps>(({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full w-10 h-10 ${className}`} />
));

SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonImage = memo<SkeletonProps>(({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-full h-48 ${className}`} />
));

SkeletonImage.displayName = 'SkeletonImage';

export const SkeletonButton = memo<SkeletonProps>(({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-10 w-24 ${className}`} />
));

SkeletonButton.displayName = 'SkeletonButton';

// Magazine card skeleton
export const MagazineCardSkeleton = memo(() => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <SkeletonImage className="w-full h-64" />
    <div className="p-4 space-y-3">
      <SkeletonTitle />
      <div className="space-y-2">
        <SkeletonText />
        <SkeletonText className="w-5/6" />
        <SkeletonText className="w-4/6" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonText className="w-20 h-3" />
        <SkeletonText className="w-16 h-3" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonButton className="w-20 h-6" />
        <SkeletonButton className="w-16 h-8" />
      </div>
    </div>
  </div>
));

MagazineCardSkeleton.displayName = 'MagazineCardSkeleton';

// Magazine grid skeleton
interface MagazineGridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
}

export const MagazineGridSkeleton = memo<MagazineGridSkeletonProps>(({
  count = 6,
  columns = 3,
}) => {
  const items = useMemo(() => 
    Array.from({ length: count }, (_, index) => (
      <MagazineCardSkeleton key={index} />
    )), [count]
  );

  const gridClasses = useMemo(() => {
    switch (columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  }, [columns]);

  return (
    <div className={`grid ${gridClasses} gap-6`}>
      {items}
    </div>
  );
});

MagazineGridSkeleton.displayName = 'MagazineGridSkeleton';

// Page header skeleton
export const PageHeaderSkeleton = memo(() => (
  <div className="space-y-4 mb-8">
    <SkeletonTitle className="h-8 w-1/3" />
    <div className="space-y-2">
      <SkeletonText className="w-full" />
      <SkeletonText className="w-4/5" />
    </div>
  </div>
));

PageHeaderSkeleton.displayName = 'PageHeaderSkeleton';

// Search results skeleton
export const SearchResultsSkeleton = memo(() => (
  <div className="space-y-4">
    {Array.from({ length: 5 }, (_, index) => (
      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <SkeletonTitle className="mb-2" />
        <div className="space-y-2">
          <SkeletonText />
          <SkeletonText className="w-3/4" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <SkeletonText className="w-24 h-3" />
          <SkeletonText className="w-20 h-3" />
        </div>
      </div>
    ))}
  </div>
));

SearchResultsSkeleton.displayName = 'SearchResultsSkeleton';

// Navigation skeleton
export const NavigationSkeleton = memo(() => (
  <nav className="flex items-center justify-between h-16 px-4">
    <SkeletonText className="w-32 h-8" />
    <div className="hidden md:flex space-x-6">
      {Array.from({ length: 4 }, (_, index) => (
        <SkeletonText key={index} className="w-20 h-4" />
      ))}
    </div>
    <SkeletonButton className="w-20" />
  </nav>
));

NavigationSkeleton.displayName = 'NavigationSkeleton';

// Footer skeleton
export const FooterSkeleton = memo(() => (
  <footer className="bg-gray-100 dark:bg-gray-800 mt-12">
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="space-y-4">
            <SkeletonTitle className="h-5" />
            <div className="space-y-2">
              {Array.from({ length: 4 }, (_, idx) => (
                <SkeletonText key={idx} className="h-3" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-6">
        <SkeletonText className="w-64 h-3 mx-auto" />
      </div>
    </div>
  </footer>
));

FooterSkeleton.displayName = 'FooterSkeleton';

// PDF viewer skeleton
export const PDFViewerSkeleton = memo(() => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <SkeletonButton className="w-24" />
      <div className="flex items-center space-x-2">
        <SkeletonButton className="w-8 h-8" />
        <SkeletonText className="w-16 h-6" />
        <SkeletonButton className="w-8 h-8" />
      </div>
      <SkeletonButton className="w-20" />
    </div>
    <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
      <LoadingSpinner size="xl" />
    </div>
  </div>
));

PDFViewerSkeleton.displayName = 'PDFViewerSkeleton';

// Category filter skeleton
export const CategoryFilterSkeleton = memo(() => (
  <div className="flex flex-wrap gap-2">
    {Array.from({ length: 6 }, (_, index) => (
      <SkeletonButton key={index} className={`h-8 ${
        index === 0 ? 'w-20' : `w-${16 + (index % 3) * 4}`
      }`} />
    ))}
  </div>
));

CategoryFilterSkeleton.displayName = 'CategoryFilterSkeleton';

// Progressive loading component
interface ProgressiveLoadingProps {
  isLoading: boolean;
  hasData: boolean;
  error?: Error | null;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  errorState?: React.ReactNode;
  retryAction?: () => void;
}

export const ProgressiveLoading = memo<ProgressiveLoadingProps>(({
  isLoading,
  hasData,
  error,
  skeleton,
  children,
  emptyState,
  errorState,
  retryAction,
}) => {
  if (error) {
    return (
      <>
        {errorState || (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              حدث خطأ في التحميل
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error.message || 'حدث خطأ غير متوقع'}
            </p>
            {retryAction && (
              <button
                onClick={retryAction}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                إعادة المحاولة
              </button>
            )}
          </div>
        )}
      </>
    );
  }

  if (isLoading) {
    return <>{skeleton}</>;
  }

  if (!hasData) {
    return (
      <>
        {emptyState || (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              لا توجد بيانات
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              لم يتم العثور على أي محتوى للعرض
            </p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
});

ProgressiveLoading.displayName = 'ProgressiveLoading';

export default {
  LoadingSpinner,
  LoadingOverlay,
  SkeletonText,
  SkeletonTitle,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonButton,
  MagazineCardSkeleton,
  MagazineGridSkeleton,
  PageHeaderSkeleton,
  SearchResultsSkeleton,
  NavigationSkeleton,
  FooterSkeleton,
  PDFViewerSkeleton,
  CategoryFilterSkeleton,
  ProgressiveLoading,
};
