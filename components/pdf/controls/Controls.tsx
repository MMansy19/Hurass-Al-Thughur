"use client";

import { ReactNode, useState } from 'react';

interface PDFControlsWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component for PDF controls
 */
export function PDFControlsWrapper({ children }: PDFControlsWrapperProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 sm:gap-3 p-2 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm">
      {children}
    </div>
  );
}

interface NavigationButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
  icon: ReactNode;
  isNext?: boolean;
}

/**
 * Navigation button for PDF viewer
 */
export function NavigationButton({ onClick, disabled, label, icon, isNext = false }: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-2 sm:px-4 px-2 py-2 bg-emerald-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-200 flex items-center gap-1 sm:gap-2 shadow-sm hover:shadow-md text-sm"
      title={label}
    >
      {!isNext && <span className="rtl:order-2 ltr:order-1">{icon}</span>}
      <span className="hidden sm:inline rtl:order-1 ltr:order-2">{label}</span>
      {isNext && <span className="rtl:order-1 ltr:order-2">{icon}</span>}
    </button>
  );
}

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

/**
 * Enhanced page number indicator with input
 */
export function PageIndicator({ currentPage, totalPages, onPageChange }: PageIndicatorProps) {
  const [inputValue, setInputValue] = useState(currentPage.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(inputValue);
    if (pageNum >= 1 && pageNum <= totalPages && onPageChange) {
      onPageChange(pageNum);
    } else {
      setInputValue(currentPage.toString());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-1 sm:gap-2">
      <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Page</span>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => setInputValue(currentPage.toString())}
        className="w-12 sm:w-16 px-1 sm:px-2 py-1 text-center border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        min={1}
        max={totalPages}
      />
      <span className="text-xs sm:text-sm text-gray-600">/ {totalPages || 0}</span>
    </form>
  );
}

interface ZoomControlProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomInLabel: string;
  zoomOutLabel: string;
  onReset?: () => void;
  actualSizeLabel?: string;
}

/**
 * Enhanced zoom control component
 */
export function ZoomControl({ scale, onZoomIn, onZoomOut, zoomInLabel, zoomOutLabel, onReset, actualSizeLabel }: ZoomControlProps) {
  return (
    <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-300 shadow-sm">
      <button
        onClick={onZoomOut}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-l-lg transition-colors"
        aria-label={zoomOutLabel}
        title={zoomOutLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="px-3 py-2 text-sm bg-gray-50 border-x border-gray-300 min-w-[60px] text-center">
        {Math.round(scale * 100)}%
      </div>
      <button
        onClick={onZoomIn}
        className="p-2 text-blue-600 hover:bg-blue-50 transition-colors"
        aria-label={zoomInLabel}
        title={zoomInLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
      {onReset && (
        <button
          onClick={onReset}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-r-lg transition-colors border-l border-gray-300"
          aria-label={actualSizeLabel || "Reset zoom"}
          title={actualSizeLabel || "Reset zoom"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  );
}

interface ViewModeControlProps {
  mode: 'single' | 'continuous' | 'facing';
  onChange: (mode: 'single' | 'continuous' | 'facing') => void;
  fitWidth: () => void;
  fitPage: () => void;
  fitWidthLabel: string;
  fitPageLabel: string;
  singleLabel: string;
  continuousLabel: string;
  facingLabel: string;
}

/**
 * View mode control component
 */
export function ViewModeControl({ mode, onChange, fitWidth, fitPage, fitWidthLabel, fitPageLabel, singleLabel, continuousLabel, facingLabel }: ViewModeControlProps) {
  return (
    <div className="flex items-center gap-1">
      <select
        value={mode}
        onChange={(e) => onChange(e.target.value as 'single' | 'continuous' | 'facing')}
        className="sm:px-3 sm:py-2 p-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
      >
        <option value="single">{singleLabel}</option>
        <option value="continuous">{continuousLabel}</option>
        <option value="facing">{facingLabel}</option>
      </select>

      <button
        onClick={fitWidth}
        className="sm:px-3 sm:py-2 p-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title={fitWidthLabel}
      >
        {fitWidthLabel}
      </button>
      
      <button
        onClick={fitPage}
        className="sm:px-3 sm:py-2 p-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title={fitPageLabel}
      >
        {fitPageLabel}
      </button>
    </div>
  );
}

interface AdvancedControlsProps {
  onToggleSidebar: () => void;
  onDownload: () => void;
  onPrint: () => void;
  sidebarOpen: boolean;
  thumbnailsLabel: string;
  downloadLabel: string;
  printLabel: string;
  onToggleThumbnails?: () => void;
  onToggleOutline?: () => void;
  outlineOpen?: boolean;
  outlineLabel?: string;
}

/**
 * Advanced controls component
 */
export function AdvancedControls({ 
  onToggleSidebar, 
  onDownload, 
  onPrint, 
  sidebarOpen, 
  thumbnailsLabel, 
  downloadLabel, 
  printLabel,
  onToggleThumbnails,
  onToggleOutline,
  outlineOpen,
  outlineLabel
}: AdvancedControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleThumbnails || onToggleSidebar}
        className={`p-2 rounded-lg transition-colors ${
          sidebarOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        title={thumbnailsLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      
      {onToggleOutline && (
        <button
          onClick={onToggleOutline}
          className={`p-2 rounded-lg transition-colors ${
            outlineOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200'
          }`}
          title={outlineLabel || "Outline"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      )}
      
      <button
        onClick={onDownload}
        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title={downloadLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
      
      <button
        onClick={onPrint}
        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title={printLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
      </button>
    </div>
  );
}

interface FullscreenControlProps {
  isFullscreen: boolean;
  onToggle: () => void;
  label: string;
}

/**
 * Fullscreen control component
 */
export function FullscreenControl({ isFullscreen, onToggle, label }: FullscreenControlProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      title={label}
    >
      {isFullscreen ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      )}
    </button>
  );
}

interface BookmarkControlProps {
  isBookmarked: boolean;
  onToggle: () => void;
  onShowBookmarks: () => void;
  bookmarkLabel: string;
  bookmarksOpen: boolean;
}

/**
 * Bookmark control component
 */
export function BookmarkControl({ 
  isBookmarked, 
  onToggle, 
  onShowBookmarks, 
  bookmarkLabel, 
  bookmarksOpen 
}: BookmarkControlProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onToggle}
        className={`p-2 rounded-lg transition-colors ${
          isBookmarked ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        title={bookmarkLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
      
      <button
        onClick={onShowBookmarks}
        className={`p-2 rounded-lg transition-colors ${
          bookmarksOpen ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        title="Show Bookmarks"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </button>
    </div>
  );
}

