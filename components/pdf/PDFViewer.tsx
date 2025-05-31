"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState, useCallback, useRef } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Import custom hooks
import { usePDFViewer } from "./hooks/usePDFViewer";

// Import components
import { 
  PDFControlsWrapper, 
  NavigationButton, 
  PageIndicator, 
  ZoomControl,
  AdvancedControls,
  SearchControl,
  ViewModeControl,
  FullscreenControl
} from "./controls/Controls";
import { 
  PDFContainer, 
  PDFDocumentWrapper, 
  PDFLoading,
  PDFError,
  PDFSidebar,
  PDFThumbnails
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
    search: string;
    thumbnails: string;
    fullscreen: string;
    fitWidth: string;
    fitPage: string;
    download: string;
    print: string;
  };
}

export default function PDFViewer({ pdfFile, messages }: PDFViewerProps) {  // Enhanced state management
  const [viewMode, setViewMode] = useState<'single' | 'continuous' | 'facing'>('single');
  const [showSidebar, setShowSidebar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  // Configure PDF.js worker once on component mount
  useEffect(() => {
    const setupWorker = () => {
      // Use local worker file with correct version matching pdfjs-dist 4.8.69
      pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker/pdf.worker.min.mjs`;
    };
    
    setupWorker();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          changePage(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          changePage(1);
          break;
        case 'Home':
          e.preventDefault();
          setPageNumber(1);
          break;
        case 'End':
          e.preventDefault();
          setPageNumber(numPages);
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case 'f':
          if (e.ctrlKey) {
            e.preventDefault();
            // Focus search input
          }
          break;
        case 'F11':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use custom hook for PDF viewer functionality
  const {
    numPages,
    pageNumber,
    scale,
    error,
    setError,
    changePage,
    zoomIn,
    zoomOut,
    onDocumentLoadSuccess,
    setPageNumber
  } = usePDFViewer();
  // Enhanced zoom functions
  const fitWidth = useCallback(() => {
    if (containerRef.current) {
      // const containerWidth = containerRef.current.offsetWidth - 40; // Account for padding
      // const pageWidth = 595; // Standard A4 width in points
      // const newScale = containerWidth / pageWidth;
      // setScale(newScale); // Will need to add this to the hook
    }
  }, []);
  const fitPage = useCallback(() => {
    if (containerRef.current) {
      // const containerHeight = containerRef.current.offsetHeight - 100; // Account for controls
      // const pageHeight = 842; // Standard A4 height in points
      // const newScale = containerHeight / pageHeight;
      // setScale(newScale); // Will need to add this to the hook
    }
  }, []);

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

  // Search functionality
  const handleSearch = useCallback((text: string) => {
    setSearchText(text);
    // Implement search logic here
    // This would involve parsing the PDF text and finding matches
  }, []);

  // Download functionality
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = pdfFile;
    link.download = pdfFile.split('/').pop() || 'document.pdf';
    link.click();
  }, [pdfFile]);

  // Print functionality
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Navigation icons
  const prevIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const nextIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
  return (
    <PDFContainer ref={containerRef} className={isFullscreen ? 'fullscreen' : ''}>
      {/* Enhanced Controls */}
      <PDFControlsWrapper>
        {/* Primary Navigation */}
        <div className="flex items-center gap-2">
          <NavigationButton 
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            label={messages.previousPage}
            icon={prevIcon}
          />

          <PageIndicator 
            currentPage={pageNumber} 
            totalPages={numPages}
            onPageChange={setPageNumber}
          />

          <NavigationButton 
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages}
            label={messages.nextPage}
            icon={nextIcon}
            isNext={true}
          />
        </div>        {/* Search Control */}
        <SearchControl
          value={searchText}
          onChange={handleSearch}
          results={0}
          currentResult={0}
          placeholder={messages.search}
        />

        {/* View Controls */}
        <div className="flex items-center gap-2">
          <ViewModeControl
            mode={viewMode}
            onChange={setViewMode}
            fitWidth={fitWidth}
            fitPage={fitPage}
            fitWidthLabel={messages.fitWidth}
            fitPageLabel={messages.fitPage}
          />

          <ZoomControl 
            scale={scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            zoomInLabel={messages.zoomIn}
            zoomOutLabel={messages.zoomOut}
          />
        </div>

        {/* Advanced Controls */}
        <AdvancedControls
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onDownload={handleDownload}
          onPrint={handlePrint}
          sidebarOpen={showSidebar}
          thumbnailsLabel={messages.thumbnails}
          downloadLabel={messages.download}
          printLabel={messages.print}
        />

        {/* Fullscreen Control */}
        <FullscreenControl
          isFullscreen={isFullscreen}
          onToggle={toggleFullscreen}
          label={messages.fullscreen}
        />
      </PDFControlsWrapper>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar with Thumbnails */}
        {showSidebar && (
          <PDFSidebar>
            <PDFThumbnails
              file={pdfFile}
              numPages={numPages}
              currentPage={pageNumber}
              onPageSelect={setPageNumber}
              scale={0.2}
            />
          </PDFSidebar>
        )}

        {/* Main PDF Document */}
        <PDFDocumentWrapper className={`${showSidebar ? 'with-sidebar' : ''} ${viewMode}`}>        
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => setError(error.message)}
            loading={<PDFLoading loadingText={messages.loading} />}
            error={<PDFError errorTitle={messages.error} errorMessage={error} />}
            className="pdf-document"
          >
            {!error && (
              <>
                {viewMode === 'single' && (
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    className="pdf-page border border-gray-300 shadow-lg rounded-lg mb-4"
                  />
                )}
                
                {viewMode === 'continuous' && (
                  <div className="pdf-continuous">
                    {Array.from(new Array(numPages), (el, index) => (
                      <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="pdf-page border border-gray-300 shadow-lg rounded-lg mb-4"
                      />
                    ))}
                  </div>
                )}

                {viewMode === 'facing' && (
                  <div className="pdf-facing flex gap-4">
                    {pageNumber > 1 && (
                      <Page
                        pageNumber={pageNumber - 1}
                        scale={scale * 0.8}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="pdf-page border border-gray-300 shadow-lg rounded-lg"
                      />
                    )}
                    <Page
                      pageNumber={pageNumber}
                      scale={scale * 0.8}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="pdf-page border border-gray-300 shadow-lg rounded-lg"
                    />
                  </div>
                )}
              </>
            )}
          </Document>
        </PDFDocumentWrapper>
      </div>

      {/* Keyboard Shortcuts Overlay */}
      {isFullscreen && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-sm">
          <div className="font-semibold mb-2">Keyboard Shortcuts:</div>
          <div>← → Navigation</div>
          <div>+ - Zoom</div>
          <div>Home/End First/Last page</div>
          <div>F11 Exit fullscreen</div>
        </div>
      )}
    </PDFContainer>
  );
}