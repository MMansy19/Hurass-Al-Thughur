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
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="p-4 flex flex-col h-full">        <div className="flex items-center mb-3">
          <svg
            className="w-8 h-8 text-red-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-medium text-lg" dir="auto">
            {displayName}
          </h3>
        </div>
        
        {description && (
          <p className="text-gray-600 text-sm mb-3 flex-grow" dir="auto">
            {description}
          </p>
        )}
        
        <div className="mt-auto pt-4">
          <Link
            href={`/${locale}/library/pdf/${encodedPath}`}
            className="block w-full sm:px-4 px-2 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
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

export function PDFGrid({ pdfs, locale, viewText, emptyMessage }: PDFGridProps) {
  if (pdfs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
