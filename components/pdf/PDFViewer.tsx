"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState, useCallback, useRef, memo, useMemo } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import { usePDFViewer } from "./hooks/usePDFViewer";
import { performanceMonitor, optimizeForDevice } from "./utils/performance";
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

const MemoizedPage = memo(
  ({
    pageNumber,
    scale,
    onLoadSuccess,
    renderTextLayer = true,
    renderAnnotationLayer = true,
    className,
    loading,
    error,
    onRenderSuccess,
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
  ),
);

MemoizedPage.displayName = "MemoizedPage";

export default function PDFViewer({
  pdfFile,
  messages,
  locale,
  onError,
  enableAnnotations = true,
  enableBookmarks = true,
  className = "",
}: PDFViewerProps) {
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

  const deviceOptimization = useMemo(() => optimizeForDevice(), []);

  const documentOptions = useMemo(
    () => ({
      cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
      cMapPacked: true,
      enableXfa: false,
      disableAutoFetch: !deviceOptimization.shouldPreload,
      disableStream: deviceOptimization.hasSlowConnection,
      disableRange: deviceOptimization.hasSlowConnection,
      useOnlyCssZoom: true,
      maxImageSize: deviceOptimization.isLowEndDevice ? 8388608 : 16777216,
      verbosity: 0,
    }),
    [deviceOptimization],
  );

  const pageLoadingComponent = useMemo(
    () => (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    ),
    [],
  );

  const pageErrorComponent = useMemo(
    () => (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg">
        <p className="text-red-600">Failed to load page</p>
      </div>
    ),
    [],
  );

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

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker/pdf.worker.min.mjs`;
    performanceMonitor.reset();
    performanceMonitor.startTimer("documentLoad");

    return () => {
      performanceMonitor.reset();
    };
  }, [pdfFile]);

  useEffect(() => {
    setScale(isMobile ? 0.6 : 0.8);
    setPageNumber(1);
    setError(null);
    setPageWidth(0);
  }, [pdfFile, setScale, setPageNumber, setError, isMobile]);

  const onDocumentLoadSuccess = useCallback(
    (pdf: any) => {
      performanceMonitor.endTimer("documentLoad");
      performanceMonitor.startTimer("totalLoad");

      baseOnDocumentLoadSuccess(pdf);
      setPageNumber(1);
      setScale(isMobile ? 0.6 : 0.8);

      if (deviceOptimization.shouldPreload) {
        const preloadPages = Math.min(
          deviceOptimization.maxConcurrentPages,
          pdf.numPages,
        );

        for (let i = 1; i <= preloadPages; i++) {
          pdf
            .getPage(i)
            .then((page: any) => {
              const scale = deviceOptimization.shouldReduceQuality ? 0.1 : 0.2;
              const viewport = page.getViewport({ scale });
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d");
              canvas.height = viewport.height;
              canvas.width = viewport.width;

              if (context) {
                page.render({
                  canvasContext: context,
                  viewport: viewport,
                });
              }
            })
            .catch(() => {});
        }
      }

      setTimeout(
        () => {
          pdf
            .getOutline()
            .then((outline: any) => {
              if (outline) {
                setBookmarks(outline);
              }
            })
            .catch(() => {});
        },
        deviceOptimization.hasSlowConnection ? 500 : 100,
      );

      performanceMonitor.endTimer("totalLoad");
      performanceMonitor.logMetrics();
    },
    [
      baseOnDocumentLoadSuccess,
      deviceOptimization,
      setPageNumber,
      setScale,
      isMobile,
    ],
  );

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
      const pageHeight = 842;
      const containerWidth =
        containerRef.current.offsetWidth - (showSidebar ? 300 : 40);
      const pageWidthPoints = 595;

      const scaleHeight = containerHeight / pageHeight;
      const scaleWidth = containerWidth / pageWidthPoints;
      const newScale = Math.max(
        0.1,
        Math.min(3.0, Math.min(scaleHeight, scaleWidth)),
      );
      setScale(newScale);
    }
  }, [showSidebar, setScale]);

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

  const onPageLoadSuccess = useCallback(
    (page: any) => {
      performanceMonitor.endTimer("pageRender");

      if (pageWidth === 0) {
        const viewport = page.getViewport({ scale: 1 });
        setPageWidth(viewport.width);

        requestAnimationFrame(() => {
          if (containerRef.current && viewMode === "single") {
            const containerWidth =
              containerRef.current.offsetWidth - (showSidebar ? 300 : 40);
            const pageWidthAt100 = viewport.width;

            if (pageWidthAt100 > containerWidth * 1.5) {
              fitPage();
            }
          }
        });
      }
    },
    [pageWidth, viewMode, fitPage, showSidebar],
  );

  useEffect(() => {
    if (!numPages || !pageNumber) return;

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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !fitPage) return;

    const resizeObserver = new ResizeObserver(() => {
      if (viewMode === "single") {
        fitPage();
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [fitPage, viewMode]);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = pdfFile.split("/").pop() || "document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [pdfFile]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

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

  const handlePreviousPage = useCallback(() => {
    if (pageNumber > 1) {
      const newPage = pageNumber - 1;
      setPageNumber(newPage);
    }
  }, [pageNumber, setPageNumber, numPages]);

  const handleNextPage = useCallback(() => {
    if (pageNumber < numPages && numPages > 0) {
      const newPage = pageNumber + 1;
      setPageNumber(newPage);
    }
  }, [pageNumber, numPages, setPageNumber]);

  return (
    <PDFContainer
      ref={containerRef}
      className={`${isFullscreen ? "fullscreen" : ""} ${className}`}
      data-testid="pdf-viewer"
    >
      <PDFControlsWrapper>
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
              )
            }
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
              )
            }
            isNext={true}
          />
        </div>

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

          {enableBookmarks && (
            <BookmarkControl
              isBookmarked={bookmarks.some((b) => b.page === pageNumber)}
              onToggle={() => toggleBookmark(pageNumber)}
              onShowBookmarks={() => toggleSidebar("bookmarks")}
              bookmarkLabel={messages.bookmark}
              bookmarksOpen={showSidebar && sidebarMode === "bookmarks"}
            />
          )}

          <FullscreenControl
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
            label={messages.fullscreen}
          />
        </div>
      </PDFControlsWrapper>

      <div className="flex flex-1 overflow-hidden">
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

        <PDFDocumentWrapper
          className={`${showSidebar ? "with-sidebar" : ""} ${viewMode}`}
        >
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => {
              performanceMonitor.endTimer("documentLoad");
              setError(error.message);
              onError?.();
            }}
            loading={<PDFLoading loadingText={messages.loading} />}
            error={
              <PDFError errorTitle={messages.error} errorMessage={error} />
            }
            className="pdf-document"
            options={documentOptions}
            onItemClick={() => {}}
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
                        if (pageNumber < numPages) {
                        }
                        performanceMonitor.endTimer("pageRender");
                      }}
                      onLoadStart={() => {
                        performanceMonitor.startTimer("pageRender");
                      }}
                    />

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
                    {Array.from({ length: numPages }).map((_, index) => (
                      <div
                        key={`page_${index + 1}`}
                        className="pdf-page-container"
                      >
                        <MemoizedPage
                          pageNumber={index + 1}
                          scale={scale}
                          onLoadSuccess={onPageLoadSuccess}
                          renderTextLayer={index < 3}
                          renderAnnotationLayer={index < 3}
                          className="pdf-page border border-gray-300 shadow-lg rounded-lg"
                          loading={pageLoadingComponent}
                        />

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
