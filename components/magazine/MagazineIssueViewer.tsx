'use client';

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { PDFViewerSkeleton } from "@/components/ui/LoadingStates";

// Dynamic import of PDF viewer with ssr: false (only allowed in client components)
const PDFViewerSection = dynamic(() => import("@/components/pdf/PDFViewerSection"), {
  loading: () => <PDFViewerSkeleton />,
  ssr: false
});

interface MagazineIssueViewerProps {
  pdfUrl: string;
  title: string;
  locale: string;
  messages: any;
}
export default function MagazineIssueViewer({ pdfUrl, title, messages }: MagazineIssueViewerProps) {
  return (
    <Suspense fallback={<PDFViewerSkeleton />}>
      <PDFViewerSection
        pdfUrl={pdfUrl}
        title={title}
        messages={messages}
      />
    </Suspense>
  );
}
