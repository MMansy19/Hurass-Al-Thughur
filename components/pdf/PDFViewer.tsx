"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useWindowSize } from "../../utils/useWindowSize";

// Set up the worker for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

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
    <div className="flex flex-col items-center bg-neutral-100 p-4 rounded-lg">
      <div className="flex justify-center w-full mb-4">
        <button
          onClick={previousPage}
          disabled={pageNumber <= 1}
          className="px-4 py-2 bg-emerald-600 text-white rounded-l-md disabled:bg-gray-400"
          aria-label={messages.previousPage}
        >
          {messages.previousPage}
        </button>
        <span className="px-4 py-2 bg-white border-t border-b">
          {pageNumber} / {numPages}
        </span>
        <button
          onClick={nextPage}
          disabled={pageNumber >= numPages}
          className="px-4 py-2 bg-emerald-600 text-white rounded-r-md disabled:bg-gray-400"
          aria-label={messages.nextPage}
        >
          {messages.nextPage}
        </button>
        
        <div className="ml-4">
          <button
            onClick={zoomOut}
            className="px-3 py-2 bg-blue-600 text-white rounded-l-md"
            aria-label={messages.zoomOut}
          >
            -
          </button>
          <button
            onClick={zoomIn}
            className="px-3 py-2 bg-blue-600 text-white rounded-r-md"
            aria-label={messages.zoomIn}
          >
            +
          </button>
        </div>
      </div>
      
      <div className="pdf-container border border-gray-300 rounded shadow-lg overflow-auto">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex justify-center items-center h-[600px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600"></div>
              <p className="ml-2">{messages.loading}</p>
            </div>
          }
          error={
            <div className="flex justify-center items-center h-96">
              <p className="text-red-500">Error loading PDF</p>
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
