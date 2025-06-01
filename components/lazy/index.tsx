// Enhanced dynamic imports with proper loading states and error boundaries
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Dynamic loading wrapper with enhanced error handling
function createDynamicComponent<T extends Record<string, any>>(
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

export const LazyPDFViewerSection = createDynamicComponent(
  () => import('@/components/pdf/PDFViewerSection'),
  {
    displayName: 'LazyPDFViewerSection'
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
  () => import('@/components/ui/PerformanceMonitor').then(module => ({ default: module.PerformanceMonitor })),
  {
    displayName: 'LazyPerformanceMonitor'
  }
);
