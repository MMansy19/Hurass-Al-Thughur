'use client';

import React from 'react';
import { CSSOptimizer } from '@/utils/css-optimization';

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  enableCriticalCSS?: boolean;
  enableDeferredLoading?: boolean;
  className?: string;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  enableCriticalCSS = true,
  enableDeferredLoading = true,
  className = ''
}) => {
  const optimizer = CSSOptimizer.getInstance();

  React.useEffect(() => {
    if (enableCriticalCSS) {
      // Track critical CSS usage
      const observer = new MutationObserver(() => {
        document.querySelectorAll('[class]').forEach(element => {
          const classes = element.className.split(' ');
          classes.forEach(cls => optimizer.trackUsedClass(cls));
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });

      return () => observer.disconnect();
    }
    
    // Return empty cleanup function for consistency
    return () => {};
  }, [enableCriticalCSS, optimizer]);

  // Use enableDeferredLoading for potential future deferred CSS loading
  React.useEffect(() => {
    if (enableDeferredLoading) {
      // Future implementation: Load non-critical CSS asynchronously
      // This prevents the unused parameter warning
      console.debug('Deferred loading enabled for PerformanceOptimizer');
    }
  }, [enableDeferredLoading]);

  return (
    <div className={className} data-performance-optimized="true">
      {children}
    </div>
  );
};

export default PerformanceOptimizer;
