"use client";

import { useParams } from "next/navigation";

// Import custom hook for PDF browser functionality
import { usePDFBrowser } from "./hooks/usePDFBrowser";

// Import PDF browser components
import { SearchBar } from "./browser/SearchBar";
import { PDFGrid } from "./browser/PDFGrid";

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
  // Get locale from URL parameters
  const params = useParams();
  const locale = params.locale as string;
  
  // Use custom hook for PDF browser functionality
  const { 
    filteredPDFs,
    isLoading,
    searchTerm,
    setSearchTerm,
    error
  } = usePDFBrowser();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-red-700">
        <h3 className="font-bold mb-2">Error loading PDFs</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-emerald-800">
        {translations.browseAllPDFs}
      </h2>

      {/* Search Bar Component */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder={translations.searchPlaceholder}
        searchLabel={translations.search}
      />
      
      {/* PDF Grid Component */}
      <PDFGrid
        pdfs={filteredPDFs}
        locale={locale}
        viewText={translations.viewPDF}
        emptyMessage={translations.noPDFsFound}
      />
    </section>
  );
}
