"use client";

import { ReactNode } from 'react';

interface PDFControlsWrapperProps {
  children: ReactNode;
}

/**
 * Wrapper component for PDF controls
 */
export function PDFControlsWrapper({ children }: PDFControlsWrapperProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 border-b border-gray-200">
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
      className="px-3 py-1.5 bg-emerald-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors flex items-center gap-1"
    >
      {!isNext && icon}
      {label}
      {isNext && icon}
    </button>
  );
}

interface PageIndicatorProps {
  currentPage: number;
  totalPages: number;
}

/**
 * Page number indicator
 */
export function PageIndicator({ currentPage, totalPages }: PageIndicatorProps) {
  return (
    <span className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm">
      Page {currentPage} of {totalPages || 0}
    </span>
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
 * Zoom control component
 */
export function ZoomControl({ scale, onZoomIn, onZoomOut, zoomInLabel, zoomOutLabel }: ZoomControlProps) {
  return (
    <div className="flex items-center ml-auto gap-1">
      <button
        onClick={onZoomOut}
        className="p-1.5 bg-blue-600 text-white rounded-l-md hover:bg-blue-700 transition-colors"
        aria-label={zoomOutLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      </button>
      <span className="px-2 text-sm bg-white border-t border-b border-gray-300">
        {Math.round(scale * 100)}%
      </span>
      <button
        onClick={onZoomIn}
        className="p-1.5 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
        aria-label={zoomInLabel}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}
