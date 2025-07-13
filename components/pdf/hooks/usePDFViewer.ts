"use client";

import { useState, useEffect } from "react";

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
  const [width, setWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  const isMobile = width < 768; // Mobile breakpoint

  // Debounced resize handler for better performance
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(window.innerWidth);
      }, 150); // Debounce resize events
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Auto-adjust scale for mobile devices with better initial values
  useEffect(() => {
    if (isMobile) {
      setScale(0.8); // Slightly larger scale for mobile readability
    } else {
      setScale(1.0); // Default 100% scale for desktop
    }
  }, [isMobile]);

  function changePage(offset: number) {
    setPageNumber((prev) => {
      const newPage = prev + offset;
      // Only change page if numPages is properly set
      if (numPages > 0) {
        return Math.min(Math.max(1, newPage), numPages);
      }
      return prev; // Return current page if numPages isn't set yet
    });
  }

  function zoomIn() {
    const increment = isMobile ? 0.15 : 0.25; // Better increments
    setScale((s) => {
      const newScale = s + increment;
      return Math.min(newScale, isMobile ? 2.5 : 4); // Higher max zoom
    });
  }

  function zoomOut() {
    const decrement = isMobile ? 0.15 : 0.25; // Better decrements
    setScale((s) => {
      const newScale = s - decrement;
      return Math.max(newScale, 0.2); // Lower min zoom for overview
    });
  }

  function resetZoom() {
    setScale(isMobile ? 0.8 : 1.0); // Match initial values - 100% for desktop
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);

    // Reset to default scale (100% for desktop, 80% for mobile)
    setScale(isMobile ? 0.8 : 1.0);
  }

  return {
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
