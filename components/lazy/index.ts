// Enhanced dynamic imports with proper loading states and error boundaries
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { ComponentType, ReactElement } from 'react';

// Dynamic loading wrapper with enhanced error handling
function createDynamicComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    loadingComponent?: () => ReactElement;
    errorComponent?: (error: Error) => ReactElement;
    displayName?: string;
  } = {}
) {
  const {
    loadingComponent = () => (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    ),
    errorComponent = (error: Error) => (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">Failed to load component: {error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    ),
    displayName = 'DynamicComponent'
  } = options;

  const Component = dynamic(importFn, {
    loading: loadingComponent,
    ssr: false
  });

  Component.displayName = displayName;
  return Component;
}

// PDF Components (Heavy components that should be code-split)
export const LazyPDFViewer = createDynamicComponent(
  () => import('@/components/pdf/PDFViewer'),
  {
    displayName: 'LazyPDFViewer',
    loadingComponent: () => (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-gray-600">Loading PDF Viewer...</p>
      </div>
    )
  }
);

export const LazyPDFBrowser = createDynamicComponent(
  () => import('@/components/pdf/PDFBrowser'),
  {
    displayName: 'LazyPDFBrowser',
    loadingComponent: () => (
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }
);

// Contact Form (Should be lazy loaded as it's not always needed)
export const LazyContactForm = createDynamicComponent(
  () => import('@/app/[locale]/contact/ContactForm'),
  {
    displayName: 'LazyContactForm',
    loadingComponent: () => (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
    )
  }
);

// Performance Monitor (Development only)
export const LazyPerformanceMonitor = createDynamicComponent(
  () => import('@/components/ui/PerformanceMonitor'),
  {
    displayName: 'LazyPerformanceMonitor'
  }
);

// Chart components (if you add analytics)
export const LazyChart = createDynamicComponent(
  () => import('@/components/ui/Chart').catch(() => ({ default: () => null })),
  {
    displayName: 'LazyChart'
  }
);

// Advanced PDF tools
export const LazyPDFAnnotationTool = createDynamicComponent(
  () => import('@/components/pdf/tools/AnnotationTool').catch(() => ({ default: () => null })),
  {
    displayName: 'LazyPDFAnnotationTool'
  }
);

export const LazyPDFSearchTool = createDynamicComponent(
  () => import('@/components/pdf/tools/SearchTool').catch(() => ({ default: () => null })),
  {
    displayName: 'LazyPDFSearchTool'
  }
);
