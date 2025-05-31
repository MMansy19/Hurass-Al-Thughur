"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// Dynamic import of the PDFViewer component to avoid SSR issues
const PDFViewer = dynamic(() => import("./PDFViewer"), {
  ssr: false,
  loading: () => <PDFLoadingPlaceholder />,
});

// Loading placeholder component
function PDFLoadingPlaceholder() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
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

  // Use useEffect to ensure we only render the PDF viewer on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section className="space-y-6">
      <SectionHeader title={title} />
      {isClient && <PDFViewer pdfFile={pdfUrl} messages={messages} />}
    </section>
  );
}