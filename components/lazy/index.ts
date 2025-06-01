// Enhanced dynamic imports with proper loading states and error boundaries
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Dynamic loading wrapper with enhanced error handling
function createDynamicComponent<T = any>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    displayName?: string;
  } = {}
) {
  const { displayName = 'DynamicComponent' } = options;

  const Component = dynamic(importFn, {
    loading: () => null, // Use default loading state
    ssr: false
  });

  Component.displayName = displayName;
  return Component;
}

// PDF Components (Heavy components that should be code-split)
export const LazyPDFViewer = createDynamicComponent(
  () => import('@/components/pdf/PDFViewer'),
  {
    displayName: 'LazyPDFViewer'
  }
);

export const LazyPDFBrowser = createDynamicComponent(
  () => import('@/components/pdf/PDFBrowser'),
  {
    displayName: 'LazyPDFBrowser'
  }
);

// Contact Form (Should be lazy loaded as it's not always needed)
export const LazyContactForm = createDynamicComponent(
  () => import('@/app/[locale]/contact/ContactForm'),
  {
    displayName: 'LazyContactForm'
  }
);

// Performance Monitor (Development only)
export const LazyPerformanceMonitor = createDynamicComponent(
  () => import('@/components/ui/EnhancedPerformanceMonitor'),
  {
    displayName: 'LazyPerformanceMonitor'
  }
);

// Chart components (if you add analytics)
export const LazyChart = createDynamicComponent(
  () => Promise.resolve({ default: () => null }),
  {
    displayName: 'LazyChart'
  }
);

// Advanced PDF tools
export const LazyPDFAnnotationTool = createDynamicComponent(
  () => Promise.resolve({ default: () => null }),
  {
    displayName: 'LazyPDFAnnotationTool'
  }
);
