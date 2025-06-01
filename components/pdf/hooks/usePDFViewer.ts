"use client";

import { useState, useEffect } from 'react';

interface UsePDFViewerResult {
  numPages: number;
  pageNumber: number;
  scale: number;
  error: string | null;
  width: number;
  isMobile: boolean;
  setNumPages: (numPages: number) => void;
  setPageNumber: (pageNumber: number) => void;
  setScale: (scale: number) => void;
  setError: (error: string | null) => void;
  changePage: (offset: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

/**
 * Custom hook to manage PDF viewer state and functionality
 */
export function usePDFViewer(): UsePDFViewerResult {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);
  
  const isMobile = width < 768; // Mobile breakpoint

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-adjust scale for mobile devices
  useEffect(() => {
    if (isMobile) {
      setScale(0.6); // Smaller scale for mobile
    } else {
      setScale(1.0); // Default scale for desktop
    }
  }, [isMobile]);

  function changePage(offset: number) {
    setPageNumber(prev => Math.min(Math.max(1, prev + offset), numPages));
  }

  function zoomIn() {
    const increment = isMobile ? 0.1 : 0.2; // Smaller increments on mobile
    setScale(s => Math.min(s + increment, isMobile ? 2 : 3));
  }

  function zoomOut() {
    const decrement = isMobile ? 0.1 : 0.2; // Smaller decrements on mobile
    setScale(s => Math.max(s - decrement, 0.3));
  }

  function resetZoom() {
    setScale(isMobile ? 0.6 : 1.0);
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  }  return {
    numPages,
    pageNumber,
    scale,
    error,
    width,
    isMobile,
    setNumPages,
    setPageNumber,
    setScale,
    setError,
    changePage,
    zoomIn,
    zoomOut,
    resetZoom,
    onDocumentLoadSuccess,
  };
}
