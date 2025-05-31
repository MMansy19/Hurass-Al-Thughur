// Critical CSS for above-the-fold content
// This file contains essential styles that should be inlined for faster page rendering

export const criticalCSS = `
  /* Reset and base styles */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    line-height: 1.6;
    text-size-adjust: 100%;
    tab-size: 4;
    scroll-behavior: smooth;
  }

  body {
    font-family: inherit;
    line-height: inherit;
    color: #1f2937;
    background-color: #ffffff;
    font-feature-settings: "rlig" 1, "calt" 1;
    overflow-x: hidden;
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    body {
      color: #f9fafb;
      background-color: #111827;
    }
  }

  /* Arabic text support */
  [dir="rtl"] {
    text-align: right;
  }

  [lang="ar"] {
    font-family: "Cairo", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  /* Loading spinner - visible immediately */
  .loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Skip links for accessibility */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: #000;
    color: #fff;
    padding: 8px;
    z-index: 1000;
    text-decoration: none;
    border-radius: 4px;
    font-size: 14px;
  }

  .skip-link:focus {
    top: 6px;
  }

  /* Header critical styles */
  header {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e7eb;
  }

  @media (prefers-color-scheme: dark) {
    header {
      background-color: rgba(17, 24, 39, 0.95);
      border-bottom-color: #374151;
    }
  }

  /* Navigation critical styles */
  nav {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  /* Logo critical styles */
  .logo {
    font-size: 24px;
    font-weight: 700;
    color: #1f2937;
    text-decoration: none;
  }

  @media (prefers-color-scheme: dark) {
    .logo {
      color: #f9fafb;
    }
  }

  /* Main content area */
  main {
    min-height: calc(100vh - 64px);
    padding-top: 20px;
  }

  /* Container */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }

  /* Typography critical styles */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.25;
    margin-bottom: 16px;
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: 24px;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
  }

  h3 {
    font-size: 1.5rem;
  }

  /* Button critical styles */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 12px 24px;
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
    min-height: 44px;
    min-width: 44px;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: #ffffff;
  }

  .btn-primary:hover {
    background-color: #2563eb;
  }

  .btn-primary:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Grid system */
  .grid {
    display: grid;
    gap: 24px;
  }

  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  @media (min-width: 640px) {
    .grid-cols-sm-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 768px) {
    .grid-cols-md-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .grid-cols-lg-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  /* Card critical styles */
  .card {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    overflow: hidden;
    transition: box-shadow 0.2s ease-in-out;
  }

  .card:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  @media (prefers-color-scheme: dark) {
    .card {
      background-color: #1f2937;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
    }
  }

  /* Image critical styles */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  .image-container {
    position: relative;
    overflow: hidden;
  }

  .image-blur {
    filter: blur(5px);
    transition: filter 0.3s ease;
  }

  /* Focus styles for accessibility */
  :focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* High contrast mode */
  @media (prefers-contrast: high) {
    .card {
      border: 2px solid currentColor;
    }
    
    .btn {
      border: 2px solid currentColor;
    }
  }

  /* Print styles */
  @media print {
    header {
      position: static;
    }
    
    .btn {
      display: none;
    }
    
    body {
      background: white;
      color: black;
    }
  }
`;

// Function to inject critical CSS
export function injectCriticalCSS(): void {
  if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('critical-css');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'critical-css';
      style.textContent = criticalCSS;
      document.head.insertBefore(style, document.head.firstChild);
    }
  }
}

// Critical CSS for loading states
export const loadingCSS = `
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    flex-direction: column;
    gap: 16px;
  }

  .loading-text {
    font-size: 16px;
    color: #6b7280;
    margin-top: 12px;
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton-text {
    height: 16px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .skeleton-title {
    height: 24px;
    border-radius: 4px;
    margin-bottom: 12px;
    width: 70%;
  }

  .skeleton-card {
    height: 200px;
    border-radius: 12px;
  }

  @media (prefers-color-scheme: dark) {
    .skeleton {
      background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    }
    
    .loading-text {
      color: #9ca3af;
    }
  }
`;

// Function to preload critical resources
export function preloadCriticalResources(): void {
  if (typeof document !== 'undefined') {
    // Preload critical fonts
    const fontPreloads = [
      { href: '/fonts/cairo-variable.woff2', type: 'font/woff2' },
      { href: '/fonts/roboto-variable.woff2', type: 'font/woff2' },
    ];

    fontPreloads.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font.href;
      link.as = 'font';
      link.type = font.type;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload critical images
    const imagePreloads = [
      '/images/logo.svg',
      '/images/hero-bg.webp',
    ];

    imagePreloads.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }
}

export default {
  criticalCSS,
  loadingCSS,
  injectCriticalCSS,
  preloadCriticalResources,
};
