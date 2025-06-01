"use client";

import { useParams } from "next/navigation";
import { NetworkErrorBoundary } from "@/utils/error-handling";
import { PDFGridSkeleton } from "@/components/ui/LoadingStates";

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
    error,
    retryFetch
  } = usePDFBrowser();

  // Loading state with enhanced skeleton
  if (isLoading) {
    return <PDFGridSkeleton />;
  }

  // Error state with retry functionality
  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-red-700">
        <div className="flex items-center mb-4">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="font-bold">Error Loading PDFs</h3>
        </div>
        <p className="mb-4">{error}</p>
        <div className="space-x-2">
          <button 
            onClick={retryFetch}
            className="bg-red-600 hover:bg-red-700 text-white sm:px-4 px-2 py-2 rounded transition-colors"
          >
            Retry
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gray-600 hover:bg-gray-700 text-white sm:px-4 px-2 py-2 rounded transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <NetworkErrorBoundary>
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
    </NetworkErrorBoundary>
  );
}
