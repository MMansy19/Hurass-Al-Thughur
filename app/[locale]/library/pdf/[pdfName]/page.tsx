import { Metadata } from "next/types";
import { notFound } from "next/navigation";
import SEO from "@/components/ui/SEO";
import PDFViewerSection from "@/components/pdf/PDFViewerSection";
import { getPDFByFilename, getPDFTitleFromRecord, getPDFDescriptionFromRecord, getPDFUrlFromRecord, getCoverImageFromPDF } from "@/utils/pdf-helpers";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pdfName: string }>;
}): Promise<Metadata> {
  const { locale, pdfName } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const decodedPdfName = decodeURIComponent(pdfName);
  
  // Fetch PDF data from Supabase
  const pdfData = await getPDFByFilename(decodedPdfName);
  if (!pdfData) {
    return SEO({
      title: messages.library.title,
      description: messages.library.description,
      locale,
      pageName: "library",
    });
  }

  const pdfTitle = getPDFTitleFromRecord(pdfData, locale);
  const pdfDescription = getPDFDescriptionFromRecord(pdfData, locale);

  return SEO({
    title: `${messages.library.title} - ${pdfTitle}`,
    description: pdfDescription || messages.library.description,
    locale,
    pageName: "library",
  });
}

export default async function PDFViewPage({
  params,
}: {
  params: Promise<{ locale: string; pdfName: string }>;
}) {
  const { locale, pdfName } = await params;
  // Import translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { library } = messages;

  if (!pdfName) {
    notFound();
  }
  
  // Decode the PDF filename and fetch data from Supabase
  const decodedPdfName = decodeURIComponent(pdfName);
  const pdfData = await getPDFByFilename(decodedPdfName);

  // Check if PDF exists in database
  if (!pdfData) {
    notFound();
  }

  // Extract data from PDF record
  const pdfUrl = getPDFUrlFromRecord(pdfData);
  const pdfTitle = getPDFTitleFromRecord(pdfData, locale);
  const pdfDescription = getPDFDescriptionFromRecord(pdfData, locale);
  const coverImageUrl = getCoverImageFromPDF(pdfData);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-10 rounded-lg shadow-lg">
        <div className="container mx-auto sm:px-4 px-2">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Cover Image */}
            {coverImageUrl && (
              <div className="flex-shrink-0">
                <img
                  src={coverImageUrl}
                  alt={pdfTitle}
                  className="w-48 h-64 object-cover rounded-lg shadow-md border-4 border-white/20"
                />
              </div>
            )}
            
            {/* PDF Information */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4" dir="auto">{pdfTitle}</h1>
              {pdfDescription && (
                <p className="text-xl mb-6 leading-relaxed text-emerald-50" dir="auto">
                  {pdfDescription}
                </p>
              )}
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {pdfData.author && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-200">Author:</span>
                    <span className="font-semibold">{pdfData.author}</span>
                  </div>
                )}
                
                {pdfData.category && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-200">Category:</span>
                    <span className="font-semibold">{pdfData.category}</span>
                  </div>
                )}
                
                {pdfData.publish_date && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-200">Published:</span>
                    <span className="font-semibold">{pdfData.publish_date}</span>
                  </div>
                )}
                
                {pdfData.file_size_mb && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-200">File Size:</span>
                    <span className="font-semibold">{pdfData.file_size_mb} MB</span>
                  </div>
                )}
                
                {pdfData.page_count && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-200">Pages:</span>
                    <span className="font-semibold">{pdfData.page_count}</span>
                  </div>
                )}

                {pdfData.is_issue && pdfData.issue_number && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <svg className="w-5 h-5 text-emerald-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-emerald-200">Issue Number:</span>
                    <span className="font-semibold">#{pdfData.issue_number}</span>
                  </div>
                )}
              </div>
              
              {/* Tags */}
              {pdfData.tags && pdfData.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-emerald-200 font-semibold mb-2">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {pdfData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 text-white text-sm rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Full PDF Data Display Section */}
      <section className="container mx-auto sm:px-4 px-2">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete PDF Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Basic Information</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-600">ID:</span>
                  <span className="ml-2">{pdfData.id}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Filename:</span>
                  <span className="ml-2 font-mono text-blue-600">{pdfData.filename}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Created:</span>
                  <span className="ml-2">{new Date(pdfData.created_at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Updated:</span>
                  <span className="ml-2">{new Date(pdfData.updated_at).toLocaleString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Published:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${pdfData.is_published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {pdfData.is_published ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Featured:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${pdfData.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                    {pdfData.is_featured ? 'Yes' : 'No'}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Type:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${pdfData.is_issue ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                    {pdfData.is_issue ? 'Magazine Issue' : 'Library PDF'}
                  </span>
                </div>
              </div>
            </div>

            {/* Multilingual Content */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Multilingual Content</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">Arabic Title:</h4>
                  <p className="text-right bg-gray-50 p-3 rounded" dir="rtl">{pdfData.title_ar}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-600 mb-2">English Title:</h4>
                  <p className="bg-gray-50 p-3 rounded">{pdfData.title_en}</p>
                </div>
                
                {pdfData.description_ar && (
                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">Arabic Description:</h4>
                    <p className="text-right bg-gray-50 p-3 rounded text-sm" dir="rtl">{pdfData.description_ar}</p>
                  </div>
                )}
                
                {pdfData.description_en && (
                  <div>
                    <h4 className="font-medium text-gray-600 mb-2">English Description:</h4>
                    <p className="bg-gray-50 p-3 rounded text-sm">{pdfData.description_en}</p>
                  </div>
                )}
              </div>
            </div>

            {/* SEO Information */}
            {(pdfData.meta_description_ar || pdfData.meta_description_en || pdfData.slug_ar || pdfData.slug_en) && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">SEO Information</h3>
                
                <div className="space-y-3 text-sm">
                  {pdfData.meta_description_ar && (
                    <div>
                      <span className="font-medium text-gray-600">Arabic Meta Description:</span>
                      <p className="mt-1 text-right bg-gray-50 p-2 rounded text-xs" dir="rtl">{pdfData.meta_description_ar}</p>
                    </div>
                  )}
                  {pdfData.meta_description_en && (
                    <div>
                      <span className="font-medium text-gray-600">English Meta Description:</span>
                      <p className="mt-1 bg-gray-50 p-2 rounded text-xs">{pdfData.meta_description_en}</p>
                    </div>
                  )}
                  {pdfData.slug_ar && (
                    <div>
                      <span className="font-medium text-gray-600">Arabic Slug:</span>
                      <span className="ml-2 font-mono text-blue-600">{pdfData.slug_ar}</span>
                    </div>
                  )}
                  {pdfData.slug_en && (
                    <div>
                      <span className="font-medium text-gray-600">English Slug:</span>
                      <span className="ml-2 font-mono text-blue-600">{pdfData.slug_en}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Technical Information</h3>
              
              <div className="space-y-3 text-sm">
                {pdfData.google_drive_id && (
                  <div>
                    <span className="font-medium text-gray-600">Google Drive ID:</span>
                    <span className="ml-2 font-mono text-blue-600">{pdfData.google_drive_id}</span>
                  </div>
                )}
                {pdfData.cover_image_id && (
                  <div>
                    <span className="font-medium text-gray-600">Cover Image ID:</span>
                    <span className="ml-2 font-mono text-blue-600">{pdfData.cover_image_id}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-600">PDF URL:</span>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline break-all text-xs">
                    {pdfUrl}
                  </a>
                </div>
                {coverImageUrl && (
                  <div>
                    <span className="font-medium text-gray-600">Cover Image URL:</span>
                    <a href={coverImageUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline break-all text-xs">
                      {coverImageUrl}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto sm:px-4 px-2 px-2">
        <PDFViewerSection
          pdfUrl={pdfUrl}
          title={pdfTitle}
          locale={locale}
          messages={{
            previousPage: library.previousPage,
            nextPage: library.nextPage,
            zoomIn: library.zoomIn,
            zoomOut: library.zoomOut,
            loading: library.loading,
            error: library.error,
            search: library.searchInDocument,
            searchResults: library.searchResults,
            thumbnails: library.thumbnails,
            fullscreen: library.fullscreen,
            fitWidth: library.fitWidth,
            fitPage: library.fitPage,
            download: library.download,
            print: library.print,
            bookmark: library.bookmark,
            annotations: library.annotations,
            highlight: library.highlight,
            notes: library.notes,
            actualSize: library.actualSize,
            pageWidth: library.pageWidth,
            twoPages: library.twoPages,
            continuous: library.continuous,
            single: library.single,
            facing: library.facing,
            outline: library.outline,
            noMatches: library.noMatches,
            matches: library.matches,
            page: locale === "ar" ? "صفحة" : "Page",
          }}
        />
      </div>
    </div>
  );
}
