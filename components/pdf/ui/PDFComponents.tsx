"use client";

import { ReactNode } from 'react';

interface LoadingProps {
  loadingText: string;
}

/**
 * Loading indicator for PDF viewer
 */
export function PDFLoading({ loadingText }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 p-8">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">{loadingText}</p>
    </div>
  );
}

interface ErrorProps {
  errorTitle: string;
  errorMessage: string | null;
}

/**
 * Error message for PDF viewer
 */
export function PDFError({ errorTitle, errorMessage }: ErrorProps) {
  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center text-red-600 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-medium">{errorTitle}</h3>
        </div>
        <p className="text-sm text-gray-700">{errorMessage}</p>
      </div>
    </div>
  );
}

interface PDFContainerProps {
  children: ReactNode;
}

/**
 * Container for PDF viewer
 */
export function PDFContainer({ children }: PDFContainerProps) {
  return (
    <div className="w-full max-w-6xl mx-auto border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {children}
    </div>
  );
}

/**
 * Wrapper for PDF document content
 */
export function PDFDocumentWrapper({ children }: PDFContainerProps) {
  return (
    <div className="bg-white min-h-[500px] flex justify-center items-center">
      {children}
    </div>
  );
}
