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
    <section className="bg-gray-50 py-10 rounded-lg">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="my-8">
          <PDFViewer 
            pdfFile={pdfUrl} 
            messages={messages}
          />
        </div>
      </div>
    </section>
  );
}
