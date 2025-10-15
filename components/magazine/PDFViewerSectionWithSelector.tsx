"use client";

import { useState } from "react";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import IssueSelector from "./IssueSelector";
import { MagazineIssue } from "@/types/magazine";

// Dynamic import for PDFViewerSection
const PDFViewerSection = dynamic(
  () => import("@/components/pdf/PDFViewerSection"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
    ),
  },
);

interface PDFViewerSectionWithSelectorProps {
  issues: MagazineIssue[];
  magazine: any;
  locale: string;
  loadingMessage: string;
  selectIssueText: string;
  noIssuesText: string;
}

export default function PDFViewerSectionWithSelector({
  issues,
  magazine,
  locale,
  loadingMessage,
  selectIssueText,
  noIssuesText,
}: PDFViewerSectionWithSelectorProps) {
  const [selectedIssue, setSelectedIssue] = useState<MagazineIssue | null>(
    () => {
      return issues.length > 0 ? issues[0] || null : null;
    },
  );

  if (!selectedIssue || issues.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{noIssuesText}</p>
      </div>
    );
  }

  return (
    <div>
      {/* Issue Selector */}
      <div className="px-6 py-4 bg-gray-50 border-b">
        <IssueSelector
          issues={issues}
          selectedIssue={selectedIssue}
          onIssueChange={setSelectedIssue}
          locale={locale}
          selectIssueText={selectIssueText}
        />
      </div>

      {/* Selected Issue Info */}
      <div className="px-6 py-4 bg-emerald-50 border-b">
        <div className="flex items-start gap-4">
          <img
            src={selectedIssue.coverImage}
            alt={selectedIssue.title}
            className="w-16 h-20 object-cover rounded-lg shadow-sm border"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/images/magazine/placeholder.svg";
            }}
          />
          <div className="">
            <h3 className="text-lg font-semibold text-emerald-900 mb-1">
              {selectedIssue.title}
            </h3>
            <p className="text-sm text-emerald-700 mb-2">
              {selectedIssue.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{selectedIssue.date}</span>
              <span>•</span>
              <span>{selectedIssue.category}</span>
              {selectedIssue.author && (
                <>
                  <span>•</span>
                  <span>{selectedIssue.author}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="min-h-[600px]">
        <Suspense
          fallback={
            <div className="h-96 bg-gray-100 animate-pulse flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">{loadingMessage}</p>
              </div>
            </div>
          }
        >
          <PDFViewerSection
            pdfUrl={selectedIssue.pdfUrl}
            title={selectedIssue.title}
            messages={magazine}
            locale={locale}
          />
        </Suspense>
      </div>
    </div>
  );
}
