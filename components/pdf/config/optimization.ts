/**
 * PDF Loading Optimization Configuration
 * This file contains optimized settings for PDF.js to improve loading performance
 */

// PDF.js optimization constants
export const PDF_OPTIMIZATION_CONFIG = {
  // Worker configuration
  WORKER_PATH: '/pdf-worker/pdf.worker.min.mjs',
  
  // Performance settings
  MAX_IMAGE_SIZE_LOW_END: 8388608, // 8MB for low-end devices
  MAX_IMAGE_SIZE_NORMAL: 16777216, // 16MB for normal devices
  
  // Preloading settings
  MAX_PRELOAD_PAGES_MOBILE: 2,
  MAX_PRELOAD_PAGES_DESKTOP: 3,
  MAX_PRELOAD_PAGES_LOW_END: 1,
  
  // Rendering settings
  THUMBNAIL_SCALE: 0.15,
  PREVIEW_SCALE_LOW_QUALITY: 0.1,
  PREVIEW_SCALE_NORMAL: 0.2,
  
  // Timing configurations
  OUTLINE_LOAD_DELAY_FAST: 100,
  OUTLINE_LOAD_DELAY_SLOW: 500,
  RESIZE_DEBOUNCE_DELAY: 150,
  
  // Quality settings based on device
  MOBILE_SCALE_FACTOR: 0.7,
  DESKTOP_SCALE_FACTOR: 1.2,
  MAX_ZOOM_MOBILE: 2.5,
  MAX_ZOOM_DESKTOP: 4.0,
  MIN_ZOOM: 0.2,
  ZOOM_INCREMENT_MOBILE: 0.15,
  ZOOM_INCREMENT_DESKTOP: 0.25,
  
  // Continuous view limits
  CONTINUOUS_VIEW_INITIAL_PAGES: 5,
  TEXT_LAYER_RENDER_LIMIT: 3,
  ANNOTATION_LAYER_RENDER_LIMIT: 3,
};

// Device detection utilities
export const DEVICE_BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1024,
  DESKTOP: 1200,
};

// Connection speed detection
export const CONNECTION_TYPES = {
  SLOW: ['slow-2g', '2g'],
  MEDIUM: ['3g'],
  FAST: ['4g', '5g'],
};

// Performance optimization presets
export const PERFORMANCE_PRESETS = {
  HIGH_PERFORMANCE: {
    enablePreloading: true,
    maxConcurrentPages: 3,
    enableTextLayer: true,
    enableAnnotationLayer: true,
    useHighQualityThumbnails: true,
  },
  BALANCED: {
    enablePreloading: true,
    maxConcurrentPages: 2,
    enableTextLayer: true,
    enableAnnotationLayer: true,
    useHighQualityThumbnails: false,
  },
  MEMORY_OPTIMIZED: {
    enablePreloading: false,
    maxConcurrentPages: 1,
    enableTextLayer: false,
    enableAnnotationLayer: false,
    useHighQualityThumbnails: false,
  },
};

// Get performance preset based on device capabilities
export const getPerformancePreset = (isLowEndDevice: boolean, hasSlowConnection: boolean) => {
  if (isLowEndDevice || hasSlowConnection) {
    return PERFORMANCE_PRESETS.MEMORY_OPTIMIZED;
  }
  
  if (hasSlowConnection) {
    return PERFORMANCE_PRESETS.BALANCED;
  }
  
  return PERFORMANCE_PRESETS.HIGH_PERFORMANCE;
};
