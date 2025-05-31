"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, Suspense } from "react";
import { PDFErrorBoundary } from "@/utils/error-handling";
import { PDFViewerSkeleton } from "@/components/ui/LoadingStates";

// Dynamic import of the PDFViewer component with enhanced error handling
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => <PDFViewerSkeleton />,
});

// Enhanced loading placeholder component
function PDFLoadingPlaceholder() {
  return (
    <div className="flex justify-center items-center h-96 bg-gray-50 rounded-lg">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">Loading PDF Viewer</p>
          <p className="text-sm text-gray-500">Please wait while we prepare your document...</p>
        </div>
      </div>
    </div>
  );
}

// Section header with PDF icon
function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        className="w-8 h-8 text-emerald-600"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L11.5,17.5L13,19L14.5,17.5L16,19V15.5H10V19Z" />
      </svg>
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
  );
}

interface PDFViewerSectionProps {
  pdfUrl: string;
  title: string;
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

export default function PDFViewerSection({
  pdfUrl,
  title,
  messages,
}: PDFViewerSectionProps) {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Use useEffect to ensure we only render the PDF viewer on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleError = () => {
    setHasError(true);
  };

  const retryLoading = () => {
    setHasError(false);
    setIsClient(false);
    // Force re-render
    setTimeout(() => setIsClient(true), 100);
  };

  return (
    <section className="space-y-6">
      <SectionHeader title={title} />
      
      {hasError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 text-red-400">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">PDF Loading Failed</h3>
          <p className="text-gray-600 mb-4">
            We encountered an error while loading the PDF viewer. This might be due to a network issue or the PDF file being temporarily unavailable.
          </p>
          <div className="space-y-2">
            <button 
              onClick={retryLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="ml-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      ) : (
        <PDFErrorBoundary>
          <Suspense fallback={<PDFLoadingPlaceholder />}>
            {isClient && (
              <PDFViewer 
                pdfFile={pdfUrl} 
                messages={messages}
                onError={handleError}
              />
            )}
          </Suspense>
        </PDFErrorBoundary>
      )}
    </section>
  );
}