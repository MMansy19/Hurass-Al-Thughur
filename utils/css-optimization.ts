// Advanced CSS optimization utilities for performance and maintainability
'use client';

import { useMemo, useEffect, useState } from 'react';

// CSS Minification and optimization
export class CSSOptimizer {
  private static instance: CSSOptimizer;
  private criticalCSS: Set<string> = new Set();
  private deferredCSS: Set<string> = new Set();
  private usedClasses: Set<string> = new Set();

  static getInstance(): CSSOptimizer {
    if (!CSSOptimizer.instance) {
      CSSOptimizer.instance = new CSSOptimizer();
    }
    return CSSOptimizer.instance;
  }

  // Track used CSS classes for purging
  trackUsedClass(className: string): void {
    this.usedClasses.add(className);
  }

  // Register critical CSS that should be inlined
  registerCriticalCSS(css: string): void {
    this.criticalCSS.add(css);
  }

  // Register CSS that can be deferred
  registerDeferredCSS(css: string): void {
    this.deferredCSS.add(css);
  }

  // Get critical CSS for inlining
  getCriticalCSS(): string {
    return Array.from(this.criticalCSS).join('\n');
  }

  // Get deferred CSS for async loading
  getDeferredCSS(): string {
    return Array.from(this.deferredCSS).join('\n');
  }

  // Purge unused CSS classes
  purgeUnusedCSS(cssString: string): string {
    const usedClassArray = Array.from(this.usedClasses);
    const lines = cssString.split('\n');
    
    return lines.filter(line => {
      if (line.includes('{') && line.includes('.')) {
        const className = line.match(/\.([a-zA-Z0-9_-]+)/)?.[1];
        return className ? usedClassArray.includes(className) : true;
      }
      return true;
    }).join('\n');
  }

  // Minify CSS
  minifyCSS(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/;\s*}/g, '}') // Remove last semicolon
      .replace(/:\s+/g, ':') // Remove space after colons
      .replace(/,\s+/g, ',') // Remove space after commas
      .replace(/{\s+/g, '{') // Remove space after opening braces
      .replace(/}\s+/g, '}') // Remove space after closing braces
      .trim();
  }
}

// Critical CSS patterns for above-the-fold content
export const criticalCSSPatterns = {
  // Layout essentials
  layout: `
    *, *::before, *::after {
      box-sizing: border-box;
    }
    
    html {
      scroll-behavior: smooth;
      line-height: 1.6;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: var(--font-primary, system-ui, sans-serif);
      background-color: var(--bg-primary, #ffffff);
      color: var(--text-primary, #1f2937);
      overflow-x: hidden;
    }
  `,

  // Header and navigation
  navigation: `
    .header-critical {
      position: sticky;
      top: 0;
      z-index: 50;
      background-color: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #e5e7eb;
      transition: all 0.3s ease;
    }
    
    .nav-critical {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      height: 64px;
    }
    
    .logo-critical {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-600, #059669);
      text-decoration: none;
      transition: transform 0.2s ease;
    }
    
    .logo-critical:hover {
      transform: scale(1.05);
    }
  `,

  // Typography
  typography: `
    h1, h2, h3, h4, h5, h6 {
      font-weight: 600;
      line-height: 1.25;
      margin: 0 0 1rem 0;
      color: var(--text-primary, #1f2937);
    }
    
    h1 {
      font-size: clamp(2rem, 4vw, 3rem);
    }
    
    h2 {
      font-size: clamp(1.5rem, 3vw, 2.25rem);
    }
    
    h3 {
      font-size: clamp(1.25rem, 2.5vw, 1.875rem);
    }
    
    p {
      margin: 0 0 1rem 0;
      line-height: 1.6;
    }
    
    a {
      color: var(--primary-600, #059669);
      text-decoration: none;
      transition: color 0.2s ease;
    }
    
    a:hover {
      color: var(--primary-700, #047857);
    }
  `,

  // Button essentials
  buttons: `
    .btn-critical {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      line-height: 1;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
      min-height: 44px;
      min-width: 44px;
    }
    
    .btn-primary-critical {
      background-color: var(--primary-600, #059669);
      color: white;
    }
    
    .btn-primary-critical:hover {
      background-color: var(--primary-700, #047857);
      transform: translateY(-1px);
    }
    
    .btn-primary-critical:active {
      transform: translateY(0);
    }
  `,

  // Grid system
  grid: `
    .container-critical {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .grid-critical {
      display: grid;
      gap: 1.5rem;
    }
    
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    
    @media (min-width: 768px) {
      .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    
    @media (min-width: 1024px) {
      .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
  `,

  // Loading states
  loading: `
    .loading-critical {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
    
    .spinner-critical {
      width: 2rem;
      height: 2rem;
      border: 2px solid #e5e7eb;
      border-radius: 50%;
      border-top-color: var(--primary-600, #059669);
      animation: spin-critical 1s linear infinite;
    }
    
    @keyframes spin-critical {
      to { transform: rotate(360deg); }
    }
    
    .skeleton-critical {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: skeleton-pulse-critical 1.5s infinite;
      border-radius: 0.25rem;
    }
    
    @keyframes skeleton-pulse-critical {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `
};

// Performance optimization utilities
export const cssPerformanceUtils = {
  // Preload critical fonts
  preloadFont: (fontPath: string, fontDisplay: string = 'swap') => {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = fontPath;
    link.as = 'font';
    link.type = 'font/woff2';
    link.crossOrigin = 'anonymous';
    link.setAttribute('data-font-display', fontDisplay);
    document.head.appendChild(link);
  },

  // Inline critical CSS
  inlineCriticalCSS: (css: string) => {
    if (typeof document === 'undefined') return;
    
    const existingStyle = document.getElementById('critical-css-inline');
    if (existingStyle) {
      existingStyle.textContent = css;
      return;
    }
    
    const style = document.createElement('style');
    style.id = 'critical-css-inline';
    style.textContent = css;
    document.head.insertBefore(style, document.head.firstChild);
  },

  // Load non-critical CSS asynchronously
  loadDeferredCSS: (cssPath: string) => {
    if (typeof document === 'undefined') return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = cssPath;
    link.as = 'style';
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  },

  // Remove unused CSS
  removeUnusedCSS: () => {
    if (typeof document === 'undefined') return;
    
    const stylesheets = Array.from(document.styleSheets);
    const usedRules = new Set<string>();
    
    // Scan DOM for used classes
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
      const classList = Array.from(element.classList);
      classList.forEach(className => usedRules.add(`.${className}`));
    });
    
    // Remove unused rules (in development only)
    if (process.env.NODE_ENV === 'development') {
      stylesheets.forEach(stylesheet => {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          rules.forEach((rule, index) => {
            if (rule instanceof CSSStyleRule) {
              const selector = rule.selectorText;
              if (selector.startsWith('.') && !usedRules.has(selector)) {
                console.log(`Unused CSS rule: ${selector}`);
              }
            }
          });
        } catch (e) {
          // Cross-origin stylesheets can't be accessed
        }
      });
    }
  }
};

// CSS Variables manager for theming
export class CSSVariablesManager {
  private variables: Map<string, string> = new Map();

  setVariable(name: string, value: string): void {
    this.variables.set(name, value);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty(`--${name}`, value);
    }
  }

  getVariable(name: string): string | undefined {
    return this.variables.get(name);
  }

  setTheme(theme: Record<string, string>): void {
    Object.entries(theme).forEach(([key, value]) => {
      this.setVariable(key, value);
    });
  }

  removeVariable(name: string): void {
    this.variables.delete(name);
    if (typeof document !== 'undefined') {
      document.documentElement.style.removeProperty(`--${name}`);
    }
  }

  getAllVariables(): Record<string, string> {
    return Object.fromEntries(this.variables);
  }
}

// React hooks for CSS optimization
export const useCSSOptimization = () => {
  const [isOptimized, setIsOptimized] = useState(false);
  const optimizer = useMemo(() => CSSOptimizer.getInstance(), []);

  useEffect(() => {
    // Initialize critical CSS
    const criticalCSS = Object.values(criticalCSSPatterns).join('\n');
    const minifiedCSS = optimizer.minifyCSS(criticalCSS);
    cssPerformanceUtils.inlineCriticalCSS(minifiedCSS);
    
    // Mark as optimized
    setIsOptimized(true);

    // Clean up unused CSS in development
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        cssPerformanceUtils.removeUnusedCSS();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [optimizer]);

  return {
    isOptimized,
    optimizer,
    trackClass: (className: string) => optimizer.trackUsedClass(className),
    inlineCriticalCSS: cssPerformanceUtils.inlineCriticalCSS,
    loadDeferredCSS: cssPerformanceUtils.loadDeferredCSS
  };
};

// CSS-in-JS optimization for component styles
export const createOptimizedStyles = (styles: Record<string, any>) => {
  const optimizer = CSSOptimizer.getInstance();
  
  return useMemo(() => {
    const optimizedStyles: Record<string, string> = {};
    
    Object.entries(styles).forEach(([key, value]) => {
      if (typeof value === 'object') {
        const cssString = Object.entries(value)
          .map(([prop, val]) => `${prop}: ${val};`)
          .join(' ');
        optimizedStyles[key] = optimizer.minifyCSS(cssString);
        optimizer.trackUsedClass(key);
      } else {
        optimizedStyles[key] = value;
      }
    });
    
    return optimizedStyles;
  }, [styles, optimizer]);
};

// Responsive design utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const mediaQueries = {
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  mobile: `@media (max-width: ${breakpoints.sm})`,
  tablet: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.lg})`,
  desktop: `@media (min-width: ${breakpoints.lg})`
} as const;

// Generate responsive CSS
export const generateResponsiveCSS = (
  baseStyles: Record<string, any>,
  responsiveStyles: Partial<Record<keyof typeof mediaQueries, Record<string, any>>>
): string => {
  let css = Object.entries(baseStyles)
    .map(([prop, value]) => `${prop}: ${value};`)
    .join(' ');

  Object.entries(responsiveStyles).forEach(([breakpoint, styles]) => {
    if (styles && mediaQueries[breakpoint as keyof typeof mediaQueries]) {
      const responsiveCSS = Object.entries(styles)
        .map(([prop, value]) => `${prop}: ${value};`)
        .join(' ');
      css += ` ${mediaQueries[breakpoint as keyof typeof mediaQueries]} { ${responsiveCSS} }`;
    }
  });

  return css;
};

// Export optimization system
export default {
  CSSOptimizer,
  CSSVariablesManager,
  criticalCSSPatterns,
  cssPerformanceUtils,
  useCSSOptimization,
  createOptimizedStyles,
  breakpoints,
  mediaQueries,
  generateResponsiveCSS
};
