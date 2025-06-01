import { Metadata } from "next/types";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import SEO from "@/components/ui/SEO";
import PDFViewerSection from "@/components/pdf/PDFViewerSection";
import { getPDFTitle, getPDFDescription } from "@/config/pdf-metadata";

// Generate metadata for the page
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string, pdfName: string }> 
}): Promise<Metadata> {
  const { locale, pdfName } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const decodedPdfName = decodeURIComponent(pdfName);
  const pdfTitle = getPDFTitle(decodedPdfName, locale);
  const pdfDescription = getPDFDescription(decodedPdfName, locale);
  
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
    // Decode the PDF filename
  const decodedPdfName = decodeURIComponent(pdfName);
  const pdfUrl = `/pdfs/${decodedPdfName}`;
  const pdfTitle = getPDFTitle(decodedPdfName, locale);

  // Verify if PDF exists by checking if file exists in the public/pdfs directory
  const pdfPath = path.join(process.cwd(), 'public', 'pdfs', decodedPdfName);  const fileExists = (() => {
    try {
      return fs.existsSync(pdfPath);
    } catch {
      return false;
    }
  })();
  
  if (!fileExists) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto sm:px-4 px-2 px-2">
          <h1 className="text-3xl font-bold mb-2">{pdfTitle}</h1>
          <p className="text-lg">{library.preview}</p>
        </div>
      </section>      
      <div className="container mx-auto sm:px-4 px-2 px-2">
          <PDFViewerSection 
            pdfUrl={pdfUrl}
            title={pdfTitle}
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
            }}
          />
      </div>
    </div>
  );
}
