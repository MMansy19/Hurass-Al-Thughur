import { Metadata } from "next/types";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import SEO from "@/components/ui/SEO";
import { StructuredData } from "@/components/ui/StructuredData";

const PDFViewerSectionWithSelector = dynamic(
  () => import("@/components/magazine/PDFViewerSectionWithSelector"),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
    ),
  },
);

const EnhancedPerformanceMonitor = dynamic(
  () => import("@/components/ui/EnhancedPerformanceMonitor"),
);

export async function generateMetadata({
  params,
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      languages: {
        ar: `/ar/magazine`,
        en: `/en/magazine`,
      },
    },
    verification: {
      google: "your-google-verification-code",
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

export default async function EnhancedMagazinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { magazine } = messages;

  const magazineIssues: MagazineIssue[] = [
    {
      id: "1",
      title: magazine.issues.issue1.title,
      description: magazine.issues.issue1.description,
      coverImage: "/images/magazine/1.png",
      pdfUrl: "/pdfs/1.pdf",
      date: magazine.issues.issue1.date,
      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.aqeedah,
      tags: [messages.hardcoded.faith, messages.hardcoded.monotheism],
    },
    {
      id: "2",
      title: magazine.issues.issue2.title,
      description: magazine.issues.issue2.description,
      coverImage: "/images/magazine/2.png",
      pdfUrl: "/pdfs/2.pdf",
      date: magazine.issues.issue2.date,
      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.fiqh,
      tags: [messages.hardcoded.jurisprudence, messages.hardcoded.rulings],
    },
    {
      id: "3",
      title: magazine.issues.issue3.title,
      description: magazine.issues.issue3.description,
      coverImage: "/images/magazine/3.png",
      pdfUrl: "/pdfs/3.pdf",
      date: magazine.issues.issue3.date,
      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.prophetBiography,
      tags: [messages.hardcoded.prophetsBiography, messages.hardcoded.ethics],
    },
    {
      id: "4",
      title: magazine.issues.issue4.title,
      description: magazine.issues.issue4.description,
      coverImage: "/images/magazine/4.png",
      pdfUrl: "/pdfs/4.pdf",
      date: magazine.issues.issue4.date,
      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.aqeedah,
      tags: [messages.hardcoded.faith, messages.hardcoded.prophethood],
    },
    {
      id: "5",
      title: magazine.issues.issue5.title,
      description: magazine.issues.issue5.description,
      coverImage: "/images/magazine/5.png",
      pdfUrl: "/pdfs/5.pdf",
      date: magazine.issues.issue5.date,
      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.aqeedah,
      tags: [messages.hardcoded.fitrah, messages.hardcoded.guidance],
    },
    {
      id: "6",
      title: magazine.issues.issue6.title,
      description: magazine.issues.issue6.description,
      coverImage: "/images/magazine/6.png",
      pdfUrl: "/pdfs/6.pdf",
      date: magazine.issues.issue6.date,
      author: messages.hardcoded.editorialTeam,
      category: magazine.categoryNames.aqeedah,
      tags: [messages.hardcoded.fitrah, messages.hardcoded.guidance],
    },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: magazine.title,
    description: magazine.description,
    url: `https://your-domain.com/${locale}/magazine`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://your-domain.com/${locale}/magazine/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Hurass Magazine",
      logo: {
        "@type": "ImageObject",
        url: "https://your-domain.com/logo.png",
      },
    },
  };

  return (
    <>
      <StructuredData data={structuredData} />

      {process.env.NODE_ENV === "development" && (
        <Suspense fallback={null}>
          <EnhancedPerformanceMonitor />
        </Suspense>
      )}

      <main id="main-content" className="space-y-12" role="main">
        <section className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white py-20 rounded-lg">
          <div className="container mx-auto sm:px-4 px-2 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {magazine.title}
            </h1>
            <p className="text-xl max-w-2xl mb-8">{magazine.description}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href={`#pdf-viewer`}
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-md font-bold hover:bg-white hover:text-emerald-700 transition-colors"
              >
                {magazine.pdfViewer}
              </Link>
            </div>
          </div>
        </section>

        <section id="pdf-viewer" aria-labelledby="pdf-viewer-heading">
          <div className="container mx-auto sm:px-4 px-2">
            <h2
              id="pdf-viewer-heading"
              className="text-3xl font-bold text-emerald-800 mb-6"
            >
              {magazine.pdfViewer}
            </h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
              <PDFViewerSectionWithSelector
                issues={magazineIssues}
                magazine={magazine}
                locale={locale}
                loadingMessage={messages?.hardcoded?.loadingPDFViewer}
                selectIssueText={
                  messages?.hardcoded?.selectIssue || "Select an issue"
                }
                noIssuesText={
                  messages?.hardcoded?.noIssues || "No issues available"
                }
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
