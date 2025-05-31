'use client';

import React, { memo, Suspense, lazy, useCallback, useMemo } from 'react';
import { AnimatedMagazineCard, AnimatedGrid, AnimatedSearchBar, AnimatedNavigation } from './AnimatedComponents';
import { AccessibleMagazineCard, AccessibleGrid, AccessibleSearch, FocusManager } from './AccessibilityEnhancements';
import { Motion, Stagger } from './AnimationSystem';
import { LoadingSpinner } from './AccessibilityComponents';
import { MagazineCardSkeleton, MagazineGridSkeleton } from './LoadingStates';

// Lazy load heavy components
const LazyPDFViewer = lazy(() => import('@/components/pdf/PDFViewerSection'));
const LazyPerformanceMonitor = lazy(() => import('./EnhancedPerformanceMonitor'));

// Integrated Magazine Grid with animations and accessibility
interface IntegratedMagazineGridProps {
  issues: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    coverImage?: string;
    pdfUrl?: string;
    fileSize?: string;
    pageCount?: number;
  }>;
  onIssueView: (id: string) => void;
  onIssueDownload?: (id: string) => void;
  locale: string;
  isLoading?: boolean;
  columns?: number;
  readNowText?: string;
  enableAnimations?: boolean;
  enableAccessibilityFeatures?: boolean;
}

export const IntegratedMagazineGrid = memo<IntegratedMagazineGridProps>(({
  issues,
  onIssueView,
  onIssueDownload,
  locale,
  isLoading = false,
  columns = 3,
  readNowText = locale === 'ar' ? 'اقرأ الآن' : 'Read Now',
  enableAnimations = true,
  enableAccessibilityFeatures = true
}) => {
  const isArabic = locale === 'ar';

  const handleIssueView = useCallback((id: string) => {
    onIssueView(id);
  }, [onIssueView]);

  const handleIssueDownload = useCallback((id: string) => {
    onIssueDownload?.(id);
  }, [onIssueDownload]);

  // Loading state
  if (isLoading) {
    return (
      <MagazineGridSkeleton 
        count={6} 
        columns={columns}
      />
    );
  }

  // Empty state
  if (issues.length === 0) {
    return (
      <Motion preset="fadeIn" className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 text-gray-300" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          {isArabic ? 'لا توجد مجلات متاحة' : 'No magazines available'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {isArabic ? 'تحقق مرة أخرى لاحقاً للحصول على محتوى جديد' : 'Check back later for new content'}
        </p>
      </Motion>
    );
  }

  // Choose between animated or accessible components based on preferences
  const MagazineCard = enableAccessibilityFeatures ? AccessibleMagazineCard : AnimatedMagazineCard;
  const GridContainer = enableAccessibilityFeatures ? AccessibleGrid : AnimatedGrid;

  return (
    <GridContainer
      columns={columns}
      gap={24}
      navigationLabel={isArabic ? 'شبكة المجلات' : 'Magazine grid'}
      locale={locale}
    >
      {issues.map((issue, index) => (
        <MagazineCard
          key={issue.id}
          issue={issue}
          onView={handleIssueView}
          onDownload={onIssueDownload ? handleIssueDownload : undefined}
          locale={locale}
          delay={enableAnimations ? index * 0.1 : 0}
          readNowText={readNowText}
        />
      ))}
    </GridContainer>
  );
});

IntegratedMagazineGrid.displayName = 'IntegratedMagazineGrid';

// Integrated Search with suggestions and accessibility
interface IntegratedSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  suggestions?: string[];
  isLoading?: boolean;
  locale: string;
  placeholder?: string;
  className?: string;
  enableAnimations?: boolean;
  enableAccessibilityFeatures?: boolean;
}

export const IntegratedSearch = memo<IntegratedSearchProps>(({
  value,
  onChange,
  onSubmit,
  suggestions = [],
  isLoading = false,
  locale,
  placeholder,
  className = '',
  enableAnimations = true,
  enableAccessibilityFeatures = true
}) => {
  const isArabic = locale === 'ar';
  
  const defaultPlaceholder = useMemo(() => 
    placeholder || (isArabic ? 'البحث في المجلات...' : 'Search magazines...'),
    [placeholder, isArabic]
  );

  if (enableAccessibilityFeatures) {
    return (
      <AccessibleSearch
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        suggestions={suggestions}
        isLoading={isLoading}
        locale={locale}
        placeholder={defaultPlaceholder}
        className={className}
      />
    );
  }

  return (
    <AnimatedSearchBar
      value={value}
      onChange={onChange}
      onSubmit={onSubmit}
      placeholder={defaultPlaceholder}
      isLoading={isLoading}
      className={className}
    />
  );
});

IntegratedSearch.displayName = 'IntegratedSearch';

// Integrated Page Header with animations
interface IntegratedPageHeaderProps {
  title: string;
  description?: string;
  locale: string;
  backgroundVariant?: 'gradient' | 'solid' | 'image';
  enableAnimations?: boolean;
  children?: React.ReactNode;
}

export const IntegratedPageHeader = memo<IntegratedPageHeaderProps>(({
  title,
  description,
  locale,
  backgroundVariant = 'gradient',
  enableAnimations = true,
  children
}) => {
  const isArabic = locale === 'ar';

  const backgroundClasses = useMemo(() => {
    switch (backgroundVariant) {
      case 'gradient':
        return 'bg-gradient-to-r from-emerald-700 to-emerald-900';
      case 'solid':
        return 'bg-emerald-800';
      case 'image':
        return 'bg-emerald-800 bg-cover bg-center';
      default:
        return 'bg-gradient-to-r from-emerald-700 to-emerald-900';
    }
  }, [backgroundVariant]);

  const HeaderContent = enableAnimations ? Motion : 'div';
  const headerProps = enableAnimations ? { preset: 'fadeIn' as const } : {};

  return (
    <section 
      className={`${backgroundClasses} text-white py-16 rounded-lg shadow-lg mb-8`}
      aria-labelledby="page-heading"
    >
      <div className="container mx-auto px-4">
        <HeaderContent {...headerProps}>
          <div className="text-center max-w-4xl mx-auto">
            <Motion 
              preset={enableAnimations ? 'slideInUp' : 'fadeIn'} 
              delay={enableAnimations ? 0.2 : 0}
            >
              <h1 
                id="page-heading" 
                className="text-4xl md:text-5xl font-bold mb-4"
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                {title}
              </h1>
            </Motion>
            
            {description && (
              <Motion 
                preset={enableAnimations ? 'slideInUp' : 'fadeIn'} 
                delay={enableAnimations ? 0.4 : 0}
              >
                <p 
                  className="text-xl text-emerald-100 max-w-2xl mx-auto"
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {description}
                </p>
              </Motion>
            )}
            
            {children && (
              <Motion 
                preset={enableAnimations ? 'slideInUp' : 'fadeIn'} 
                delay={enableAnimations ? 0.6 : 0}
                className="mt-8"
              >
                {children}
              </Motion>
            )}
          </div>
        </HeaderContent>
      </div>
    </section>
  );
});

IntegratedPageHeader.displayName = 'IntegratedPageHeader';

// Integrated PDF Viewer Section with enhanced loading
interface IntegratedPDFViewerProps {
  pdfUrl: string;
  title: string;
  messages: any;
  locale: string;
  enablePerformanceMonitoring?: boolean;
  className?: string;
}

export const IntegratedPDFViewer = memo<IntegratedPDFViewerProps>(({
  pdfUrl,
  title,
  messages,
  locale,
  enablePerformanceMonitoring = false,
  className = ''
}) => {
  const isArabic = locale === 'ar';

  return (
    <section 
      id="pdf-viewer" 
      className={`py-8 ${className}`}
      aria-labelledby="pdf-viewer-heading"
    >
      <FocusManager restoreFocus>
        <Motion preset="fadeIn">
          <h2 id="pdf-viewer-heading" className="sr-only">
            {isArabic ? 'عارض المجلة' : 'Magazine Viewer'}
          </h2>
          
          <Suspense fallback={
            <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg">
              <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-gray-700">
                    {isArabic ? 'تحميل عارض PDF' : 'Loading PDF Viewer'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {isArabic ? 'يرجى الانتظار أثناء إعداد المستند...' : 'Please wait while we prepare your document...'}
                  </p>
                </div>
              </div>
            </div>
          }>
            <LazyPDFViewer 
              pdfUrl={pdfUrl}
              title={title}
              messages={messages}
            />
          </Suspense>
          
          {enablePerformanceMonitoring && (
            <Suspense fallback={null}>
              <LazyPerformanceMonitor />
            </Suspense>
          )}
        </Motion>
      </FocusManager>
    </section>
  );
});

IntegratedPDFViewer.displayName = 'IntegratedPDFViewer';

// Integrated Category Navigation
interface Category {
  id: string;
  name: string;
  count?: number;
  description?: string;
}

interface IntegratedCategoryNavProps {
  categories: Category[];
  locale: string;
  title?: string;
  browseCategoryText?: string;
  enableAnimations?: boolean;
  className?: string;
}

export const IntegratedCategoryNav = memo<IntegratedCategoryNavProps>(({
  categories,
  locale,
  title,
  browseCategoryText,
  enableAnimations = true,
  className = ''
}) => {
  const isArabic = locale === 'ar';

  const defaultTitle = useMemo(() => 
    title || (isArabic ? 'تصفح حسب التصنيف' : 'Browse by Category'),
    [title, isArabic]
  );

  const defaultBrowseText = useMemo(() => 
    browseCategoryText || (isArabic ? 'تصفح التصنيف' : 'Browse Category'),
    [browseCategoryText, isArabic]
  );

  if (categories.length === 0) {
    return null;
  }

  return (
    <section 
      id="categories"
      className={`py-12 bg-gray-50 dark:bg-gray-900 rounded-lg ${className}`}
      aria-labelledby="categories-heading"
    >
      <div className="container mx-auto px-4">
        <Motion 
          preset={enableAnimations ? 'slideInUp' : 'fadeIn'}
          delay={enableAnimations ? 0.2 : 0}
        >
          <h2 
            id="categories-heading" 
            className="text-3xl font-bold mb-8 text-center text-emerald-800 dark:text-emerald-400"
            dir={isArabic ? 'rtl' : 'ltr'}
          >
            {defaultTitle}
          </h2>
        </Motion>
        
        <AnimatedGrid
          columns={4}
          gap={16}
          staggerDelay={enableAnimations ? 0.1 : 0}
        >
          {categories.map((category, index) => (
            <Motion
              key={category.id}
              preset={enableAnimations ? 'slideInUp' : 'fadeIn'}
              delay={enableAnimations ? index * 0.1 : 0}
              custom={{
                hover: {
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }
              }}
            >
              <a
                href={`/${locale}/magazine/category/${category.id}`}
                className={`
                  block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
                  p-6 rounded-lg text-center shadow-sm hover:shadow-md transition-all
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
                  group
                `}
                aria-label={`${defaultBrowseText}: ${category.name}${category.count ? ` (${category.count} ${isArabic ? 'عنصر' : 'items'})` : ''}`}
                dir={isArabic ? 'rtl' : 'ltr'}
              >
                <h3 className="font-medium text-emerald-900 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                  {category.name}
                  {category.count && (
                    <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {category.count} {isArabic ? 'عنصر' : 'items'}
                    </span>
                  )}
                </h3>
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    {category.description}
                  </p>
                )}
              </a>
            </Motion>
          ))}
        </AnimatedGrid>
      </div>
    </section>
  );
});

IntegratedCategoryNav.displayName = 'IntegratedCategoryNav';

// Enhanced Header Navigation with animations
interface IntegratedHeaderNavProps {
  navItems: Array<{
    href: string;
    label: string;
    isActive?: boolean;
    icon?: React.ReactNode;
  }>;
  locale: string;
  enableAnimations?: boolean;
  className?: string;
}

export const IntegratedHeaderNav = memo<IntegratedHeaderNavProps>(({
  navItems,
  locale,
  enableAnimations = true,
  className = ''
}) => {
  if (enableAnimations) {
    return (
      <AnimatedNavigation
        items={navItems}
        locale={locale}
        variant="header"
        className={className}
      />
    );
  }

  return (
    <nav className={`flex space-x-6 rtl:space-x-reverse ${className}`} role="navigation">
      {navItems.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          className={`
            flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${item.isActive 
              ? 'text-emerald-600 bg-emerald-50' 
              : 'text-gray-700 hover:text-emerald-600 hover:bg-emerald-50'
            }
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          `}
          aria-current={item.isActive ? 'page' : undefined}
        >
          {item.icon && (
            <span className="mr-2 rtl:ml-2 rtl:mr-0" aria-hidden="true">
              {item.icon}
            </span>
          )}
          {item.label}
        </a>
      ))}
    </nav>
  );
});

IntegratedHeaderNav.displayName = 'IntegratedHeaderNav';

export {
  IntegratedMagazineGrid,
  IntegratedSearch,
  IntegratedPageHeader,
  IntegratedPDFViewer,
  IntegratedCategoryNav,
  IntegratedHeaderNav
};
