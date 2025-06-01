"use client";

import { useState, useEffect } from 'react';

interface UsePDFViewerOptions {
  initialScale?: number;
}

interface UsePDFViewerResult {
  numPages: number;
  pageNumber: number;
  scale: number;
  error: string | null;
  width: number;
  setNumPages: (numPages: number) => void;
  setPageNumber: (pageNumber: number) => void;
  setScale: (scale: number) => void;
  setError: (error: string | null) => void;
  changePage: (offset: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

/**
 * Custom hook to manage PDF viewer state and functionality
 */
export function usePDFViewer({ initialScale = 1 }: UsePDFViewerOptions = {}): UsePDFViewerResult {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(initialScale);
  const [error, setError] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Adjust scale based on screen width
    if (width < 640) setScale(0.7);
    else if (width < 1024) setScale(0.9);
    else setScale(1.2);
  }, [width]);

  function changePage(offset: number) {
    setPageNumber(prev => Math.min(Math.max(1, prev + offset), numPages));
  }

  function zoomIn() {
    setScale(s => Math.min(s + 0.2, 3));
  }

  function zoomOut() {
    setScale(s => Math.max(s - 0.2, 0.5));
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  }
  return {
    numPages,
    pageNumber,
    scale,
    error,
    width,
    setNumPages,
    setPageNumber,
    setScale,
    setError,
    changePage,
    zoomIn,
    zoomOut,
    onDocumentLoadSuccess,
  };
}
