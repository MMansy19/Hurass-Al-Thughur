/**
 * Bundle Analysis Core Utilities
 * Provides core tools for analyzing and optimizing Next.js bundle size
 */

// Types and Interfaces
export interface BundleStats {
  totalSize: number;
  gzippedSize: number;
  chunkSizes: Record<string, number>;
  assetSizes: Record<string, number>;
  largestChunks: Array<{ name: string; size: number }>;
  score: number;
  recommendations: string[];
  timestamp: number;
}

export interface PerformanceBudget {
  maxTotalSize: number;    // bytes
  maxChunkSize: number;    // bytes  
  maxAssetSize: number;    // bytes
  gzipThreshold: number;   // compression ratio threshold
}

export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunkSizes: Record<string, number>;
  duplicates: string[];
  largestChunks: Array<{ name: string; size: number }>;
  recommendations: string[];
  score: number;
}

export interface ModuleInfo {
  name: string;
  size: number;
  gzippedSize: number;
  path: string;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
  duplicates?: number;
}

export interface ChunkInfo {
  name: string;
  size: number;
  modules: string[];
  loadTime: number;
  isEntry: boolean;
  isInitial: boolean;
}

export interface AssetInfo {
  name: string;
  size: number;
  type: string;
  optimized: boolean;
  compressionRatio?: number;
}

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
}

export interface OptimizationRecommendation {
  type: 'critical' | 'warning' | 'info';
  category: 'bundle-size' | 'code-splitting' | 'compression' | 'caching' | 'images';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  recommendation: string;
  codeExample?: string;
}

// Default performance budgets
const DEFAULT_BUDGETS: PerformanceBudget = {
  maxTotalSize: 244 * 1024, // 244KB (recommended for mobile)
  maxChunkSize: 128 * 1024,  // 128KB per chunk
  maxAssetSize: 100 * 1024,  // 100KB per asset
  gzipThreshold: 0.7        // 70% compression ratio
};

/**
 * Bundle Size Analyzer
 */
export class BundleAnalyzer {
  private static instance: BundleAnalyzer;
  private analysis: BundleAnalysis | null = null;
  private budgets: PerformanceBudget;

  constructor(budgets: PerformanceBudget = DEFAULT_BUDGETS) {
    this.budgets = budgets;
  }

  static getInstance(budgets?: PerformanceBudget): BundleAnalyzer {
    if (!BundleAnalyzer.instance) {
      BundleAnalyzer.instance = new BundleAnalyzer(budgets);
    }
    return BundleAnalyzer.instance;
  }

  /**
   * Analyze current bundle size and performance
   */
  async analyzeBundleSize(): Promise<BundleAnalysis> {
    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      // Calculate total transferred size
      const totalSize = resources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);

      // Estimate gzipped size (roughly 70% of original)
      const gzippedSize = Math.round(totalSize * this.budgets.gzipThreshold);

      // Analyze chunk sizes
      const chunkSizes: Record<string, number> = {};
      const jsResources = resources.filter(r => 
        r.name.includes('_next/static') && r.name.endsWith('.js')
      );

      jsResources.forEach(resource => {
        const name = this.extractChunkName(resource.name);
        if (name) {
          chunkSizes[name] = resource.transferSize || 0;
        }
      });

      // Find largest chunks
      const largestChunks = Object.entries(chunkSizes)
        .map(([name, size]) => ({ name, size }))
        .sort((a, b) => b.size - a.size)
        .slice(0, 10);

      // Detect potential duplicates (simplified)
      const duplicates = this.detectDuplicates(resources);

      // Generate recommendations
      const recommendations = this.generateRecommendations({
        totalSize,
        gzippedSize,
        chunkSizes,
        largestChunks,
        duplicates
      });

      // Calculate performance score
      const score = this.calculatePerformanceScore({
        totalSize,
        gzippedSize,
        chunkSizes,
        largestChunks
      });

      this.analysis = {
        totalSize,
        gzippedSize,
        chunkSizes,
        duplicates,
        largestChunks,
        recommendations,
        score
      };

      return this.analysis;
    } catch (error) {
      console.error('Bundle analysis failed:', error);
      throw error;
    }
  }

  /**
   * Extract chunk name from URL
   */
  private extractChunkName(url: string): string | null {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    if (!filename) return null;
    return filename.replace(/\.[a-z0-9]+\.js$/, '.js');
  }
  /**
   * Detect potential duplicate resources
   */
  private detectDuplicates(resources: PerformanceResourceTiming[]): string[] {
    const duplicates: string[] = [];
    const seen = new Set<string>();

    resources.forEach(resource => {
      if (!resource.name) return;
      
      const baseName = resource.name.split('?')[0]?.split('#')[0];
      if (!baseName) return;
      
      const filename = baseName.split('/').pop();
      
      if (filename && seen.has(filename)) {
        duplicates.push(filename);
      } else if (filename) {
        seen.add(filename);
      }
    });

    return Array.from(new Set(duplicates));
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(data: Partial<BundleAnalysis>): string[] {
    const recommendations: string[] = [];
    const { totalSize, chunkSizes, largestChunks, duplicates } = data;

    // Bundle size recommendations
    if (totalSize && totalSize > this.budgets.maxTotalSize) {
      recommendations.push(
        `Total bundle size (${this.formatBytes(totalSize)}) exceeds budget (${this.formatBytes(this.budgets.maxTotalSize)}). Consider code splitting and lazy loading.`
      );
    }

    // Chunk size recommendations
    if (chunkSizes) {
      Object.entries(chunkSizes).forEach(([name, size]) => {
        if (size > this.budgets.maxChunkSize) {
          recommendations.push(
            `Chunk ${name} (${this.formatBytes(size)}) exceeds recommended size. Consider splitting this chunk.`
          );
        }
      });
    }

    // Large chunk recommendations
    if (largestChunks && largestChunks.length > 0) {
      const largestChunk = largestChunks[0];
      if (largestChunk && largestChunk.size > this.budgets.maxChunkSize) {
        recommendations.push(
          `Consider optimizing ${largestChunk.name} - it's your largest chunk at ${this.formatBytes(largestChunk.size)}.`
        );
      }
    }

    // Duplicate recommendations
    if (duplicates && duplicates.length > 0) {
      recommendations.push(
        `Found ${duplicates.length} potential duplicate resources. Review: ${duplicates.slice(0, 3).join(', ')}`
      );
    }

    // General recommendations
    recommendations.push(
      'Use dynamic imports for non-critical components',
      'Enable gzip/brotli compression on your server',
      'Consider using next/dynamic for heavy components',
      'Optimize images with next/image component',
      'Remove unused dependencies and code'
    );

    return recommendations;
  }

  /**
   * Calculate performance score (0-100)
   */
  private calculatePerformanceScore(data: Partial<BundleAnalysis>): number {
    let score = 100;
    const { totalSize, chunkSizes, largestChunks } = data;

    // Penalize large bundle size
    if (totalSize) {
      const sizePenalty = Math.max(0, (totalSize - this.budgets.maxTotalSize) / this.budgets.maxTotalSize * 30);
      score -= sizePenalty;
    }

    // Penalize large chunks
    if (chunkSizes) {
      const largeChunks = Object.values(chunkSizes).filter(size => size > this.budgets.maxChunkSize);
      score -= largeChunks.length * 10;
    }

    // Penalize very large chunks
    if (largestChunks) {
      const veryLargeChunks = largestChunks.filter(chunk => chunk.size > this.budgets.maxChunkSize * 2);
      score -= veryLargeChunks.length * 15;
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Format bytes to human readable format
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get current analysis
   */
  getAnalysis(): BundleAnalysis | null {
    return this.analysis;
  }

  /**
   * Check if budgets are exceeded
   */
  checkBudgets(): { exceeded: boolean; violations: string[] } {
    if (!this.analysis) {
      return { exceeded: false, violations: [] };
    }

    const violations: string[] = [];

    if (this.analysis.totalSize > this.budgets.maxTotalSize) {
      violations.push(`Bundle size exceeds budget: ${this.formatBytes(this.analysis.totalSize)} > ${this.formatBytes(this.budgets.maxTotalSize)}`);
    }

    Object.entries(this.analysis.chunkSizes).forEach(([name, size]) => {
      if (size > this.budgets.maxChunkSize) {
        violations.push(`Chunk ${name} exceeds budget: ${this.formatBytes(size)} > ${this.formatBytes(this.budgets.maxChunkSize)}`);
      }
    });

    return {
      exceeded: violations.length > 0,
      violations
    };
  }
  /**
   * Advanced bundle analysis with webpack stats
   */
  async analyzeWithStats(_webpackStats?: any): Promise<BundleStats> {
    // Mock implementation for demonstration
    // In a real implementation, _webpackStats would be used to parse actual webpack data
    const mockStats: BundleStats = {
      totalSize: 680 * 1024, // 680KB in bytes
      gzippedSize: 210 * 1024, // 210KB in bytes
      chunkSizes: {
        'main': 180.5 * 1024,
        'pdf-viewer': 156.8 * 1024,
        'animations': 67.4 * 1024,
        'vendors': 275.3 * 1024
      },
      assetSizes: {
        'main.js': 180.5 * 1024,
        'styles.css': 89.2 * 1024,
        'pdf-worker.js': 156.8 * 1024
      },
      largestChunks: [
        { name: 'vendors', size: 275.3 * 1024 },
        { name: 'main', size: 180.5 * 1024 },
        { name: 'pdf-viewer', size: 156.8 * 1024 },
        { name: 'animations', size: 67.4 * 1024 }
      ],
      score: this.calculatePerformanceScore({
        totalSize: 680 * 1024,
        chunkSizes: {
          'main': 180.5 * 1024,
          'pdf-viewer': 156.8 * 1024,
          'animations': 67.4 * 1024,
          'vendors': 275.3 * 1024
        }
      }),
      recommendations: [
        'Consider code splitting the vendors chunk',
        'Implement dynamic imports for PDF viewer',
        'Use tree shaking to reduce bundle size',
        'Enable compression on server'
      ],
      timestamp: Date.now()
    };

    return mockStats;
  }

  /**
   * Generate detailed optimization recommendations
   */
  generateOptimizationRecommendations(stats: BundleStats): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Critical bundle size issues
    if (stats.totalSize > this.budgets.maxTotalSize) {
      recommendations.push({
        type: 'critical',
        category: 'bundle-size',
        title: 'Bundle size exceeds performance budget',
        description: `Total bundle size (${this.formatBytes(stats.totalSize)}) exceeds the recommended budget of ${this.formatBytes(this.budgets.maxTotalSize)}`,
        impact: 'high',
        effort: 'medium',
        recommendation: 'Implement code splitting and remove unused dependencies',
        codeExample: `
// Use dynamic imports for heavy components
const PDFViewer = dynamic(() => import('./PDFViewer'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Split chunks in next.config.js
module.exports = {
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    };
    return config;
  }
};`
      });
    }

    // Large chunk warnings
    const largeChunks = Object.entries(stats.chunkSizes).filter(([_, size]) => size > this.budgets.maxChunkSize);
    if (largeChunks.length > 0) {
      recommendations.push({
        type: 'warning',
        category: 'code-splitting',
        title: 'Large chunks detected',
        description: `${largeChunks.length} chunks exceed the recommended size of ${this.formatBytes(this.budgets.maxChunkSize)}`,
        impact: 'medium',
        effort: 'medium',
        recommendation: 'Split large chunks into smaller, more focused bundles',
        codeExample: `
// Route-based code splitting
const MagazinePage = dynamic(() => import('./MagazinePage'));
const PDFBrowser = dynamic(() => import('./PDFBrowser'));

// Component-based splitting
const LazyAnimations = lazy(() => import('./AnimationSystem'));`
      });
    }

    return recommendations;
  }
}

/**
 * Utility function to create a bundle analyzer instance
 */
export function createBundleAnalyzer(budgets?: Partial<PerformanceBudget>): BundleAnalyzer {
  const fullBudgets = { ...DEFAULT_BUDGETS, ...budgets };
  return new BundleAnalyzer(fullBudgets);
}

/**
 * Format bytes utility function
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default BundleAnalyzer;
