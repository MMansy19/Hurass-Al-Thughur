'use client';

import { useEffect, useCallback } from 'react';

// Web Vitals monitoring
export function useWebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Monitor Core Web Vitals
    const reportWebVitals = (metric: any) => {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Web Vital:', metric);
      }

      // Send to analytics service in production
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to Google Analytics
        if (typeof gtag !== 'undefined') {
          gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          });
        }
      }
    };

    // Import web-vitals dynamically to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportWebVitals);
      getFID(reportWebVitals);
      getFCP(reportWebVitals);
      getLCP(reportWebVitals);
      getTTFB(reportWebVitals);
    }).catch(() => {
      // Silently fail if web-vitals is not available
    });
  }, []);
}

// Performance observer for long tasks
export function useLongTaskMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 50) { // Tasks longer than 50ms
          console.warn('Long task detected:', {
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // PerformanceObserver not supported
    }

    return () => {
      observer.disconnect();
    };
  }, []);
}

// Memory usage monitoring
export function useMemoryMonitoring() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const memoryUsage = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
        };

        // Warn if memory usage is high
        if (memoryUsage.used / memoryUsage.limit > 0.9) {
          console.warn('High memory usage detected:', memoryUsage);
        }

        if (process.env.NODE_ENV === 'development') {
          console.log('Memory usage:', memoryUsage);
        }
      }
    };

    // Check memory usage every 30 seconds
    const interval = setInterval(checkMemory, 30000);
    checkMemory(); // Initial check

    return () => clearInterval(interval);
  }, []);
}

// Image loading performance
export function useImagePerformance() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('.jpg') || entry.name.includes('.png') || entry.name.includes('.webp')) {
          const loadTime = entry.responseEnd - entry.requestStart;
          if (loadTime > 1000) { // Images taking longer than 1 second
            console.warn('Slow image loading:', {
              url: entry.name,
              loadTime: loadTime,
              size: entry.transferSize
            });
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Observer not supported
    }

    return () => {
      observer.disconnect();
    };
  }, []);
}

// Bundle size monitoring
export function useBundleAnalysis() {
  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') return;

    // Report the size of loaded JavaScript bundles
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.name.includes('.js') && entry.transferSize) {
          const sizeKB = Math.round(entry.transferSize / 1024);
          if (sizeKB > 100) { // Bundles larger than 100KB
            console.warn('Large JavaScript bundle:', {
              url: entry.name,
              size: `${sizeKB}KB`,
              loadTime: entry.responseEnd - entry.requestStart
            });
          }
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Observer not supported
    }

    return () => {
      observer.disconnect();
    };
  }, []);
}

// Comprehensive performance monitoring hook
export function usePerformanceMonitoring() {
  useWebVitals();
  useLongTaskMonitoring();
  useMemoryMonitoring();
  useImagePerformance();
  useBundleAnalysis();
}

// Performance metrics component
export function PerformanceMonitor() {
  usePerformanceMonitoring();
  return null; // This component doesn't render anything
}

// Resource hints helpers
export function preloadCriticalResources() {
  if (typeof document === 'undefined') return;

  // Preload critical fonts
  const fontLinks = [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    { href: '/fonts/arabic-font.woff2', as: 'font', type: 'font/woff2' },
  ];

  fontLinks.forEach(({ href, as, type }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    link.type = type;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/images/logo.webp',
    '/images/hero-background.webp',
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
  });
}

// Prefetch resources for next navigation
export function prefetchNextPage(href: string) {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Critical CSS inlining utility
export function inlineCriticalCSS(css: string) {
  if (typeof document === 'undefined') return;

  const style = document.createElement('style');
  style.innerHTML = css;
  style.setAttribute('data-critical', 'true');
  document.head.appendChild(style);
}
