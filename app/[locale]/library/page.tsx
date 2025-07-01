import { Metadata } from "next/types";
import SEO from "@/components/ui/SEO";
import PDFBrowser from "@/components/pdf/PDFBrowser";

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

export default async function LibraryPage({
  params, 
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { library } = messages;

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-10 rounded-lg shadow-lg">
        <div className="container mx-auto sm:px-4 px-2 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{library.title}</h1>
          <p className="text-xl mt-2 max-w-2xl mx-auto">
            {library.description}
          </p>
        </div>
      </section>

      {/* PDF Browser Section */}
      <section className="py-8">
        <div className="container mx-auto sm:px-4 px-2">
          <h2 className="text-2xl font-bold mb-6">{library.pdfs}</h2>
          <PDFBrowser
            translations={{
              browseAllPDFs: library.browsePDFs,
              viewPDF: library.viewPDF,
              noPDFsFound: library.noPDFsFound,
              search: library.search,
              searchPlaceholder: library.searchPlaceholder,
            }}
          />
        </div>
      </section>
    </div>
  );
}
