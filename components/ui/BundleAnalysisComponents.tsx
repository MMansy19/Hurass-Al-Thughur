'use client';

/**
 * Bundle Analysis React Components
 * Provides React components for displaying bundle analysis data
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BundleAnalyzer, 
  BundleAnalysis, 
  PerformanceBudget, 
  BundleStats, 
  OptimizationRecommendation 
} from '../../utils/bundle-analysis-core';

/**
 * Hook for using bundle analyzer
 */
export function useBundleAnalyzer(budgets?: PerformanceBudget) {
  const [analysis, setAnalysis] = useState<BundleAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzer = useMemo(() => BundleAnalyzer.getInstance(budgets), [budgets]);

  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzer.analyzeBundleSize();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  }, [analyzer]);  useEffect(() => {
    // Run analysis on component mount
    if (typeof window !== 'undefined') {
      // Wait for page to fully load
      if (document.readyState === 'complete') {
        runAnalysis();
        return;
      } else {
        const handleLoad = () => runAnalysis();
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    }
    // No cleanup needed when window is not available
  }, [runAnalysis]);

  const budgetStatus = useMemo(() => {
    if (!analysis) return null;
    return analyzer.checkBudgets();
  }, [analysis, analyzer]);

  return {
    analysis,
    isLoading,
    error,
    runAnalysis,
    budgetStatus,
    formatBytes: analyzer.formatBytes.bind(analyzer)
  };
}

/**
 * Bundle Analysis Dashboard Component
 */
interface BundleAnalysisDashboardProps {
  className?: string;
  showRecommendations?: boolean;
  budgets?: PerformanceBudget;
}

export function BundleAnalysisDashboard({ 
  className = '', 
  showRecommendations = true,
  budgets 
}: BundleAnalysisDashboardProps) {
  const { analysis, isLoading, error, runAnalysis, budgetStatus, formatBytes } = useBundleAnalyzer(budgets);

  if (isLoading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Analysis Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={runAnalysis}
          className="mt-3 sm:px-4 px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry Analysis
        </button>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className={`p-6 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <p className="text-gray-600">No analysis data available</p>
        <button
          onClick={runAnalysis}
          className="mt-3 sm:px-4 px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Run Analysis
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Bundle Analysis</h3>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            analysis.score >= 80 ? 'bg-green-100 text-green-800' :
            analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            Score: {analysis.score}/100
          </div>
          <button
            onClick={runAnalysis}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Bundle Size Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Total Size</h4>
          <p className="text-2xl font-bold text-blue-600">{formatBytes(analysis.totalSize)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">Gzipped Size</h4>
          <p className="text-2xl font-bold text-green-600">{formatBytes(analysis.gzippedSize)}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-900 mb-2">Chunks</h4>
          <p className="text-2xl font-bold text-purple-600">{Object.keys(analysis.chunkSizes).length}</p>
        </div>
      </div>

      {/* Budget Status */}
      {budgetStatus && budgetStatus.exceeded && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <h4 className="font-medium text-red-900 mb-2">Budget Violations</h4>          <ul className="text-red-700 space-y-1">
            {budgetStatus.violations.map((violation: string, index: number) => (
              <li key={index} className="text-sm">• {violation}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Largest Chunks */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Largest Chunks</h4>        <div className="space-y-2">
          {analysis.largestChunks.slice(0, 5).map((chunk: { name: string; size: number }) => (
            <div key={chunk.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{chunk.name}</span>
              <span className="text-sm text-gray-600">{formatBytes(chunk.size)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {showRecommendations && analysis.recommendations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Optimization Recommendations</h4>          <ul className="space-y-2">
            {analysis.recommendations.slice(0, 5).map((recommendation: string, index: number) => (
              <li key={index} className="text-sm text-gray-600 flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Advanced Bundle Analysis Component with detailed stats
 */
interface AdvancedBundleAnalysisProps {
  className?: string;
  budgets?: PerformanceBudget;
}

export function AdvancedBundleAnalysis({ className = '', budgets }: AdvancedBundleAnalysisProps) {
  const [stats, setStats] = useState<BundleStats | null>(null);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzer = useMemo(() => BundleAnalyzer.getInstance(budgets), [budgets]);

  const runAdvancedAnalysis = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzer.analyzeWithStats();
      const recs = analyzer.generateOptimizationRecommendations(result);
      setStats(result);
      setRecommendations(recs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Advanced analysis failed');
    } finally {
      setIsLoading(false);
    }
  }, [analyzer]);  useEffect(() => {
    if (typeof window !== 'undefined') {
      runAdvancedAnalysis();
    }
  }, [runAdvancedAnalysis]);

  if (isLoading) {
    return (
      <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Running advanced analysis...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Advanced Analysis Error</h3>
        <p className="text-red-600">{error}</p>
        <button
          onClick={runAdvancedAnalysis}
          className="mt-3 sm:px-4 px-2 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Retry Advanced Analysis
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={`p-6 bg-gray-50 border border-gray-200 rounded-lg ${className}`}>
        <p className="text-gray-600">No advanced analysis data available</p>
        <button
          onClick={runAdvancedAnalysis}
          className="mt-3 sm:px-4 px-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Run Advanced Analysis
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Advanced Bundle Analysis</h3>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              stats.score >= 80 ? 'bg-green-100 text-green-800' :
              stats.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Score: {stats.score}/100
            </div>
            <button
              onClick={runAdvancedAnalysis}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{analyzer.formatBytes(stats.totalSize)}</div>
            <div className="text-sm text-blue-700">Total Size</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{analyzer.formatBytes(stats.gzippedSize)}</div>
            <div className="text-sm text-green-700">Gzipped</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.chunkSizes).length}</div>
            <div className="text-sm text-purple-700">Chunks</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.assetSizes).length}</div>
            <div className="text-sm text-orange-700">Assets</div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Optimization Recommendations</h4>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'critical' 
                    ? 'bg-red-50 border-red-400' 
                    : rec.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className={`font-medium ${
                      rec.type === 'critical' 
                        ? 'text-red-800' 
                        : rec.type === 'warning'
                        ? 'text-yellow-800'
                        : 'text-blue-800'
                    }`}>
                      {rec.title}
                    </h5>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                    <p className="text-sm font-medium text-gray-700 mt-2">{rec.recommendation}</p>
                    {rec.codeExample && (
                      <details className="mt-3">
                        <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                          View code example
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-900 text-green-400 text-xs rounded overflow-x-auto">
                          <code>{rec.codeExample}</code>
                        </pre>
                      </details>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col gap-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rec.impact === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : rec.impact === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {rec.impact} impact
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      rec.effort === 'high' 
                        ? 'bg-red-100 text-red-700'
                        : rec.effort === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {rec.effort} effort
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default BundleAnalysisDashboard;
