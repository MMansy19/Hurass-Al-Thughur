// Global type definitions for the Hurass Al-Thughur application

export interface Magazine {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  publishedAt: string;
  category: string;
  featured: boolean;
  downloadCount?: number;
  fileSize?: string;
  pageCount?: number;
  language: 'ar' | 'en';
  tags?: string[];
  author?: string;
  slug: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  count: number;
  color?: string;
  icon?: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'book' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  canonical?: string;
}

export interface NavigationItem {
  href: string;
  label: string;
  children?: NavigationItem[];
  external?: boolean;
  icon?: string;
}

export interface LocaleParams {
  locale: 'ar' | 'en';
}

export interface PageParams extends LocaleParams {
  slug?: string;
  id?: string;
}

export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  inp?: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  focusIndicator: boolean;
  screenReaderMode: boolean;
}

export interface UserPreferences {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  accessibility: AccessibilitySettings;
  notifications: {
    newMagazines: boolean;
    updates: boolean;
    newsletter: boolean;
  };
}

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
}

// Web Vitals types
export interface WebVitalsMetric {
  name: 'CLS' | 'FCP' | 'FID' | 'LCP' | 'TTFB' | 'INP';
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  navigationType: 'navigate' | 'reload' | 'back_forward' | 'prerender';
}

// PDF Viewer types
export interface PDFViewerProps {
  url: string;
  width?: number;
  height?: number;
  page?: number;
  scale?: number;
  rotate?: number;
  onLoadSuccess?: (pdf: any) => void;
  onLoadError?: (error: Error) => void;
  onPageChange?: (page: number) => void;
  className?: string;
  loading?: React.ReactNode;
  error?: React.ReactNode;
}

// Search types
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'magazine' | 'category' | 'page';
  url: string;
  relevance: number;
  highlight?: string;
}

export interface SearchFilters {
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  language?: 'ar' | 'en';
  featured?: boolean;
  sortBy?: 'relevance' | 'date' | 'title' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
}

export interface NewsletterForm {
  email: string;
  preferences: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'monthly';
  };
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  category: 'engagement' | 'navigation' | 'download' | 'error' | 'performance';
  properties?: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

export interface LinkProps extends BaseComponentProps {
  href: string;
  external?: boolean;
  download?: boolean;
  rel?: string;
  target?: string;
  'aria-label'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  'aria-label'?: string;
}

export interface ImageProps extends BaseComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Utility types
export type Locale = 'ar' | 'en';
export type Theme = 'light' | 'dark' | 'auto';
export type SortOrder = 'asc' | 'desc';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Generic utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// API endpoint types
export type APIEndpoint = 
  | '/api/magazines'
  | '/api/magazines/[id]'
  | '/api/categories'
  | '/api/search'
  | '/api/contact'
  | '/api/newsletter'
  | '/api/analytics';

// Environment variables
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_GA_ID?: string;
  NEXT_PUBLIC_HOTJAR_ID?: string;
  ANALYZE?: string;
  DATABASE_URL?: string;
  EMAIL_SERVER?: string;
  EMAIL_FROM?: string;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvironmentVariables {}
  }
}
