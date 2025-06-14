
import { Metadata } from "next/types";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { StructuredData } from "@/components/ui/StructuredData";
import { MagazineGridWrapper } from "@/components/ui/MagazineGridWrapper";

// Dynamic imports for better code splitting
const PDFViewerSection = dynamic(() => import("@/components/pdf/PDFViewerSection"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
});

const EnhancedPerformanceMonitor = dynamic(() => import("@/components/ui/EnhancedPerformanceMonitor"));

// Generate metadata for the page with enhanced SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return {
    ...SEO({
      title: messages.magazine.title,
      description: messages.magazine.description,
      locale,
      pageName: "magazine",
    }),
    // Enhanced SEO properties
    keywords: [
      locale === "ar" ? "مجلة إسلامية" : "Islamic magazine",
      locale === "ar" ? "القرآن الكريم" : "Quran",
      locale === "ar" ? "السنة النبوية" : "Hadith",
      locale === "ar" ? "الفقه الإسلامي" : "Islamic jurisprudence",
      locale === "ar" ? "العقيدة" : "Islamic belief",
      locale === "ar" ? "التاريخ الإسلامي" : "Islamic history"
    ].join(", "),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      languages: {
        'ar': `/ar/magazine`,
        'en': `/en/magazine`,
      },
    },
    verification: {
      google: 'your-google-verification-code',
    },
  };
}

interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  date: string;
  category: string;
  author?: string;
  tags?: string[];
}

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
}

export default async function EnhancedMagazinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Import translations
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { magazine } = messages;
  // Enhanced mock data for magazine issues with more realistic content
  const magazineIssues: MagazineIssue[] = [
    {
      id: "1",
      title: magazine.issues.issue1.title,
      description: magazine.issues.issue1.description,
      coverImage: "/images/magazine-cover-1.jpg",
      pdfUrl: "/pdfs/magazine-issue-1.pdf",
      date: magazine.issues.issue1.date,      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.aqeedah,
      tags: [
        messages.hardcoded.faith,
        messages.hardcoded.monotheism
      ]
    },
    {
      id: "2",
      title: magazine.issues.issue2.title,
      description: magazine.issues.issue2.description,
      coverImage: "/images/magazine-cover-2.jpg",
      pdfUrl: "/pdfs/magazine-issue-2.pdf",
      date: magazine.issues.issue2.date,      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.fiqh,
      tags: [
        messages.hardcoded.jurisprudence,
        messages.hardcoded.rulings
      ]
    },
    {
      id: "3",
      title: magazine.issues.issue3.title,
      description: magazine.issues.issue3.description,
      coverImage: "/images/magazine-cover-3.jpg",
      pdfUrl: "/pdfs/magazine-issue-3.pdf",
      date: magazine.issues.issue3.date,      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.prophetBiography,
      tags: [
        messages.hardcoded.prophetsBiography,
        messages.hardcoded.ethics
      ]
    },
  ];
  // Enhanced categories with descriptions and icons
  const categories: Category[] = [
    {
      id: "1",      name: magazine.categoryNames.aqeedah,
      description: messages.hardcoded.articlesAboutIslamic,
      icon: "🕌"
    },
    {
      id: "2",      name: magazine.categoryNames.fiqh,
      description: messages.hardcoded.islamicJurisprudenceRulings,
      icon: "⚖️"
    },
    {
      id: "3",      name: magazine.categoryNames.prophetBiography,
      description: messages.hardcoded.biographyOfProphet,
      icon: "📖"
    },
    {
      id: "4",      name: magazine.categoryNames.islamicHistory,
      description: messages.hardcoded.historyOfIslamic,
      icon: "🏛️"
    },
  ];

  const selectedIssue = magazineIssues[0] || null;
  // Enhanced skip links
  const skipLinks = [
    { href: "#main-content", label: messages.hardcoded.skipToMainContent },
    { href: "#search", label: messages.hardcoded.skipToSearch },
    { href: "#latest-issues", label: messages.hardcoded.skipToLatestIssues },
    { href: "#pdf-viewer", label: messages.hardcoded.skipToPDFViewer },
    { href: "#categories", label: messages.hardcoded.skipToCategories },
  ];

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": magazine.title,
    "description": magazine.description,
    "url": `https://your-domain.com/${locale}/magazine`,
    "inLanguage": locale,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://your-domain.com/${locale}/magazine/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hurass Magazine",
      "logo": {
        "@type": "ImageObject",
        "url": "https://your-domain.com/logo.png"
      }
    }
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <SkipLinks links={skipLinks} />

      {/* Performance monitoring in development */}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <EnhancedPerformanceMonitor />
        </Suspense>
      )}

      <main id="main-content" className="space-y-12" role="main">
        {/* Hero Section */}          
        <section className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-20 rounded-lg">
          <div className="container mx-auto sm:px-4 px-2 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{magazine.title}</h1>
            <p className="text-xl max-w-2xl mb-8">{magazine.description}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`#latest-issues`}
                className="px-8 py-3 bg-white text-emerald-700 rounded-md font-bold hover:bg-gray-100 transition-colors"
              >
                {magazine.latestIssues}
              </Link>
              <Link
                href={`#categories`}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md font-bold hover:bg-white hover:text-emerald-700 transition-colors"
              >
                {magazine.categories}
              </Link>
            </div>
          </div>
        </section>        
 
         {/* Latest Issues Section */}
        <section
          id="latest-issues"
          className="pb-12"
          aria-labelledby="latest-issues-heading"
        >
          <div className="container mx-auto sm:px-4 px-2">
            <div className="mb-12 flex justify-between items-center">
              <h2 id="latest-issues-heading" className="text-3xl font-bold text-emerald-800">
                {magazine.latestIssues}
              </h2>              <Link
                href={`/${locale}/magazine/all`}
                className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg sm:px-4 px-2 py-2 font-semibold hover:bg-emerald-50"
                aria-label={`${magazine.allIssues} - ${messages.hardcoded.opensInNewPage}`}
              >
                {magazine.allIssues}
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
            <MagazineGridWrapper
              issues={magazineIssues}
              locale={locale}
              columns={3}
            />
          </div>
        </section>        
        {/* PDF Viewer Section */}
        <section id="pdf-viewer" aria-labelledby="pdf-viewer-heading">
          <div className="container mx-auto sm:px-4 px-2">            
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <Suspense fallback={
                  <div className="h-96 bg-gray-100 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>                    <p className="text-gray-600">
                        {messages.hardcoded.loadingPDFViewer}
                      </p>
                    </div>
                  </div>
                }>
                <PDFViewerSection
                  pdfUrl={`/pdfs/${selectedIssue?.id}.pdf`}
                  title={selectedIssue?.title || magazine.title}
                  messages={magazine}
                />
              </Suspense>
            </div>
          </div>
        </section>        
        {/* Categories Section */}
        <section
          id="categories"
          className="py-12 bg-gray-50 rounded-lg"
          aria-labelledby="categories-heading"
        >
          <div className="container mx-auto sm:px-4 px-2">
            <div className="text-center mb-12">
              <h2 id="categories-heading" className="text-3xl font-bold text-emerald-800 mb-4">
                {magazine.categories}
              </h2>              <p className="text-gray-600 max-w-2xl mx-auto">
                {messages.hardcoded.exploreSections}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${locale}/magazine/category/${category.id}`}
                  className="block bg-white border border-gray-200 p-6 rounded-lg text-center hover:bg-emerald-50 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors shadow-md hover:shadow-lg"
                  aria-label={`${messages.hardcoded.browseCategoryText}: ${category.name}`}
                >
                  <div className="text-3xl mb-4">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-lg text-emerald-900 mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {category.description}
                    </p>
                  )}                  <div className="inline-flex items-center text-emerald-600 font-medium">
                    {messages.hardcoded.browse}
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>        
        {/* Newsletter Subscription Section */}
        <section className="py-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg text-white" aria-labelledby="newsletter-heading">
          <div className="container mx-auto sm:px-4 px-2 text-center">            <h2 id="newsletter-heading" className="text-3xl font-bold mb-4">
              {messages.newsletter.subscribeTitle}
            </h2>            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              {messages.newsletter.subscribeDescription}
            </p>

            <form className="max-w-md mx-auto flex gap-3">
              <input
                type="email"
                placeholder={messages.newsletter.enterEmail}
                className="flex-1 sm:px-4 px-2 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                required
              />              <button
                type="submit"
                className="px-6 py-3 bg-white text-emerald-600 rounded-md font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-emerald-600"
              >
                {messages.newsletter.subscribe}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}
