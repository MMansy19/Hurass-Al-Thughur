// Enhanced Performance Monitor with Web Vitals visualization
'use client';

import { useEffect, useState, memo } from 'react';

interface PerformanceData {
  cls: number | null;
  fid: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
  memoryUsage: number | null;
  loadTime: number | null;
  connectionType: string | null;
}

interface PerformanceThresholds {
  cls: { good: number; needs_improvement: number };
  fid: { good: number; needs_improvement: number };
  fcp: { good: number; needs_improvement: number };
  lcp: { good: number; needs_improvement: number };
  ttfb: { good: number; needs_improvement: number };
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  cls: { good: 0.1, needs_improvement: 0.25 },
  fid: { good: 100, needs_improvement: 300 },
  fcp: { good: 1800, needs_improvement: 3000 },
  lcp: { good: 2500, needs_improvement: 4000 },
  ttfb: { good: 800, needs_improvement: 1800 }
};

function getMetricStatus(value: number, thresholds: { good: number; needs_improvement: number }): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needs_improvement) return 'needs-improvement';
  return 'poor';
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'good': return 'text-green-600 bg-green-50 border-green-200';
    case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'poor': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

const EnhancedPerformanceMonitor = memo(() => {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    memoryUsage: null,
    loadTime: null,
    connectionType: null
  });

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when specifically enabled
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('showPerformanceMonitor') === 'true';
    setIsVisible(shouldShow);

    if (!shouldShow) return;    // Import web-vitals dynamically to avoid SSR issues
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      const handleMetric = (metric: any) => {
        setPerformanceData(prev => ({
          ...prev,
          [metric.name.toLowerCase()]: metric.value
        }));

        // Log to console for debugging
        console.log(`${metric.name}: ${metric.value}`, metric);
      };      // Register Web Vitals observers
      onCLS(handleMetric);
      onINP(handleMetric);
      onFCP(handleMetric);
      onLCP(handleMetric);
      onTTFB(handleMetric);
    }).catch(() => {
      console.warn('Web Vitals not available');
    });

    // Get memory usage if available
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      setPerformanceData(prev => ({
        ...prev,
        memoryUsage: Math.round(memInfo.usedJSHeapSize / 1024 / 1024)
      }));
    }

    // Get connection info
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setPerformanceData(prev => ({
        ...prev,
        connectionType: connection.effectiveType || connection.type || 'unknown'
      }));
    }

    // Calculate load time
    if (performance.timing) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      if (loadTime > 0) {
        setPerformanceData(prev => ({
          ...prev,
          loadTime: Math.round(loadTime)
        }));
      }
    }
  }, []);

  if (!isVisible) return null;

  const renderMetric = (
    label: string, 
    value: number | null, 
    unit: string, 
    thresholds?: { good: number; needs_improvement: number }
  ) => {
    if (value === null) return null;

    const status = thresholds ? getMetricStatus(value, thresholds) : 'good';
    const colorClass = getStatusColor(status);

    return (
      <div className={`p-3 rounded-lg border ${colorClass}`}>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xl font-bold">
          {typeof value === 'number' ? value.toFixed(label === 'CLS' ? 3 : 0) : value}{unit}
        </div>
        {thresholds && (
          <div className="text-xs capitalize mt-1">
            {status.replace('-', ' ')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
        <button
          onClick={() => {
            setIsVisible(false);
            localStorage.setItem('showPerformanceMonitor', 'false');
          }}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close performance monitor"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-2 text-sm">
        {/* Core Web Vitals */}
        <div className="grid grid-cols-2 gap-2">
          {renderMetric('LCP', performanceData.lcp, 'ms', PERFORMANCE_THRESHOLDS.lcp)}
          {renderMetric('FID', performanceData.fid, 'ms', PERFORMANCE_THRESHOLDS.fid)}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {renderMetric('CLS', performanceData.cls, '', PERFORMANCE_THRESHOLDS.cls)}
          {renderMetric('FCP', performanceData.fcp, 'ms', PERFORMANCE_THRESHOLDS.fcp)}
        </div>

        {renderMetric('TTFB', performanceData.ttfb, 'ms', PERFORMANCE_THRESHOLDS.ttfb)}

        {/* Additional metrics */}
        <div className="pt-2 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            {performanceData.memoryUsage && renderMetric('Memory', performanceData.memoryUsage, 'MB')}
            {performanceData.loadTime && renderMetric('Load Time', performanceData.loadTime, 'ms')}
          </div>
          {performanceData.connectionType && (
            <div className="mt-2 text-xs text-gray-600">
              Connection: {performanceData.connectionType}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="pt-2 border-t border-gray-200 flex space-x-2">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Reload
          </button>
          <button
            onClick={() => {
              const data = JSON.stringify(performanceData, null, 2);
              navigator.clipboard?.writeText(data);
            }}
            className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Copy Data
          </button>
        </div>
      </div>
    </div>
  );
});

EnhancedPerformanceMonitor.displayName = 'EnhancedPerformanceMonitor';

export default EnhancedPerformanceMonitor;
