"use client";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Import custom hooks
import { usePDFViewer } from "./hooks/usePDFViewer";

// Import components
import { 
  PDFControlsWrapper, 
  NavigationButton, 
  PageIndicator, 
  ZoomControl 
} from "./controls/Controls";
import { 
  PDFContainer, 
  PDFDocumentWrapper, 
  PDFLoading, 
  PDFError 
} from "./ui/PDFComponents";

// Configure PDF.js worker
// Use the CDN for reliability since we've resolved the version issues with webpack
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfFile: string;
  messages: {
    previousPage: string;
    nextPage: string;
    zoomIn: string;
    zoomOut: string;
    loading: string;
    error: string;
  };
}

export default function PDFViewer({ pdfFile, messages }: PDFViewerProps) {
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
    onDocumentLoadSuccess
  } = usePDFViewer();

  // Previous page button icon
  const prevIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  // Next page button icon
  const nextIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <PDFContainer>
      {/* Controls */}
      <PDFControlsWrapper>
        <NavigationButton 
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          label={messages.previousPage}
          icon={prevIcon}
        />

        <PageIndicator 
          currentPage={pageNumber} 
          totalPages={numPages} 
        />

        <NavigationButton 
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages}
          label={messages.nextPage}
          icon={nextIcon}
          isNext={true}
        />

        <ZoomControl 
          scale={scale}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          zoomInLabel={messages.zoomIn}
          zoomOutLabel={messages.zoomOut}
        />
      </PDFControlsWrapper>

      {/* PDF Document */}
      <PDFDocumentWrapper>        
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={(error) => setError(error.message)}
          loading={<PDFLoading loadingText={messages.loading} />}
          error={<PDFError errorTitle={messages.error} errorMessage={error} />}
        >
          {!error && (
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="border border-gray-100 shadow-sm"
            />
          )}
        </Document>
      </PDFDocumentWrapper>
    </PDFContainer>
  );
}