'use client';

import React, { memo, useState, useCallback, useMemo } from 'react';
import { Motion, Stagger, MorphingButton, LoadingAnimation } from './AnimationSystem';
import { useCSSOptimization } from '@/utils/css-optimization';

// Enhanced Magazine Card with animations
interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  coverImage?: string;
  pdfUrl?: string;
}

interface AnimatedMagazineCardProps {
  issue: MagazineIssue;
  readNowText: string;
  onReadClick?: (id: string) => void;
  delay?: number;
}

export const AnimatedMagazineCard = memo<AnimatedMagazineCardProps>(({ 
  issue, 
  readNowText, 
  onReadClick,
  delay = 0
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { trackClass } = useCSSOptimization();

  const handleClick = useCallback(async () => {
    if (onReadClick) {
      setIsLoading(true);
      try {
        await onReadClick(issue.id);
      } finally {
        setIsLoading(false);
      }
    }
  }, [issue.id, onReadClick]);

  const cardClasses = useMemo(() => {
    trackClass('magazine-card-animated');
    trackClass('magazine-card-hovered');
    return `
      bg-white  rounded-xl overflow-hidden shadow-lg border border-gray-100 
      transition-all duration-300 cursor-pointer group
      ${isHovered ? 'magazine-card-hovered' : ''}
    `;
  }, [isHovered, trackClass]);
  return (
    <Motion
      preset="slideInUp"
      delay={delay}
      custom={{
        hover: {
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          transition: { duration: 0.3, ease: 'easeOut' }
        }
      }}
      className={cardClasses}
      role="article"
      aria-label={`${readNowText} - ${issue.title}`}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-full"
      >
      {/* Cover Image Section */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald-100 to-emerald-200  ">
        <Motion
          preset="scaleIn"
          delay={delay + 0.2}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-20 h-20 text-emerald-600 ">
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
          <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {issue.category}
          </span>
        </Motion>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <Motion
          preset="slideInUp"
          delay={delay + 0.4}
        >
          <h3 
            id={`magazine-title-${issue.id}`}
            className="font-bold text-xl mb-3 text-gray-900  group-hover:text-emerald-600 :text-emerald-400 transition-colors"
          >
            {issue.title}
          </h3>
        </Motion>

        <Motion
          preset="slideInUp"
          delay={delay + 0.5}
        >
          <p className="text-gray-600  text-sm mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {issue.date}
          </p>
        </Motion>

        <Motion
          preset="slideInUp"
          delay={delay + 0.6}
        >
          <p className="text-gray-700  mb-5 line-clamp-3">
            {issue.description}
          </p>
        </Motion>

        <Motion
          preset="slideInUp"
          delay={delay + 0.7}
        >
          <MorphingButton
            loading={isLoading}
            onClick={handleClick}
            className="w-full"
            loadingText="جاري التحميل..."
          >
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {readNowText}
            </div>          
          </MorphingButton>
        </Motion>
      </div>
      </div>
    </Motion>
  );
});

AnimatedMagazineCard.displayName = 'AnimatedMagazineCard';

// Animated Grid Container
interface AnimatedGridProps {
  children: React.ReactNode[];
  columns?: number;
  gap?: number;
  staggerDelay?: number;
  className?: string;
}

export const AnimatedGrid = memo<AnimatedGridProps>(({
  children,
  columns = 3,
  gap = 24,
  staggerDelay = 0.1,
  className = ''
}) => {
  const { trackClass } = useCSSOptimization();

  const gridClasses = useMemo(() => {
    trackClass('animated-grid');
    const colClass = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return `animated-grid grid ${colClass} ${className}`;
  }, [columns, className, trackClass]);

  return (
    <Motion preset="fadeIn" className={gridClasses} style={{ gap }}>
      <Stagger staggerDelay={staggerDelay}>
        {children}
      </Stagger>
    </Motion>
  );
});

AnimatedGrid.displayName = 'AnimatedGrid';

// Animated Search Bar
interface AnimatedSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export const AnimatedSearchBar = memo<AnimatedSearchBarProps>(({
  value,
  onChange,
  onSubmit,
  placeholder = 'البحث...',
  isLoading = false,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { trackClass } = useCSSOptimization();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && value.trim()) {
      onSubmit(value.trim());
    }
  }, [onSubmit, value]);

  const containerClasses = useMemo(() => {
    trackClass('animated-search-bar');
    trackClass('animated-search-focused');
    return `
      animated-search-bar relative max-w-md mx-auto
      ${isFocused ? 'animated-search-focused' : ''}
      ${className}
    `;
  }, [isFocused, className, trackClass]);

  return (
    <Motion
      preset="slideInDown"
      custom={{
        hover: { scale: 1.02 },
        animate: isFocused ? { scale: 1.05 } : { scale: 1 }
      }}
      className={containerClasses}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`
              w-full px-4 py-3 pl-12 rtl:pr-12 rtl:pl-4 
              bg-white  
              border-2 border-gray-200 
              rounded-full text-gray-900 
              placeholder-gray-500 
              transition-all duration-300 ease-out
              focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20
              focus:outline-none
              ${isFocused ? 'shadow-lg shadow-emerald-500/10' : 'shadow-md'}
            `}
            dir="auto"
          />
          
          <div className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2">
            {isLoading ? (
              <LoadingAnimation type="spinner" size="sm" />
            ) : (
              <Motion
                custom={{
                  animate: isFocused ? { scale: 1.2, rotate: 90 } : { scale: 1, rotate: 0 }
                }}
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Motion>
            )}
          </div>

          {value && (
            <Motion
              preset="scaleIn"
              className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2"
            >
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1 text-gray-400 hover:text-gray-600 :text-gray-300 transition-colors"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </Motion>
          )}
        </div>

        {/* Submit button - hidden but functional for form submission */}
        <button type="submit" className="sr-only" aria-hidden="true">
          Search
        </button>
      </form>
    </Motion>
  );
});

AnimatedSearchBar.displayName = 'AnimatedSearchBar';

// Animated Navigation Menu
interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface AnimatedNavigationProps {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const AnimatedNavigation = memo<AnimatedNavigationProps>(({
  items,
  orientation = 'horizontal',
  className = ''
}) => {
  const { trackClass } = useCSSOptimization();

  const navClasses = useMemo(() => {
    trackClass('animated-navigation');
    trackClass(`animated-nav-${orientation}`);
    return `
      animated-navigation animated-nav-${orientation}
      ${orientation === 'horizontal' ? 'flex flex-row space-x-1 rtl:space-x-reverse' : 'flex flex-col space-y-1'}
      ${className}
    `;
  }, [orientation, className, trackClass]);

  return (
    <Motion preset="slideInUp" className={navClasses}>
      <Stagger staggerDelay={0.05}>
        {items.map((item) => (
          <Motion
            key={item.href}
            preset="slideInUp"
            custom={{
              hover: {
                scale: 1.05,
                y: -2,
                transition: { duration: 0.2 }
              }
            }}
          >
            <a
              href={item.href}
              className={`
                relative px-4 py-2 rounded-lg font-medium transition-all duration-300
                flex items-center space-x-2 rtl:space-x-reverse group
                ${item.isActive 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' 
                  : 'text-gray-700  hover:bg-gray-100 :bg-gray-700 hover:text-emerald-600 :text-emerald-400'
                }
              `}
            >
              {item.icon && (
                <span className="w-5 h-5 flex-shrink-0">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
              
              {/* Active indicator */}
              {item.isActive && (
                <Motion
                  preset="scaleIn"
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                >
                  <div></div>
                </Motion>
              )}
            </a>
          </Motion>
        ))}
      </Stagger>
    </Motion>
  );
});

AnimatedNavigation.displayName = 'AnimatedNavigation';

// Animated Loading States
interface AnimatedLoadingStateProps {
  type?: 'cards' | 'list' | 'grid';
  count?: number;
  className?: string;
}

export const AnimatedLoadingState = memo<AnimatedLoadingStateProps>(({
  type = 'cards',
  count = 6,
  className = ''
}) => {
  const { trackClass } = useCSSOptimization();

  const skeletonClasses = useMemo(() => {
    trackClass('animated-skeleton');
    return 'animated-skeleton animate-pulse bg-gray-200  rounded-lg';
  }, [trackClass]);

  const renderSkeleton = () => {
    if (type === 'cards') {
      return Array.from({ length: count }, (_, i) => (
        <Motion
          key={i}
          preset="fadeIn"
          delay={i * 0.1}
          className="space-y-4"
        >
          <div className={`${skeletonClasses} aspect-[3/4]`} />
          <div className={`${skeletonClasses} h-6 w-3/4`} />
          <div className={`${skeletonClasses} h-4 w-1/2`} />
          <div className={`${skeletonClasses} h-10 w-full`} />
        </Motion>
      ));
    }

    if (type === 'list') {
      return Array.from({ length: count }, (_, i) => (
        <Motion
          key={i}
          preset="slideInLeft"
          delay={i * 0.05}
          className="flex items-center space-x-4 rtl:space-x-reverse"
        >
          <div className={`${skeletonClasses} w-16 h-16 rounded-full flex-shrink-0`} />
          <div className="space-y-2 flex-1">
            <div className={`${skeletonClasses} h-5 w-3/4`} />
            <div className={`${skeletonClasses} h-4 w-1/2`} />
          </div>
        </Motion>
      ));
    }

    return Array.from({ length: count }, (_, i) => (
      <Motion
        key={i}
        preset="scaleIn"
        delay={i * 0.05}
        className={`${skeletonClasses} aspect-square`}
      >
        <div></div>
      </Motion>
    ));
  };

  return (
    <div className={className}>
      <Stagger staggerDelay={0.05}>
        {renderSkeleton()}
      </Stagger>
    </div>
  );
});

AnimatedLoadingState.displayName = 'AnimatedLoadingState';

export default {
  AnimatedMagazineCard,
  AnimatedGrid,
  AnimatedSearchBar,
  AnimatedNavigation,
  AnimatedLoadingState
};
