"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useWindowSize } from "@/utils/useWindowSize";

interface PDFViewerProps {
  pdfFile: string;
  messages: {
    previousPage: string;
    nextPage: string;
    zoomIn: string;
    zoomOut: string;
    loading: string;
  };
}

const PDFViewer = ({ pdfFile, messages }: PDFViewerProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const { width } = useWindowSize();
    // Set up the worker for pdf.js
  useEffect(() => {
    // Only set the worker source in the browser environment
    // Use the static file from the public directory
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker/pdf.worker.min.js`;
  }, []);

  // Adjust scale based on screen width
  useEffect(() => {
    if (width < 640) {
      setScale(0.7);
    } else if (width < 1024) {
      setScale(0.9);
    } else {
      setScale(1.2);
    }
  }, [width]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), numPages);
    });
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function zoomIn() {
    setScale(prevScale => Math.min(prevScale + 0.2, 3));
  }

  function zoomOut() {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  }
  return (
    <div className="flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-inner">
      <div className="flex flex-wrap justify-center items-center w-full mb-6 gap-3">
        <div className="flex rounded-md shadow-sm">
          <button
            onClick={previousPage}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-emerald-600 text-white rounded-l-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors flex items-center"
            aria-label={messages.previousPage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 me-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {messages.previousPage}
          </button>
          <span className="px-4 py-2 bg-white border-t border-b flex items-center justify-center min-w-[100px]">
            {pageNumber} / {numPages}
          </span>
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className="px-4 py-2 bg-emerald-600 text-white rounded-r-md disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-emerald-700 transition-colors flex items-center"
            aria-label={messages.nextPage}
          >
            {messages.nextPage}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ms-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="flex rounded-md shadow-sm">
          <button
            onClick={zoomOut}
            className="px-3 py-2 bg-blue-600 text-white rounded-l-md hover:bg-blue-700 transition-colors"
            aria-label={messages.zoomOut}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={zoomIn}
            className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition-colors"
            aria-label={messages.zoomIn}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pdf-container border border-gray-300 rounded-lg shadow-lg overflow-auto bg-white max-w-full">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col justify-center items-center h-[600px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-gray-600 font-medium">{messages.loading}</p>
            </div>
          }
          error={
            <div className="flex justify-center items-center h-[600px]">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                <div className="flex items-center text-red-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-bold">Error loading PDF</h3>
                </div>
                <p className="text-gray-700">The PDF file could not be loaded. Please try again later or contact support.</p>
              </div>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="pdf-page"
          />
        </Document>
      </div>
    </div>
  );
};

export default PDFViewer;
