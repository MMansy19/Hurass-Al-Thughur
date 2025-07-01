/**
 * Performance monitoring utilities for PDF viewer
 */

import { DEVICE_BREAKPOINTS, CONNECTION_TYPES, getPerformancePreset } from '../config/optimization';

interface PerformanceMetrics {
  documentLoadTime?: number;
  pageRenderTime?: number;
  totalLoadTime?: number;
  memoryUsage?: number;
}

class PDFPerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private startTimes: Map<string, number> = new Map();

  startTimer(name: string): void {
    this.startTimes.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.startTimes.delete(name);
    
    // Store the metric
    switch (name) {
      case 'documentLoad':
        this.metrics.documentLoadTime = duration;
        break;
      case 'pageRender':
        this.metrics.pageRenderTime = duration;
        break;
      case 'totalLoad':
        this.metrics.totalLoadTime = duration;
        break;
    }
    
    return duration;
  }

  getMemoryUsage(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  }

  logMetrics(): void {
    if (process.env.NODE_ENV === 'development') {
      console.group('📊 PDF Performance Metrics');
      
      if (this.metrics.documentLoadTime) {
        console.log(`📄 Document Load: ${this.metrics.documentLoadTime.toFixed(2)}ms`);
      }
      
      if (this.metrics.pageRenderTime) {
        console.log(`🎨 Page Render: ${this.metrics.pageRenderTime.toFixed(2)}ms`);
      }
      
      if (this.metrics.totalLoadTime) {
        console.log(`⏱️ Total Load Time: ${this.metrics.totalLoadTime.toFixed(2)}ms`);
      }
      
      const memoryUsage = this.getMemoryUsage();
      if (memoryUsage > 0) {
        console.log(`💾 Memory Usage: ${memoryUsage.toFixed(2)} MB`);
      }
      
      console.groupEnd();
    }
  }

  getMetrics(): PerformanceMetrics {
    return { 
      ...this.metrics, 
      memoryUsage: this.getMemoryUsage() 
    };
  }

  reset(): void {
    this.metrics = {};
    this.startTimes.clear();
  }
}

export const performanceMonitor = new PDFPerformanceMonitor();

// Performance optimization utilities
export const optimizeForDevice = () => {
  const isMobile = window.innerWidth < DEVICE_BREAKPOINTS.MOBILE;
  const isLowEndDevice = navigator.hardwareConcurrency <= 2;
  const connection = (navigator as any).connection;
  const hasSlowConnection = connection ? 
    CONNECTION_TYPES.SLOW.includes(connection.effectiveType) : false;

  const preset = getPerformancePreset(isLowEndDevice, hasSlowConnection);

  return {
    isMobile,
    isLowEndDevice,
    hasSlowConnection,
    shouldReduceQuality: isLowEndDevice || hasSlowConnection,
    maxConcurrentPages: preset.maxConcurrentPages,
    shouldPreload: preset.enablePreloading,
    enableTextLayer: preset.enableTextLayer,
    enableAnnotationLayer: preset.enableAnnotationLayer,
    useHighQualityThumbnails: preset.useHighQualityThumbnails,
  };
};

// Debounce utility for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle utility for performance
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};
