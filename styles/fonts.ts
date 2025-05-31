import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

// Google Fonts with optimized loading
export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

// Arabic font with optimized loading
export const arabicFont = localFont({
  src: [
    {
      path: '../public/fonts/arabic-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/arabic-bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-arabic',
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'sans-serif'],
});

// Critical CSS for above-the-fold content
export const criticalCSS = `
  /* Critical styles for immediate rendering */
  html {
    font-family: var(--font-inter), system-ui, sans-serif;
    scroll-behavior: smooth;
  }
  
  [dir="rtl"] {
    font-family: var(--font-arabic), Arial, sans-serif;
  }
  
  body {
    margin: 0;
    padding: 0;
    background-color: #ffffff;
    color: #1f2937;
    line-height: 1.6;
  }
  
  /* Header critical styles */
  .header-critical {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #e5e7eb;
  }
  
  /* Hero section critical styles */
  .hero-critical {
    background: linear-gradient(135deg, #059669, #047857);
    color: white;
    padding: 3rem 1rem;
    text-align: center;
  }
  
  /* Skip links critical styles */
  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    z-index: 999;
    padding: 0.5rem 1rem;
    background: #000;
    color: #fff;
    text-decoration: none;
    transition: left 0.3s;
  }
  
  .skip-link:focus {
    left: 0;
  }
  
  /* Loading spinner critical styles */
  .loading-spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    border: 2px solid #e5e7eb;
    border-radius: 50%;
    border-top-color: #059669;
    animation: spin 1s ease-in-out infinite;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid #059669;
    outline-offset: 2px;
  }
  
  /* Reduced motion for accessibility */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

// Font preload helper
export function preloadFonts() {
  if (typeof document === 'undefined') return;

  const fontPreloads = [
    {
      href: '/fonts/inter-var.woff2',
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    },
    {
      href: '/fonts/arabic-regular.woff2', 
      as: 'font',
      type: 'font/woff2',
      crossOrigin: 'anonymous'
    }
  ];

  fontPreloads.forEach(({ href, as, type, crossOrigin }) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    link.type = type;
    link.crossOrigin = crossOrigin;
    document.head.appendChild(link);
  });
}
