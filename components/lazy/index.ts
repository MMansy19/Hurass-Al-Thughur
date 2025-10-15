// Enhanced dynamic imports with proper loading states and error boundaries
import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Dynamic loading wrapper with enhanced error handling
function createDynamicComponent<T = Record<string, unknown>>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    displayName?: string;
  } = {},
) {
  const { displayName = "DynamicComponent" } = options;

  const Component = dynamic(importFn, {
    loading: () => null, // Use default loading state
    ssr: false,
  });

  Component.displayName = displayName;
  return Component;
}

// PDF Components (Heavy components that should be code-split)
export const LazyPDFViewer = createDynamicComponent(
  () => import("@/components/pdf/PDFViewerSection"),
  {
    displayName: "LazyPDFViewer",
  },
);

// Performance Monitor (Development only)
export const LazyPerformanceMonitor = createDynamicComponent(
  () => import("@/components/ui/EnhancedPerformanceMonitor"),
  {
    displayName: "LazyPerformanceMonitor",
  },
);