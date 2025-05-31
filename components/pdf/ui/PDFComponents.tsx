"use client";

import { ReactNode, forwardRef } from 'react';
import { Document, Page } from 'react-pdf';

interface LoadingProps {
  loadingText: string;
}

/**
 * Enhanced loading indicator for PDF viewer
 */
export function PDFLoading({ loadingText }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="w-8 h-8 border-4 border-blue-300 border-t-transparent rounded-full animate-spin absolute top-2 left-2"></div>
      </div>
      <p className="text-gray-600 font-medium">{loadingText}</p>
      <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}

interface ErrorProps {
  errorTitle: string;
  errorMessage: string | null;
}

/**
 * Enhanced error message for PDF viewer
 */
export function PDFError({ errorTitle, errorMessage }: ErrorProps) {
  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center text-red-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-semibold text-lg">{errorTitle}</h3>
        </div>
        <p className="text-gray-700 mb-4">{errorMessage}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

interface PDFContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Enhanced container for PDF viewer with fullscreen support
 */
export const PDFContainer = forwardRef<HTMLDivElement, PDFContainerProps>(
  ({ children, className = '' }, ref) => {
    return (
      <div 
        ref={ref}
        className={`w-full h-screen flex flex-col bg-gray-100 border border-gray-200 rounded-lg overflow-hidden shadow-lg ${className}`}
      >
        {children}
      </div>
    );
  }
);

PDFContainer.displayName = 'PDFContainer';

interface PDFDocumentWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Enhanced wrapper for PDF document content
 */
export function PDFDocumentWrapper({ children, className = '' }: PDFDocumentWrapperProps) {
  return (
    <div className={`flex-1 bg-gray-50 overflow-auto p-4 ${className}`}>
      <div className="min-h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

interface PDFSidebarProps {
  children: ReactNode;
}

/**
 * Sidebar for PDF thumbnails and navigation
 */
export function PDFSidebar({ children }: PDFSidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
          Page Thumbnails
        </h3>
        {children}
      </div>
    </div>
  );
}

interface PDFThumbnailsProps {
  file: string;
  numPages: number;
  currentPage: number;
  onPageSelect: (page: number) => void;
  scale: number;
}

/**
 * Thumbnails component for PDF pages
 */
export function PDFThumbnails({ file, numPages, currentPage, onPageSelect, scale }: PDFThumbnailsProps) {
  if (!numPages) return null;

  return (
    <div className="space-y-2">
      {Array.from(new Array(numPages), (el, index) => {
        const pageNumber = index + 1;
        const isCurrentPage = pageNumber === currentPage;
        
        return (
          <div
            key={`thumbnail_${pageNumber}`}
            className={`relative cursor-pointer rounded-lg border-2 transition-all hover:shadow-md ${
              isCurrentPage 
                ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onPageSelect(pageNumber)}
          >
            <div className="p-2">
              <Document file={file} loading={null} error={null}>
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="thumbnail-page"
                />
              </Document>
            </div>
            <div className={`absolute bottom-1 left-1 right-1 text-xs text-center py-1 rounded ${
              isCurrentPage ? 'bg-emerald-600 text-white' : 'bg-black bg-opacity-50 text-white'
            }`}>
              {pageNumber}
            </div>
          </div>
        );
      })}
    </div>
  );
}
