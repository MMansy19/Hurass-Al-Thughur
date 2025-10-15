import { Metadata } from "next/types";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
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
    image: "/images/logo.jpg",
    locale,
    pageName: "library",
  });
}

interface LibraryPageProps {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string; search?: string }>;
}

export default async function LibraryPage({ params }: LibraryPageProps) {
  const { locale } = await params;
  
  const messages = (await import(`@/locales/${locale}.json`)).default;

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

        <section className="container mx-auto sm:p-4 p-2">
                <PDFBrowser
                  translations={{
                    browseAllPDFs: messages.library.browsePDFs,
                    viewPDF: messages.library.viewPDF,
                    noPDFsFound: messages.library.noPDFsFound,
                    search: messages.library.search,
                    searchPlaceholder: messages.library.searchPlaceholder,
                    category: messages.library.categoryLabel,
                    allCategories: messages.library.allCategoriesLabel,
                  }}
                />
            </section>
        </main>
    </>
  );
}