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
  }, [enableCriticalCSS, optimizer]);

  return (
    <div className={className} data-performance-optimized="true">
      {children}
    </div>
  );
};

export default PerformanceOptimizer;
