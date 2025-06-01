'use client';

import React, { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Motion, MorphingButton } from './AnimationSystem';

// Enhanced Focus Management
interface FocusManagerProps {
  children: React.ReactNode;
  trapFocus?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
}

export const FocusManager = memo<FocusManagerProps>(({
  children,
  trapFocus = false,
  restoreFocus = true,
  autoFocus = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!trapFocus || e.key !== 'Tab') return;

      const focusableElements = containerRef.current?.querySelectorAll(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (trapFocus) {
        document.removeEventListener('keydown', handleKeyDown);
      }
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [trapFocus, restoreFocus, autoFocus]);

  return (
    <div ref={containerRef} role="region">
      {children}
    </div>
  );
});

FocusManager.displayName = 'FocusManager';

// Enhanced Live Region for Screen Readers
interface LiveRegionProps {
  message: string;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'text' | 'all' | 'additions text' | 'additions' | 'additions removals' | 'removals' | 'removals additions' | 'removals text' | 'text additions' | 'text removals';
  busy?: boolean;
}

export const LiveRegion = memo<LiveRegionProps>(({
  message,
  politeness = 'polite',
  atomic = true,
  relevant = 'additions text',
  busy = false
}) => (
  <div
    aria-live={politeness}
    aria-atomic={atomic}
    aria-relevant={relevant}
    aria-busy={busy}
    className="sr-only"
  >
    {message}
  </div>
));

LiveRegion.displayName = 'LiveRegion';

// Enhanced Keyboard Navigation Hook
export function useKeyboardNavigation(
  items: string[],
  onSelect: (index: number) => void,
  orientation: 'horizontal' | 'vertical' = 'vertical',
  wrap = true
) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const { key } = e;
    let newIndex = activeIndex;

    switch (key) {
      case 'ArrowDown':
        if (orientation === 'vertical') {
          e.preventDefault();
          newIndex = wrap ? (activeIndex + 1) % items.length : Math.min(activeIndex + 1, items.length - 1);
        }
        break;
      case 'ArrowUp':
        if (orientation === 'vertical') {
          e.preventDefault();
          newIndex = wrap ? (activeIndex - 1 + items.length) % items.length : Math.max(activeIndex - 1, 0);
        }
        break;
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          e.preventDefault();
          newIndex = wrap ? (activeIndex + 1) % items.length : Math.min(activeIndex + 1, items.length - 1);
        }
        break;
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          e.preventDefault();
          newIndex = wrap ? (activeIndex - 1 + items.length) % items.length : Math.max(activeIndex - 1, 0);
        }
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = items.length - 1;
        break;
      case 'Enter':
      case ' ':
        if (activeIndex >= 0) {
          e.preventDefault();
          onSelect(activeIndex);
        }
        break;
    }

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, items.length, onSelect, orientation, wrap]);

  return { activeIndex, setActiveIndex, handleKeyDown };
}

// Enhanced Magazine Card with Full Accessibility
interface AccessibleMagazineCardProps {
  issue: {
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    fileSize?: string;
    pageCount?: number;
  };
  onView: (id: string) => void;
  onDownload?: (id: string) => void;
  locale: string;
  delay?: number;
}

export const AccessibleMagazineCard = memo<AccessibleMagazineCardProps>(({
  issue,
  onView,
  onDownload,
  locale,
  delay = 0
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const isArabic = locale === 'ar';

  const handleView = useCallback(() => {
    // onView(issue.id);
    setAnnouncement(
      isArabic 
        ? `فتح العدد: ${issue.title}` 
        : `Opening issue: ${issue.title}`
    );
  }, [issue.id, issue.title, onView, isArabic]);
  const handleDownload = useCallback(() => {
    // onDownload?.(issue.id);
    setAnnouncement(
      isArabic 
        ? `تم بدء تحميل: ${issue.title}` 
        : `Download started: ${issue.title}`
    );
  }, [issue.id, issue.title, onDownload, isArabic]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsPressed(true);
      handleView();
    }
  }, [handleView]);

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(false);
    }
  }, []);

  const ariaLabel = useMemo(() => {
    const parts = [
      issue.title,
      issue.category,
      issue.date,
      issue.fileSize && `${isArabic ? 'حجم الملف' : 'File size'}: ${issue.fileSize}`,
      issue.pageCount && `${isArabic ? 'عدد الصفحات' : 'Pages'}: ${issue.pageCount}`
    ].filter(Boolean);

    return parts.join(', ');
  }, [issue, isArabic]);

  return (
    <>
      <Motion
        preset="slideInUp"
        delay={delay}
        custom={{
          hover: {
            y: -8,
            scale: 1.02,
            transition: { duration: 0.3, ease: 'easeOut' }
          }
        }}
        className={`
          bg-white  rounded-xl overflow-hidden shadow-lg 
          border border-gray-100  cursor-pointer
          focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2
          ${isPressed ? 'transform scale-95' : ''}
        `}
      >
        <div
          onClick={handleView}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          tabIndex={0}
          role="button"
          aria-label={ariaLabel}
          aria-describedby={`issue-details-${issue.id}`}
          className="w-full h-full focus:outline-none"
        >
        {/* Cover Image Section */}
          <div className="relative aspect-[3/4] w-full max-h-[400px] bg-gradient-to-br from-emerald-100 to-emerald-200">          
          <Motion
            preset="scaleIn"
            delay={delay + 0.2}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-20 h-20 text-emerald-600 " aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
            </div>
          </Motion>
          
          {/* Category Badge */}          
          <Motion
            preset="slideInRight"
            delay={delay + 0.3}
            className="absolute top-3 right-3"
          >
            <span 
              className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium"
              aria-label={`${isArabic ? 'التصنيف' : 'Category'}: ${issue.category}`}
            >
              {issue.category}
            </span>
          </Motion>
        </div>

        {/* Content Section */}
        <div className="p-6">
          <Motion preset="slideInUp" delay={delay + 0.4}>
            <h3 
                className="font-bold text-xl mb-3 text-gray-900 line-clamp-1"
              id={`issue-title-${issue.id}`}
            >
              {issue.title}
            </h3>
          </Motion>
          
          <Motion preset="slideInUp" delay={delay + 0.5}>
            <p 
              className="text-gray-600  text-sm mb-3 flex items-center"
              id={`issue-details-${issue.id}`}
            >
              <svg className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <time dateTime={issue.date}>{issue.date}</time>
            </p>
          </Motion>
          
          <Motion preset="slideInUp" delay={delay + 0.6}>
            <p className="text-gray-700  text-sm mb-4 line-clamp-2">
              {issue.description}
            </p>
          </Motion>

          {/* Actions */}
          <Motion preset="slideInUp" delay={delay + 0.7}>
            <div className="flex gap-2 justify-between">
              <MorphingButton
                loading={false}
                onClick={handleView}
                aria-label={`${isArabic ? 'اقرأ العدد' : 'Read issue'}: ${issue.title}`}
              >
                <span className="flex items-center flex-row">
                <svg className="w-4 h-4 mr-1 rtl:ml-1 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {isArabic ? 'اقرأ' : 'Read'}
                </span>
              </MorphingButton>
              
              {onDownload && (
                <MorphingButton
                  loading={false}
                  onClick={handleDownload}
                  aria-label={`${isArabic ? 'تحميل العدد' : 'Download issue'}: ${issue.title}`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="sr-only">{isArabic ? 'تحميل' : 'Download'}</span>
                </MorphingButton>
              )}
            </div>
          </Motion>
        </div>
        </div>
      </Motion>

      {announcement && (
        <LiveRegion message={announcement} />
      )}
    </>
  );
});

AccessibleMagazineCard.displayName = 'AccessibleMagazineCard';

// Enhanced Grid with Keyboard Navigation
interface AccessibleGridProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
  navigationLabel?: string;
  locale?: string;
}

export const AccessibleGrid = memo<AccessibleGridProps>(({
  children,
  columns = 3,
  gap = 24,
  navigationLabel,
  locale = 'en'
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const isArabic = locale === 'ar';

  const itemIds = useMemo(() => 
    children.map((_, index) => `grid-item-${index}`),
    [children]
  );

  const { handleKeyDown } = useKeyboardNavigation(
    itemIds,
    (index) => {
      const item = gridRef.current?.querySelector(`[data-grid-index="${index}"]`) as HTMLElement;
      item?.focus();
      setFocusedIndex(index);
    },
    'horizontal',
    true
  );

  const gridClasses = useMemo(() => {
    const colClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return `grid ${colClass}`;
  }, [columns]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    grid.addEventListener('keydown', handleKeyDown);
    return () => grid.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      ref={gridRef}
      className={gridClasses}
      style={{ gap }}
      role="grid"
      aria-label={navigationLabel || (isArabic ? 'شبكة المحتوى' : 'Content grid')}
      tabIndex={-1}
    >
      {children.map((child, index) => (
        <div
          key={index}
          role="gridcell"
          data-grid-index={index}
          tabIndex={focusedIndex === index ? 0 : -1}
          aria-rowindex={Math.floor(index / columns) + 1}
          aria-colindex={(index % columns) + 1}
        >
          {child}
        </div>
      ))}
    </div>
  );
});

AccessibleGrid.displayName = 'AccessibleGrid';

// Accessible Search with Live Results
interface AccessibleSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  isLoading?: boolean;
  locale?: string;
  className?: string;
}

export const AccessibleSearch = memo<AccessibleSearchProps>(({
  value,
  onChange,
  onSubmit,
  placeholder,
  suggestions = [],
  isLoading = false,
  locale = 'en',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const isArabic = locale === 'ar';
  const searchId = useMemo(() => `search-${Math.random().toString(36).substring(2, 9)}`, []);
  const listId = useMemo(() => `${searchId}-suggestions`, [searchId]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && value.trim()) {
      onSubmit(value.trim());
      setIsExpanded(false);
      setAnnouncement(
        isArabic 
          ? `البحث عن: ${value.trim()}` 
          : `Searching for: ${value.trim()}`
      );
    }
  }, [onSubmit, value, isArabic]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setActiveSuggestion(-1);
    setIsExpanded(newValue.length > 0 && suggestions.length > 0);
  }, [onChange, suggestions.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isExpanded || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
          e.preventDefault();
          onChange(suggestions[activeSuggestion]);
          setIsExpanded(false);
          setActiveSuggestion(-1);
        }
        break;
      case 'Escape':
        setIsExpanded(false);
        setActiveSuggestion(-1);
        break;
    }
  }, [isExpanded, suggestions, activeSuggestion, onChange]);

  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    setIsExpanded(false);
    setActiveSuggestion(-1);
    inputRef.current?.focus();
  }, [onChange]);

  useEffect(() => {
    if (suggestions.length > 0) {
      setAnnouncement(
        isArabic 
          ? `${suggestions.length} اقتراحات متاحة` 
          : `${suggestions.length} suggestions available`
      );
    }
  }, [suggestions.length, isArabic]);

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`
              w-full sm:px-4 px-2 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 
              rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500
                
              ${isArabic ? 'text-right' : 'text-left'}
            `}
            aria-label={placeholder}
            aria-expanded={isExpanded}
            aria-haspopup="listbox"
            aria-controls={isExpanded ? listId : undefined}
            aria-activedescendant={
              activeSuggestion >= 0 ? `${listId}-option-${activeSuggestion}` : undefined
            }
            autoComplete="off"
            dir={isArabic ? 'rtl' : 'ltr'}
          />
          
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isLoading ? (
              <div className="animate-spin h-5 w-5 text-gray-400" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"/>
                  <path d="M12,2A10,10,0,0,1,22,12H20A8,8,0,0,0,12,4Z">
                    <animateTransform attributeName="transform" type="rotate" dur="1s" values="0 12 12;360 12 12" repeatCount="indefinite"/>
                  </path>
                </svg>
              </div>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>

        {/* Search Suggestions */}
        {isExpanded && suggestions.length > 0 && (          <Motion
            preset="slideInDown"
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg  "
          >
            <ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-label={isArabic ? 'اقتراحات البحث' : 'Search suggestions'}
            >
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion}
                  id={`${listId}-option-${index}`}
                  role="option"
                  aria-selected={index === activeSuggestion}
                  className={`
                    sm:px-4 px-2 py-2 cursor-pointer text-gray-900 
                    ${index === activeSuggestion 
                      ? 'bg-emerald-100 ' 
                      : 'hover:bg-gray-100 :bg-gray-700'
                    }
                    ${index === 0 ? 'rounded-t-lg' : ''}
                    ${index === suggestions.length - 1 ? 'rounded-b-lg' : ''}
                  `}
                  onClick={() => handleSuggestionClick(suggestion)}
                  dir={isArabic ? 'rtl' : 'ltr'}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </Motion>
        )}
      </form>

      {announcement && (
        <LiveRegion message={announcement} />
      )}
    </div>
  );
});

AccessibleSearch.displayName = 'AccessibleSearch';
