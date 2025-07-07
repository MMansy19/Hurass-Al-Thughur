"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState, useCallback, useRef, memo, useMemo } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Import custom hooks
import { usePDFViewer } from "./hooks/usePDFViewer";
import { performanceMonitor, optimizeForDevice } from "./utils/performance";

// Import components
import {
  PDFControlsWrapper,
  NavigationButton,
  PageIndicator,
  ZoomControl,
  AdvancedControls,
  ViewModeControl,
  FullscreenControl,
  BookmarkControl,
} from "./controls/Controls";
import {
  PDFContainer,
  PDFDocumentWrapper,
  PDFLoading,
  PDFError,
  PDFSidebar,
  PDFThumbnails,
  PDFAnnotations,
} from "./ui/PDFComponents";

interface PDFViewerProps {
  pdfFile: string;
  messages: {
    previousPage: string;
    nextPage: string;
    zoomIn: string;
    zoomOut: string;
    loading: string;
    error: string;
    thumbnails: string;
    fullscreen: string;
    fitWidth: string;
    fitPage: string;
    download: string;
    print: string;
    bookmark: string;
    annotations: string;
    highlight: string;
    notes: string;
    actualSize: string;
    pageWidth: string;
    twoPages: string;
    continuous: string;
    outline: string;
    facing: string;
    single: string;
    noMatches: string;
    matches: string;
    page: string;
  };
  locale: string;
  onError?: () => void;
  enableAnnotations?: boolean;
  enableBookmarks?: boolean;
  className?: string;
}

// Memoized PDF Page component for better performance
const MemoizedPage = memo(({ 
  pageNumber, 
  scale, 
  onLoadSuccess, 
  renderTextLayer = true, 
  renderAnnotationLayer = true, 
  className,
  loading,
  error,
  onRenderSuccess 
}: any) => (
  <Page
    pageNumber={pageNumber}
    scale={scale}
    onLoadSuccess={onLoadSuccess}
    renderTextLayer={renderTextLayer}
    renderAnnotationLayer={renderAnnotationLayer}
    className={className}
    loading={loading}
    error={error}
    onRenderSuccess={onRenderSuccess}
  />
));

MemoizedPage.displayName = 'MemoizedPage';

export default function PDFViewer({
  pdfFile,
  messages,
  locale,
  onError,
  enableAnnotations = true,
  enableBookmarks = true,
  className = "",
}: PDFViewerProps) {
  // Use custom hook for PDF viewer functionality FIRST
  const {
    numPages,
    pageNumber,
    scale = 1.0,
    error,
    setError,
    changePage,
    zoomIn,
    zoomOut,
    resetZoom,
    onDocumentLoadSuccess: baseOnDocumentLoadSuccess,
    setPageNumber,
    setScale,
    isMobile,
  } = usePDFViewer();

  // Device optimization
  const deviceOptimization = useMemo(() => optimizeForDevice(), []);

  // Memoize expensive operations
  const documentOptions = useMemo(() => ({
    // Performance optimizations
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
    enableXfa: false, // Disable XFA forms for faster loading
    disableAutoFetch: !deviceOptimization.shouldPreload, // Enable auto-fetch based on device
    disableStream: deviceOptimization.hasSlowConnection, // Disable streaming on slow connections
    disableRange: deviceOptimization.hasSlowConnection, // Disable range requests on slow connections
    useOnlyCssZoom: true, // Use CSS zoom for better performance
    maxImageSize: deviceOptimization.isLowEndDevice ? 8388608 : 16777216, // Adjust max image size
    verbosity: 0, // Reduce console output
  }), [deviceOptimization]);

  const pageLoadingComponent = useMemo(() => (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  ), []);

  const pageErrorComponent = useMemo(() => (
    <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
      <p className="text-red-600">Failed to load page</p>
    </div>
  ), []);

  // Enhanced state management
  const [viewMode, setViewMode] = useState<"single" | "continuous" | "facing">(
    "single",
  );
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarMode, setSidebarMode] = useState<
    "thumbnails" | "outline" | "bookmarks"
  >("thumbnails");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [pageWidth, setPageWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Configure PDF.js worker once on component mount with optimizations
  useEffect(() => {
    const setupWorker = () => {
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker/pdf.worker.min.mjs`;
    };
    setupWorker();

    // Start performance monitoring
    performanceMonitor.reset();
    performanceMonitor.startTimer('documentLoad');

    return () => {
      // Cleanup performance monitoring
      performanceMonitor.reset();
    };
  }, [pdfFile]); // Re-run when PDF file changes

  // Reset zoom and page when PDF file changes
  useEffect(() => {
    // Use 80% zoom for mobile, 100% for desktop
    setScale(isMobile ? 0.6 : 0.8);
    setPageNumber(1); // Reset to first page
    setError(null); // Clear any previous errors
    setPageWidth(0); // Reset page width to trigger auto-fit
  }, [pdfFile, setScale, setPageNumber, setError, isMobile]);

  // Enhanced document load handler with performance monitoring and preloading
  const onDocumentLoadSuccess = useCallback(
    (pdf: any) => {
      performanceMonitor.endTimer('documentLoad');
      performanceMonitor.startTimer('totalLoad');
      
      baseOnDocumentLoadSuccess(pdf);

      // Reset to first page and mobile-responsive zoom when new document loads
      setPageNumber(1);
      setScale(isMobile ? 0.6 : 0.8);

      // Preload strategy based on device capabilities
      if (deviceOptimization.shouldPreload) {
        const preloadPages = Math.min(
          deviceOptimization.maxConcurrentPages, 
          pdf.numPages
        );
        
        for (let i = 1; i <= preloadPages; i++) {
          pdf.getPage(i).then((page: any) => {
            // Pre-render at low resolution for thumbnails
            const scale = deviceOptimization.shouldReduceQuality ? 0.1 : 0.2;
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            
            if (context) {
              page.render({
                canvasContext: context,
                viewport: viewport,
              });
            }
          }).catch(() => {
            // Ignore preload errors
          });
        }
      }

      // Extract outline/bookmarks if available (defer to avoid blocking)
      setTimeout(() => {
        pdf
          .getOutline()
          .then((outline: any) => {
            if (outline) {
              setBookmarks(outline);
            }
          })
          .catch(() => {
            // No outline available
          });
      }, deviceOptimization.hasSlowConnection ? 500 : 100);

      performanceMonitor.endTimer('totalLoad');
      performanceMonitor.logMetrics();
    },
    [baseOnDocumentLoadSuccess, deviceOptimization, setPageNumber, setScale, isMobile],
  );

  // Enhanced zoom functions
  const fitWidth = useCallback(() => {
    if (containerRef.current && pageWidth > 0) {
      const containerWidth =
        containerRef.current.offsetWidth - (showSidebar ? 300 : 40);
      const newScale = Math.max(0.1, Math.min(3.0, containerWidth / pageWidth));
      setScale(newScale);
    }
  }, [pageWidth, showSidebar, setScale]);
  const fitPage = useCallback(() => {
    if (containerRef.current) {
      const containerHeight = containerRef.current.offsetHeight - 100;
      const pageHeight = 842; // Standard A4 height in points
      const containerWidth =
        containerRef.current.offsetWidth - (showSidebar ? 300 : 40);
      const pageWidthPoints = 595; // Standard A4 width in points

      const scaleHeight = containerHeight / pageHeight;
      const scaleWidth = containerWidth / pageWidthPoints;
      const newScale = Math.max(
        0.1,
        Math.min(3.0, Math.min(scaleHeight, scaleWidth)),
      );
      setScale(newScale);
    }
  }, [showSidebar, setScale]);

  // Fullscreen functionality
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const removeAnnotation = useCallback((id: string) => {
    setAnnotations((prev) => prev.filter((annotation) => annotation.id !== id));
  }, []);

  // Bookmark functionality
  const toggleBookmark = useCallback(
    (pageNum: number) => {
      const existingBookmark = bookmarks.find((b) => b.page === pageNum);
      if (existingBookmark) {
        setBookmarks((prev) => prev.filter((b) => b.page !== pageNum));
      } else {
        const newBookmark = {
          id: Date.now().toString(),
          page: pageNum,
          title: `Page ${pageNum}`,
          timestamp: new Date().toISOString(),
        };
        setBookmarks((prev) =>
          [...prev, newBookmark].sort((a, b) => a.page - b.page),
        );
      }
    },
    [bookmarks],
  );

  // Page measurement for responsive scaling with memoization
  const onPageLoadSuccess = useCallback(
    (page: any) => {
      performanceMonitor.endTimer('pageRender');
      
      if (pageWidth === 0) {
        const viewport = page.getViewport({ scale: 1 });
        setPageWidth(viewport.width);
        
        // Don't auto-fit when switching PDFs - maintain user's preferred zoom (100%)
        // Only auto-fit if the page is extremely large and would be unusable
        requestAnimationFrame(() => {
          if (containerRef.current && viewMode === "single") {
            const containerWidth = containerRef.current.offsetWidth - (showSidebar ? 300 : 40);
            const pageWidthAt100 = viewport.width;
            
            // Only auto-fit if the page at 100% zoom is more than 50% larger than container
            // This preserves 100% zoom for most documents while handling extremely large ones
            if (pageWidthAt100 > containerWidth * 1.5) {
              fitPage();
            }
          }
        });
      }
    },
    [pageWidth, viewMode, fitPage, showSidebar],
  );

  // Keyboard shortcuts with enhanced functionality
  useEffect(() => {
    if (!numPages || !pageNumber) return; // Wait for initialization

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          changePage(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          changePage(1);
          break;
        case "Home":
          e.preventDefault();
          setPageNumber(1);
          break;
        case "End":
          e.preventDefault();
          setPageNumber(numPages);
          break;
        case "+":
        case "=":
          e.preventDefault();
          zoomIn();
          break;
        case "-":
          e.preventDefault();
          zoomOut();
          break;
        case "0":
          if (e.ctrlKey) {
            e.preventDefault();
            resetZoom();
          }
          break;
        case "F11":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "Escape":
          if (isFullscreen) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
        case "b":
          if (e.ctrlKey) {
            e.preventDefault();
            toggleBookmark(pageNumber);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    pageNumber,
    numPages,
    changePage,
    setPageNumber,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleFullscreen,
    isFullscreen,
    toggleBookmark,
  ]);

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Auto-fit width on container resize
  useEffect(() => {
    if (!containerRef.current || !fitPage) return;

    const resizeObserver = new ResizeObserver(() => {
      if (viewMode === "single") {
        // Auto-adjust scale based on container size
        fitPage();
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [fitPage, viewMode]);

  // Download functionality
  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFile.split("/").pop() || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfFile]);

  // Print functionality
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Sidebar mode handler
  const toggleSidebar = useCallback(
    (mode?: "thumbnails" | "outline" | "bookmarks") => {
      if (showSidebar && sidebarMode === mode) {
        setShowSidebar(false);
      } else {
        if (mode) setSidebarMode(mode);
        setShowSidebar(true);
      }
    },
    [showSidebar, sidebarMode],
  );

  // Direct navigation handlers to ensure page changes work
  const handlePreviousPage = useCallback(() => {
    console.log('Previous page clicked, current page:', pageNumber, 'numPages:', numPages);
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPageNumber(newPage);
      console.log('Setting page to:', newPage);
    }
  }, [pageNumber, setPageNumber, numPages]);

  const handleNextPage = useCallback(() => {
    console.log('Next page clicked, current page:', pageNumber, 'numPages:', numPages);
    if (pageNumber < numPages && numPages > 0) {
      const newPage = pageNumber + 1;
      setPageNumber(newPage);
      console.log('Setting page to:', newPage);
    }
  }, [pageNumber, numPages, setPageNumber]);

  // Add debugging for page number changes
  useEffect(() => {
    console.log('Page number changed to:', pageNumber, 'Total pages:', numPages);
  }, [pageNumber, numPages]);

  return (
    <PDFContainer
      ref={containerRef}
      className={`${isFullscreen ? "fullscreen" : ""} ${className}`}
      data-testid="pdf-viewer"
    >
      {/* Enhanced Controls */}
      <PDFControlsWrapper>
        {/* Primary Navigation */}
        <div className="flex items-center sm:gap-2 gap-1">
          <NavigationButton
            onClick={handlePreviousPage}
            disabled={pageNumber <= 1}
            label={messages.previousPage}
            icon={
              locale === "ar" ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l-7 7 7 7"
                  />
                </svg>
              )}
            isNext={false}
          />  

          <PageIndicator
            currentPage={pageNumber}
            totalPages={numPages}
            onPageChange={setPageNumber}
            pageLabel={messages.page}
          />

          <NavigationButton
            onClick={handleNextPage}
            disabled={pageNumber >= numPages}
            label={messages.nextPage}
            icon={
              locale === "ar" ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l7-7-7-7"
                  />
                </svg>
              )}
            isNext={true}
          />
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2 md:flex-row flex-col">
          <ViewModeControl
            mode={viewMode}
            onChange={setViewMode}
            fitWidth={fitWidth}
            fitPage={fitPage}
            fitWidthLabel={messages.fitWidth}
            fitPageLabel={messages.fitPage}
            singleLabel={messages.single}
            continuousLabel={messages.continuous}
            facingLabel={messages.facing}
          />

          <ZoomControl
            scale={scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={resetZoom}
            zoomInLabel={messages.zoomIn}
            zoomOutLabel={messages.zoomOut}
            actualSizeLabel={messages.actualSize}
          />
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-row">
          {/* Advanced Controls */}
          <AdvancedControls
            onToggleSidebar={() => toggleSidebar("thumbnails")}
            onToggleThumbnails={() => toggleSidebar("thumbnails")}
            onToggleOutline={() => toggleSidebar("outline")}
            onDownload={handleDownload}
            onPrint={handlePrint}
            sidebarOpen={showSidebar && sidebarMode === "thumbnails"}
            outlineOpen={showSidebar && sidebarMode === "outline"}
            thumbnailsLabel={messages.thumbnails}
            outlineLabel={messages.outline}
            downloadLabel={messages.download}
            printLabel={messages.print}
          />

          {/* Bookmark Control - Only show if enabled */}
          {enableBookmarks && (
            <BookmarkControl
              isBookmarked={bookmarks.some((b) => b.page === pageNumber)}
              onToggle={() => toggleBookmark(pageNumber)}
              onShowBookmarks={() => toggleSidebar("bookmarks")}
              bookmarkLabel={messages.bookmark}
              bookmarksOpen={showSidebar && sidebarMode === "bookmarks"}
            />
          )}

          {/* Fullscreen Control */}
          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
            label={messages.fullscreen}
          />
        </div>
      </PDFControlsWrapper>

      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Sidebar */}
        {showSidebar && (
          <PDFSidebar mode={sidebarMode} onModeChange={setSidebarMode}>
            {sidebarMode === "thumbnails" && (
              <PDFThumbnails
                file={pdfFile}
                numPages={numPages}
                currentPage={pageNumber}
                onPageSelect={setPageNumber}
                scale={0.15}
                annotations={annotations}
                bookmarks={bookmarks}
              />
            )}

            {sidebarMode === "bookmarks" && enableBookmarks && (
              <div className="p-4">
                <h3 className="font-semibold mb-4">{messages.bookmark}</h3>
                <div className="space-y-2">
                  {bookmarks.map((bookmark) => (
                    <button
                      key={bookmark.id}
                      onClick={() => setPageNumber(bookmark.page)}
                      className={`w-full text-left p-2 rounded hover:bg-gray-100 ${
                        pageNumber === bookmark.page
                          ? "bg-blue-100 text-blue-700"
                          : ""
                      }`}
                    >
                      <div className="font-medium">{bookmark.title}</div>
                      <div className="text-sm text-gray-500">
                        Page {bookmark.page}
                      </div>
                    </button>
                  ))}
                  {bookmarks.length === 0 && (
                    <p className="text-gray-500 text-sm">No bookmarks added</p>
                  )}
                </div>
              </div>
            )}

            {sidebarMode === "outline" && (
              <div className="p-4">
                <h3 className="font-semibold mb-4">{messages.outline}</h3>
                <div className="space-y-1">
                  {bookmarks.length > 0 ? (
                    bookmarks.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setPageNumber(item.page || 1)}
                        className="w-full text-left p-2 text-sm hover:bg-gray-100 rounded"
                      >
                        {item.title}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No outline available
                    </p>
                  )}
                </div>
              </div>
            )}
          </PDFSidebar>
        )}

        {/* Main PDF Document */}
        <PDFDocumentWrapper
          className={`${showSidebar ? "with-sidebar" : ""} ${viewMode}`}
        >
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              performanceMonitor.endTimer('documentLoad');
              setError(error.message);
              onError?.();
            }}
            loading={<PDFLoading loadingText={messages.loading} />}
            error={
              <PDFError errorTitle={messages.error} errorMessage={error} />
            }
            className="pdf-document"
            options={documentOptions}
            onItemClick={() => {
              // This is handled in useEffect now
            }}
          >
            {!error && (
              <>
                {viewMode === "single" && (
                  <div className="pdf-page-container">
                    <MemoizedPage
                      pageNumber={pageNumber}
                      scale={scale}
                      onLoadSuccess={onPageLoadSuccess}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="pdf-page border border-gray-300 shadow-lg rounded-lg mb-4"
                      loading={pageLoadingComponent}
                      error={pageErrorComponent}
                      onRenderSuccess={() => {
                        // Preload next page for smoother navigation
                        if (pageNumber < numPages) {
                          // This is done automatically by react-pdf with disableAutoFetch: false
                        }
                        performanceMonitor.endTimer('pageRender');
                      }}
                      onLoadStart={() => {
                        performanceMonitor.startTimer('pageRender');
                      }}
                    />

                    {/* Render annotations for current page */}
                    {enableAnnotations && (
                      <PDFAnnotations
                        annotations={annotations.filter(
                          (a) => a.page === pageNumber,
                        )}
                        onRemove={removeAnnotation}
                        onEdit={(id, content) => {
                          setAnnotations((prev) =>
                            prev.map((a) =>
                              a.id === id ? { ...a, content } : a,
                            ),
                          );
                        }}
                      />
                    )}
                  </div>
                )}

                {viewMode === "continuous" && (
                  <div className="pdf-continuous space-y-4">
                    {Array.from(new Array(Math.min(numPages, 5)), (_, index) => (
                      <div
                        key={`page_${index + 1}`}
                        className="pdf-page-container"
                      >
                        <MemoizedPage
                          pageNumber={index + 1}
                          scale={scale}
                          onLoadSuccess={onPageLoadSuccess}
                          renderTextLayer={index < 3} // Only render text layer for first 3 pages
                          renderAnnotationLayer={index < 3} // Only render annotations for first 3 pages
                          className="pdf-page border border-gray-300 shadow-lg rounded-lg"
                          loading={pageLoadingComponent}
                        />

                        {/* Render annotations for each page */}
                        {enableAnnotations && index < 3 && (
                          <PDFAnnotations
                            annotations={annotations.filter(
                              (a) => a.page === index + 1,
                            )}
                            onRemove={removeAnnotation}
                            onEdit={(id, content) => {
                              setAnnotations((prev) =>
                                prev.map((a) =>
                                  a.id === id ? { ...a, content } : a,
                                ),
                              );
                            }}
                          />
                        )}
                      </div>
                    ))}
                    
                    {/* Lazy load remaining pages */}
                    {numPages > 5 && (
                      <div className="text-center p-8">
                        <button
                          onClick={() => {
                            // Implement lazy loading for remaining pages
                            console.log('Load more pages');
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                          Load More Pages ({numPages - 5} remaining)
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {viewMode === "facing" && (
                  <div className="pdf-facing flex gap-4 justify-center">
                    {pageNumber > 1 && (
                      <div className="pdf-page-container">
                        <MemoizedPage
                          pageNumber={pageNumber - 1}
                          scale={scale * 0.8}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          className="pdf-page border border-gray-300 shadow-lg rounded-lg"
                          loading={pageLoadingComponent}
                        />
                      </div>
                    )}
                    <div className="pdf-page-container">
                      <MemoizedPage
                        pageNumber={pageNumber}
                        scale={scale * 0.8}
                        onLoadSuccess={onPageLoadSuccess}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="pdf-page border border-gray-300 shadow-lg rounded-lg"
                        loading={pageLoadingComponent}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </Document>
        </PDFDocumentWrapper>
      </div>
    </PDFContainer>
  );
}
