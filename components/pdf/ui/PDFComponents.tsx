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
  mode?: 'thumbnails' | 'outline' | 'bookmarks' | 'search';
  onModeChange?: (mode: 'thumbnails' | 'outline' | 'bookmarks' | 'search') => void;
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
  annotations?: any[];
  bookmarks?: any[];
}

/**
 * Thumbnails component for PDF pages
 */
export function PDFThumbnails({ file, numPages, currentPage, onPageSelect, scale }: PDFThumbnailsProps) {
  if (!numPages) return null;

  return (
    <div className="space-y-2">
      {Array.from(new Array(numPages), (_, index) => {
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

interface PDFTextSearchProps {
  searchText: string;
  searchResults: any[];
  currentIndex: number;
  onSearch: (text: string) => void;
  onSelectResult: (index: number) => void;
  messages: {
    search: string;
    searchResults: string;
    noMatches: string;
    matches: string;
  };
}

/**
 * Text search component for PDF
 */
export function PDFTextSearch({ 
  searchText, 
  searchResults, 
  currentIndex, 
  onSearch, 
  onSelectResult, 
  messages 
}: PDFTextSearchProps) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">{messages.search}</h3>
      <div className="space-y-4">
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={messages.search}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              {searchResults.length} {messages.matches}
            </p>
            {searchResults.map((result, index) => (
              <button
                key={index}
                onClick={() => onSelectResult(index)}
                className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                  index === currentIndex ? 'bg-blue-100 text-blue-700' : ''
                }`}
              >
                <div className="font-medium">Page {result.page}</div>
                <div className="text-sm text-gray-500 truncate">{result.text}</div>
              </button>
            ))}
          </div>
        )}
        
        {searchText && searchResults.length === 0 && (
          <p className="text-sm text-gray-500">{messages.noMatches}</p>
        )}
      </div>
    </div>
  );
}

interface PDFAnnotationsProps {
  annotations: any[];
  onRemove: (id: string) => void;
  onEdit: (id: string, content: string) => void;
}

/**
 * Annotations overlay component
 */
export function PDFAnnotations({ annotations, onRemove, onEdit }: PDFAnnotationsProps) {
  if (annotations.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {annotations.map((annotation) => (
        <div
          key={annotation.id}
          className="absolute pointer-events-auto"
          style={{
            left: annotation.position.x,
            top: annotation.position.y,
          }}
        >
          {annotation.type === 'highlight' && (
            <div
              className="bg-yellow-300 bg-opacity-50 border border-yellow-400 rounded"
              style={{
                width: 100,
                height: 20,
              }}
            />
          )}
          
          {annotation.type === 'note' && (
            <div className="bg-blue-500 text-white p-1 rounded shadow-lg min-w-[200px]">
              <div className="text-xs">{annotation.content}</div>
              <div className="flex gap-1 mt-1">
                <button
                  onClick={() => onEdit(annotation.id, prompt('Edit note:', annotation.content) || annotation.content)}
                  className="text-xs bg-blue-600 hover:bg-blue-700 px-1 py-0.5 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRemove(annotation.id)}
                  className="text-xs bg-red-500 hover:bg-red-600 px-1 py-0.5 rounded"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
