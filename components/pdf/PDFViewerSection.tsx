"use client";

import dynamic from "next/dynamic";

// Dynamic import for PDFViewer component to ensure it only loads on the client
const PDFViewer = dynamic(() => import("@/components/pdf/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  ),
});

interface PDFViewerSectionProps {
  pdfUrl: string;
  title: string;
  messages: {
    previousPage: string;
    nextPage: string;
    zoomIn: string;
    zoomOut: string;
    loading: string;
  };
}

export default function PDFViewerSection({ pdfUrl, title, messages }: PDFViewerSectionProps) {
  return (
    <section className="bg-white py-10 rounded-lg shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <svg className="w-8 h-8 text-emerald-600 mx-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L11.5,17.5L13,19L14.5,17.5L16,19V15.5H10V19Z" />
          </svg>
          <h2 className="text-2xl font-bold text-emerald-800">{title}</h2>
        </div>

        <div className="my-8 max-w-screen-xl mx-auto overflow-hidden">
          <PDFViewer 
            pdfFile={pdfUrl} 
            messages={messages}
          />
        </div>
      </div>
    </section>
  );
}
