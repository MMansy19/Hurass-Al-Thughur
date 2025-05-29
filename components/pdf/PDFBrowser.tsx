"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface PDFFile {
  name: string;
  path: string;
}

interface PDFBrowserProps {
  translations: {
    browseAllPDFs: string;
    viewPDF: string;
    noPDFsFound: string;
    search: string;
    searchPlaceholder: string;
  };
}

export default function PDFBrowser({ translations }: PDFBrowserProps) {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [filteredPDFs, setFilteredPDFs] = useState<PDFFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  const locale = params.locale as string;

  useEffect(() => {
    async function fetchPDFList() {
      try {
        const response = await fetch(`/api/pdfs`);
        if (!response.ok) {
          throw new Error("Failed to fetch PDF list");
        }
        const data = await response.json();
        setPdfFiles(data);
        setFilteredPDFs(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching PDFs:", error);
        setIsLoading(false);
      }
    }

    fetchPDFList();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPDFs(pdfFiles);
    } else {
      const filtered = pdfFiles.filter((pdf) =>
        pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPDFs(filtered);
    }
  }, [searchTerm, pdfFiles]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-emerald-800">
        {translations.browseAllPDFs}
      </h2>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={translations.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 border rounded-lg pl-10 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {filteredPDFs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {translations.noPDFsFound}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPDFs.map((pdf, index) => (
            <div
              key={index}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center mb-3">
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
                    {pdf.name.replace(".pdf", "")}
                  </h3>
                </div>
                
                <div className="mt-auto pt-4">
                  <Link
                    href={`/${locale}/library/pdf/${encodeURIComponent(
                      pdf.path.replace("/pdfs/", "")
                    )}`}
                    className="block w-full px-4 py-2 text-center bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    {translations.viewPDF}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
