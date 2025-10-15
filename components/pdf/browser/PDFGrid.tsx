"use client";

import Link from "next/link";
import { PDFRecord } from "@/types/pdf";
import { getPDFTitleFromRecord, getPDFDescriptionFromRecord, getCoverImageFromPDF } from "@/utils/pdf-helpers";
import Image from "next/image";

interface PDFCardProps {
  pdf: PDFRecord;
  locale: string;
  viewText: string;
}

export function PDFCard({ pdf, locale, viewText }: PDFCardProps) {
  const displayName = getPDFTitleFromRecord(pdf, locale);
  const description = getPDFDescriptionFromRecord(pdf, locale);
  const coverImageUrl = getCoverImageFromPDF(pdf);
  
  // Always use the filename for routing, not the full path/URL
  const encodedFilename = encodeURIComponent(pdf.filename);

  // Fallback cover image path for old system
  const pdfNumber = pdf.filename.replace(/\.pdf$/i, "");
  const fallbackCoverImagePath = `/images/magazine/${pdfNumber}.png`;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Cover Image Section */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald-100 to-emerald-200 overflow-hidden">
        <Image
          src={coverImageUrl || fallbackCoverImagePath}
          alt={displayName}
          width={400}
          height={533}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        {/* Hidden fallback that shows when image fails */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 hidden">
          <div className="w-16 h-16 text-emerald-600">
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* PDF Type Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
            PDF
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col min-h-[200px]">
        <div className="flex items-center mb-3">
          <svg
            className="w-6 h-6 text-red-500 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-medium text-lg truncate" dir="auto">
            {displayName}
          </h3>
        </div>
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3" dir="auto">
            {description}
          </p>
        )}
        
        {/* Metadata */}
        <div className="space-y-1 text-xs text-gray-500 mb-3">
          {pdf.author && (
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{pdf.author}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {pdf.tags && pdf.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {pdf.tags.slice(0, 3).map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded"
                >
                  {tag}
                </span>
              ))}
              {pdf.tags.length > 3 && (
                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                  +{pdf.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Button pushed to bottom */}
        <div className="mt-auto">
          <Link
            href={`/${locale}/library/pdf/${encodedFilename}`}
            className="block w-full px-4 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium"
          >
            {viewText}
          </Link>
        </div>
      </div>
    </div>
  );
}

interface PDFGridProps {
  pdfs: PDFRecord[];
  locale: string;
  viewText: string;
  emptyMessage: string;
}

export function PDFGrid({
  pdfs,
  locale,
  viewText,
  emptyMessage,
}: PDFGridProps) {
  if (pdfs.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {pdfs.map((pdf) => (
        <PDFCard
          key={pdf.id}
          pdf={pdf}
          locale={locale}
          viewText={viewText}
        />
      ))}
    </div>
  );
}
