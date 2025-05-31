// Enhanced error handling with proper logging and recovery
'use client';

import { Component, ReactNode, ErrorInfo } from 'react';
import { toast } from 'react-hot-toast';

// Error types for better classification
export enum ErrorType {
  NETWORK = 'NETWORK',
  PDF_LOAD = 'PDF_LOAD',
  VALIDATION = 'VALIDATION',
  RUNTIME = 'RUNTIME',
  PERMISSION = 'PERMISSION',
  TIMEOUT = 'TIMEOUT'
}

export interface AppError extends Error {
  type: ErrorType;
  code?: string;
  context?: Record<string, any>;
  recoverable?: boolean;
}

// Enhanced error creation utility
export function createAppError(
  message: string, 
  type: ErrorType, 
  options: {
    code?: string;
    context?: Record<string, any>;
    recoverable?: boolean;
    cause?: Error;
  } = {}
): AppError {
  const error = new Error(message) as AppError;
  error.type = type;
  error.code = options.code;
  error.context = options.context;
  error.recoverable = options.recoverable ?? true;
  error.cause = options.cause;
  
  return error;
}

// Error logging service
class ErrorLogger {
  private static instance: ErrorLogger;
  
  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: Error | AppError, context: Record<string, any> = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      context,
      ...(error as AppError).type && { type: (error as AppError).type },
      ...(error as AppError).code && { code: (error as AppError).code }
    };

    // Console logging with proper formatting
    console.group(`🚨 Error: ${error.message}`);
    console.error('Error Details:', errorInfo);
    if (error.stack) {
      console.error('Stack Trace:', error.stack);
    }
    console.groupEnd();

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorService(errorInfo);
    }
  }

  private async sendToErrorService(errorInfo: any) {
    try {
      // Example: Send to Sentry, LogRocket, or custom error service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorInfo)
      // });
    } catch (logError) {
      console.error('Failed to log error to service:', logError);
    }
  }
}

// Enhanced Error Boundary with recovery strategies
interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError | Error;
  errorId?: string;
  retryCount: number;
}

interface EnhancedErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  maxRetries?: number;
  showToast?: boolean;
}

export class EnhancedErrorBoundary extends Component<EnhancedErrorBoundaryProps, ErrorBoundaryState> {
  private logger = ErrorLogger.getInstance();
  private retryTimeouts: NodeJS.Timeout[] = [];

  constructor(props: EnhancedErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { 
      hasError: true, 
      error,
      errorId: Math.random().toString(36).substring(7)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.logger.log(error, { 
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    if (this.props.showToast) {
      toast.error('Something went wrong. Please try again.');
    }
  }

  componentWillUnmount() {
    this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
  }

  retry = () => {
    const { maxRetries = 3 } = this.props;
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const { maxRetries = 3 } = this.props;
      const canRetry = this.state.retryCount < maxRetries;
      
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.retry);
      }

      return (
        <ErrorFallbackUI 
          error={this.state.error}
          onRetry={canRetry ? this.retry : undefined}
          retryCount={this.state.retryCount}
          maxRetries={maxRetries}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback UI
interface ErrorFallbackUIProps {
  error: Error;
  onRetry?: () => void;
  retryCount: number;
  maxRetries: number;
}

function ErrorFallbackUI({ error, onRetry, retryCount, maxRetries }: ErrorFallbackUIProps) {
  const appError = error as AppError;
  
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 text-red-500">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {getErrorTitle(appError)}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {getErrorMessage(appError)}
        </p>

        {retryCount > 0 && (
          <p className="text-sm text-gray-500 mb-4">
            Retry attempt: {retryCount}/{maxRetries}
          </p>
        )}

        <div className="space-y-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Refresh Page
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

// Error message helpers
function getErrorTitle(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Connection Problem';
    case ErrorType.PDF_LOAD:
      return 'PDF Loading Error';
    case ErrorType.VALIDATION:
      return 'Invalid Input';
    case ErrorType.PERMISSION:
      return 'Access Denied';
    case ErrorType.TIMEOUT:
      return 'Request Timeout';
    default:
      return 'Something Went Wrong';
  }
}

function getErrorMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Please check your internet connection and try again.';
    case ErrorType.PDF_LOAD:
      return 'We\'re having trouble loading the PDF. The file might be corrupted or temporarily unavailable.';
    case ErrorType.VALIDATION:
      return 'Please check your input and try again.';
    case ErrorType.PERMISSION:
      return 'You don\'t have permission to access this resource.';
    case ErrorType.TIMEOUT:
      return 'The request took too long to complete. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
  }
}

// Specialized error boundaries
export function PDFErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <EnhancedErrorBoundary
      fallback={(error, retry) => (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Unavailable</h3>
          <p className="text-gray-600 mb-4">
            We're having trouble loading the PDF viewer.
          </p>
          {retry && (
            <button 
              onClick={retry}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          )}
        </div>
      )}
      maxRetries={2}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

export function NetworkErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <EnhancedErrorBoundary
      fallback={(error, retry) => (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 text-yellow-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Connection Issue</h3>
          <p className="text-gray-600 mb-4">
            Please check your internet connection and try again.
          </p>
          {retry && (
            <button 
              onClick={retry}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          )}
        </div>
      )}
      maxRetries={3}
    >
      {children}
    </EnhancedErrorBoundary>
  );
}

// Hook for error handling in components
export function useErrorHandler() {
  const logger = ErrorLogger.getInstance();

  const handleError = (error: Error | AppError, context?: Record<string, any>) => {
    logger.log(error, context);
    
    if ((error as AppError).type === ErrorType.NETWORK) {
      toast.error('Network connection error. Please try again.');
    } else if ((error as AppError).recoverable !== false) {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const createError = (message: string, type: ErrorType, options = {}) => 
    createAppError(message, type, options);

  return { handleError, createError };
}
