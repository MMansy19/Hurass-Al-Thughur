import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import fs from "fs";
import path from "path";
import SEO from "@/components/ui/SEO";
import PDFViewerSection from "@/components/pdf/PDFViewerSection";

// Generate metadata for the page
export async function generateMetadata({ 
  params: { locale, pdfName } 
}: { 
  params: { locale: string, pdfName: string } 
}): Promise<Metadata> {
  const messages = (await import(`@/locales/${locale}.json`)).default;
  return SEO({
    title: `${messages.library.title} - ${decodeURIComponent(pdfName).replace(".pdf", "")}`,
    description: messages.library.description,
    locale,
    pageName: "library",
  });
}

export default async function PDFViewPage({
  params: { locale, pdfName },
}: {
  params: { locale: string; pdfName: string };
}) {
  // Import translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { library } = messages;
  
  if (!pdfName) {
    notFound();
  }
  
  // Decode the PDF filename
  const decodedPdfName = decodeURIComponent(pdfName);
  const pdfUrl = `/pdfs/${decodedPdfName}`;
  const pdfTitle = decodedPdfName.replace(".pdf", "");

  // Verify if PDF exists by checking if file exists in the public/pdfs directory
  const pdfPath = path.join(process.cwd(), 'public', 'pdfs', decodedPdfName);
  const fileExists = (() => {
    try {
      return fs.existsSync(pdfPath);
    } catch (e) {
      return false;
    }
  })();
  
  if (!fileExists) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <section className="bg-emerald-700 text-white py-10 rounded-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">{pdfTitle}</h1>
          <p className="text-lg">{library.preview}</p>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <PDFViewerSection 
            pdfUrl={pdfUrl}
            title={pdfTitle}
            messages={{
              previousPage: messages.magazine.previousPage,
              nextPage: messages.magazine.nextPage,
              zoomIn: messages.magazine.zoomIn,
              zoomOut: messages.magazine.zoomOut,
              loading: messages.magazine.loading
            }}
          />
        </div>
      </div>
    </div>
  );
}
