import { Metadata } from "next/types";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { getAllPDFs, convertToLibraryPDF, getPDFCategories } from "@/utils/pdf-helpers";
import LibraryFilters from "@/components/ui/LibraryFilters";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return SEO({
    title: messages.library.title,
    description: messages.library.description,
    locale,
    pageName: "library",
  });
}

interface LibraryPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; search?: string }>;
}

async function getLibraryData(category?: string, search?: string) {
  try {
    const [pdfs, categories] = await Promise.all([
      getAllPDFs(category),
      getPDFCategories()
    ]);

    let filteredPDFs = pdfs;

    // Filter by search query if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPDFs = pdfs.filter(pdf => 
        pdf.title_ar.toLowerCase().includes(searchLower) ||
        pdf.title_en.toLowerCase().includes(searchLower) ||
        pdf.description_ar?.toLowerCase().includes(searchLower) ||
        pdf.description_en?.toLowerCase().includes(searchLower) ||
        pdf.author?.toLowerCase().includes(searchLower) ||
        pdf.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return { pdfs: filteredPDFs, categories };
  } catch (error) {
    console.error('Error fetching library data:', error);
    return { pdfs: [], categories: [] };
  }
}

export default async function LibraryPage({ params, searchParams }: LibraryPageProps) {
  const { locale } = await params;
  const { category, search } = (await searchParams) || {};
  
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { pdfs, categories } = await getLibraryData(category, search);
  
  const libraryPDFs = pdfs.map(pdf => convertToLibraryPDF(pdf, locale));

  return (
    <>
      <SkipLinks links={[
        { href: '#main-content', label: messages.accessibility?.skipToContent || 'Skip to main content' },
        { href: '#library-grid', label: messages.accessibility?.skipToLibrary || 'Skip to library' }
      ]} />
      <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {messages.library.title}
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                {messages.library.description}
              </p>
            </div>
          </div>
        </header>

          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Filters and Search */}
            <div>
              <LibraryFilters 
                categories={categories}
                messages={messages}
                currentCategory={category || ''}
                currentSearch={search || ''}
              />
            </div>

            {/* Results Count */}
            <div className="text-center mb-6">
              <p className="text-slate-600">
                {libraryPDFs.length === 0 
                  ? (messages.library.noPDFsFound || 'No PDFs found')
                  : (messages.library.pdfCount?.replace('{count}', libraryPDFs.length.toString()) || `${libraryPDFs.length} PDFs found`)
                }
              </p>
            </div>

            {/* PDF Grid */}
            <div id="library-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {libraryPDFs.map((pdf) => (
                <div key={pdf.id} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  {/* Cover Image */}
                  {pdf.coverImageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pdf.coverImageUrl}
                        alt={pdf.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}

                  <div className="p-4">
                    {/* Title */}
                    <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2">
                      {pdf.title}
                    </h3>

                    {/* Description */}
                    {pdf.description && (
                      <p className="text-slate-600 text-sm mb-3 line-clamp-3">
                        {pdf.description}
                      </p>
                    )}

                    {/* Metadata */}
                    <div className="space-y-2 text-xs text-slate-500">
                      {pdf.author && (
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          <span>{pdf.author}</span>
                        </div>
                      )}
                      {pdf.category && (
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          <span>{pdf.category}</span>
                        </div>
                      )}
                      {pdf.publishDate && (
                        <div className="flex items-center space-x-1 rtl:space-x-reverse">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{pdf.publishDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {pdf.tags && pdf.tags.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {pdf.tags.slice(0, 3).map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
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

                    {/* Actions */}
                    <div className="mt-4 flex space-x-2 rtl:space-x-reverse">
                      <a
                        href={pdf.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                      >
                        {messages.library.viewPDF || 'View PDF'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {libraryPDFs.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-24 h-24 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  {messages.library.noPDFsFound || 'No PDFs found'}
                </h3>
                <p className="text-slate-500">
                  {messages.library.tryDifferentSearch || 'Try adjusting your search criteria'}
                </p>
              </div>
            )}
          </div>
        </main>
    </>
  );
}