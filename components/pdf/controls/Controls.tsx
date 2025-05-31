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
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm">
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
      className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-emerald-700 active:bg-emerald-800 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
      title={label}
    >
      {!isNext && icon}
      <span className="hidden sm:inline">{label}</span>
      {isNext && icon}
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
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Page</span>
      <input
        type="number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => setInputValue(currentPage.toString())}
        className="w-16 px-2 py-1 text-center border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        min={1}
        max={totalPages}
      />
      <span className="text-sm text-gray-600">of {totalPages || 0}</span>
    </form>
  );
}

interface ZoomControlProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoomInLabel: string;
  zoomOutLabel: string;
}

/**
 * Enhanced zoom control component
 */
export function ZoomControl({ scale, onZoomIn, onZoomOut, zoomInLabel, zoomOutLabel }: ZoomControlProps) {
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
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-r-lg transition-colors"
        aria-label={zoomInLabel}
        title={zoomInLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

interface SearchControlProps {
  value: string;
  onChange: (value: string) => void;
  results: number;
  currentResult: number;
  placeholder: string;
}

/**
 * Search control component
 */
export function SearchControl({ value, onChange, results, currentResult, placeholder }: SearchControlProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
        />
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {results > 0 && (
        <span className="text-sm text-gray-600">
          {currentResult + 1} of {results}
        </span>
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
}

/**
 * View mode control component
 */
export function ViewModeControl({ mode, onChange, fitWidth, fitPage, fitWidthLabel, fitPageLabel }: ViewModeControlProps) {
  return (
    <div className="flex items-center gap-1">
      <select
        value={mode}
        onChange={(e) => onChange(e.target.value as 'single' | 'continuous' | 'facing')}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
      >
        <option value="single">Single Page</option>
        <option value="continuous">Continuous</option>
        <option value="facing">Facing Pages</option>
      </select>
      
      <button
        onClick={fitWidth}
        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title={fitWidthLabel}
      >
        Fit Width
      </button>
      
      <button
        onClick={fitPage}
        className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title={fitPageLabel}
      >
        Fit Page
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
  printLabel 
}: AdvancedControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggleSidebar}
        className={`p-2 rounded-lg transition-colors ${
          sidebarOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200'
        }`}
        title={thumbnailsLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>
      
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
