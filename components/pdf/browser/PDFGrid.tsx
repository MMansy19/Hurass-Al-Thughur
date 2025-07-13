"use client";

import Link from "next/link";
import { getPDFTitle, getPDFDescription } from "@/config/pdf-metadata";

interface PDFCardProps {
  name: string;
  path: string;
  locale: string;
  viewText: string;
}

export function PDFCard({ name, path, locale, viewText }: PDFCardProps) {
  const displayName = getPDFTitle(name, locale);
  const description = getPDFDescription(name, locale);
  const encodedPath = encodeURIComponent(path.replace("/pdfs/", ""));

  // Extract PDF number from filename (e.g., "1.pdf" -> "1")
  const pdfNumber = name.replace(".pdf", "");
  const coverImagePath = `/images/magazine/${pdfNumber}.png`;

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      {/* Cover Image Section */}
      <div className="relative aspect-[3/4] bg-gradient-to-br from-emerald-100 to-emerald-200 overflow-hidden">
        <img
          src={coverImagePath}
          alt={displayName}
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
      <div className="p-4 flex flex-col h-auto">
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
          <p className="text-gray-600 text-sm mb-4 line-clamp-3" dir="auto">
            {description}
          </p>
        )}
        <div className="mt-auto">
          <Link
            href={`/${locale}/library/pdf/${encodedPath}`}
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
  pdfs: Array<{ name: string; path: string }>;
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
      {pdfs.map((pdf, index) => (
        <PDFCard
          key={index}
          name={pdf.name}
          path={pdf.path}
          locale={locale}
          viewText={viewText}
        />
      ))}
    </div>
  );
}
