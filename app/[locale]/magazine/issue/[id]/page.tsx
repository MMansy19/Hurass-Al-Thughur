import { Metadata } from "next/types";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { Motion } from "@/components/ui/AnimationSystem";
import { PDFViewerSkeleton } from "@/components/ui/LoadingStates";
import dynamic from "next/dynamic";

// Dynamic import of PDF viewer
const PDFViewerSection = dynamic(() => import("@/components/pdf/PDFViewerSection"), {
  loading: () => <PDFViewerSkeleton />,
  ssr: false
});

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  // Get issue data (you can expand this to fetch from a database)
  const issueData = getMagazineIssue(id, messages.magazine, locale);
  
  if (!issueData) {
    return {
      title: `${messages.notFound.title} - ${messages.magazine.title}`,
      description: messages.notFound.message,
    };
  }
  
  return {
    ...SEO({
      title: `${issueData.title} - ${messages.magazine.title}`,
      description: issueData.description,
      locale,
      pageName: `magazine-issue-${id}`,
    }),
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface MagazineIssue {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  pdfUrl: string;
  fileSize?: string;
  pageCount?: number;
  author?: string;
  tags?: string[];
}

function getMagazineIssue(id: string, magazine: any, locale: string): MagazineIssue | null {
  const isArabic = locale === 'ar';
  
  // Mock data - in a real app, this would come from a database
  const issues: Record<string, MagazineIssue> = {
    "1": {
      id: "1",
      title: magazine.issues.issue1.title,
      description: magazine.issues.issue1.description,
      date: magazine.issues.issue1.date,
      category: magazine.categoryNames.aqeedah,
      pdfUrl: "/pdfs/magazine-issue-1.pdf",
      fileSize: "2.5 MB",
      pageCount: 32,
      author: isArabic ? "فريق التحرير" : "Editorial Team",
      tags: [
        isArabic ? "العقيدة" : "Faith",
        isArabic ? "التوحيد" : "Monotheism"
      ]
    },
    "2": {
      id: "2",
      title: magazine.issues.issue2.title,
      description: magazine.issues.issue2.description,
      date: magazine.issues.issue2.date,
      category: magazine.categoryNames.fiqh,
      pdfUrl: "/pdfs/magazine-issue-2.pdf",
      fileSize: "3.1 MB",
      pageCount: 40,
      author: isArabic ? "فريق التحرير" : "Editorial Team",
      tags: [
        isArabic ? "الفقه" : "Jurisprudence",
        isArabic ? "الأحكام" : "Rulings"
      ]
    },
    "3": {
      id: "3",
      title: magazine.issues.issue3.title,
      description: magazine.issues.issue3.description,
      date: magazine.issues.issue3.date,
      category: magazine.categoryNames.prophetBiography,
      pdfUrl: "/pdfs/magazine-issue-3.pdf",
      fileSize: "2.8 MB",
      pageCount: 36,
      author: isArabic ? "فريق التحرير" : "Editorial Team",
      tags: [
        isArabic ? "السيرة النبوية" : "Prophet's Biography",
        isArabic ? "الأخلاق" : "Ethics"
      ]
    },
    "4": {
      id: "4",
      title: isArabic ? "الأخلاق في الإسلام" : "Ethics in Islam",
      description: isArabic ? "دليل شامل للأخلاق الإسلامية وتطبيقها في الحياة اليومية" : "A comprehensive guide to Islamic ethics and their application in daily life",
      date: isArabic ? "ربيع الأول 1445" : "October 2023",
      category: magazine.categoryNames.aqeedah,
      pdfUrl: "/pdfs/magazine-issue-4.pdf",
      fileSize: "2.2 MB",
      pageCount: 28,
      author: isArabic ? "فريق التحرير" : "Editorial Team",
      tags: [
        isArabic ? "الأخلاق" : "Ethics",
        isArabic ? "السلوك" : "Behavior"
      ]
    },
    "5": {
      id: "5",
      title: isArabic ? "الزكاة وأحكامها" : "Zakat and its Rulings",
      description: isArabic ? "دليل مفصل لأحكام الزكاة ومقاديرها" : "A detailed guide to Zakat rulings and amounts",
      date: isArabic ? "صفر 1445" : "September 2023",
      category: magazine.categoryNames.fiqh,
      pdfUrl: "/pdfs/magazine-issue-5.pdf",
      fileSize: "1.9 MB",
      pageCount: 24,
      author: isArabic ? "فريق التحرير" : "Editorial Team",
      tags: [
        isArabic ? "الزكاة" : "Zakat",
        isArabic ? "الأحكام" : "Rulings"
      ]
    },
    "6": {
      id: "6",
      title: isArabic ? "الدعاء في الإسلام" : "Prayer in Islam",
      description: isArabic ? "آداب الدعاء وأوقاته المستجابة" : "Etiquette of prayer and blessed times for supplication",
      date: isArabic ? "محرم 1445" : "August 2023",
      category: magazine.categoryNames.prophetBiography,
      pdfUrl: "/pdfs/magazine-issue-6.pdf",
      fileSize: "2.7 MB",
      pageCount: 34,
      author: isArabic ? "فريق التحرير" : "Editorial Team",
      tags: [
        isArabic ? "الدعاء" : "Prayer",
        isArabic ? "الآداب" : "Etiquette"
      ]
    }
  };
  
  return issues[id] || null;
}

export default async function MagazineIssuePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { magazine } = messages;
  const isArabic = locale === 'ar';
  
  // Get issue data
  const issueData = getMagazineIssue(id, magazine, locale);
  
  if (!issueData) {
    notFound();
  }
  
  // Skip links for accessibility
  const skipLinks = [
    { href: "#main-content", label: isArabic ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content" },
    { href: "#pdf-viewer", label: isArabic ? "انتقل إلى عارض PDF" : "Skip to PDF viewer" },
    { href: "#issue-info", label: isArabic ? "انتقل إلى معلومات الإصدار" : "Skip to issue information" },
  ];

  return (
    <>
      <SkipLinks links={skipLinks} />
      
      <main id="main-content" className="space-y-8" role="main">
        {/* Issue Header */}
        <Motion preset="fadeInUp">
          <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-12 rounded-xl">
            <div className="container mx-auto sm:px-4 px-2">
              <div className="max-w-4xl mx-auto">
                {/* Breadcrumb */}
                <nav aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"} className="mb-6">
                  <ol className="flex items-center space-x-2 rtl:space-x-reverse text-emerald-100">
                    <li>
                      <Link 
                        href={`/${locale}`}
                        className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 rounded px-2 py-1"
                      >
                        {isArabic ? "الرئيسية" : "Home"}
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li>
                      <Link 
                        href={`/${locale}/magazine`}
                        className="hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-emerald-600 rounded px-2 py-1"
                      >
                        {magazine.title}
                      </Link>
                    </li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="text-white font-medium">
                      {issueData.title}
                    </li>
                  </ol>
                </nav>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {issueData.title}
                </h1>
                <p className="text-xl text-emerald-100 mb-6">
                  {issueData.description}
                </p>
                
                {/* Issue Metadata */}
                <div className="flex flex-wrap gap-4 text-emerald-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{issueData.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{issueData.category}</span>
                  </div>
                  {issueData.fileSize && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span>{issueData.fileSize}</span>
                    </div>
                  )}
                  {issueData.pageCount && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span>{issueData.pageCount} {isArabic ? "صفحة" : "pages"}</span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {issueData.tags && issueData.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {issueData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-emerald-800 bg-opacity-50 text-emerald-100 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </Motion>

        {/* PDF Viewer Section */}
        <Motion preset="fadeInUp" delay={200}>
          <section id="pdf-viewer" aria-labelledby="pdf-viewer-heading">
            <div className="container mx-auto sm:px-4 px-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <Suspense fallback={<PDFViewerSkeleton />}>
                  <PDFViewerSection 
                    pdfUrl={issueData.pdfUrl}
                    title={issueData.title}
                    messages={{
                      previousPage: magazine.previousPage,
                      nextPage: magazine.nextPage,
                      zoomIn: magazine.zoomIn,
                      zoomOut: magazine.zoomOut,
                      loading: magazine.loading,
                      error: magazine.error,
                      search: messages.hardcoded?.searchPDFViewer || "Search",
                      searchResults: messages.hardcoded?.searchResults || "Search Results",
                      thumbnails: messages.hardcoded?.thumbnails || "Thumbnails",
                      fullscreen: messages.hardcoded?.fullscreen || "Fullscreen",
                      fitWidth: messages.hardcoded?.fitWidth || "Fit Width",
                      fitPage: messages.hardcoded?.fitPage || "Fit Page",
                      download: magazine.download,
                      print: messages.hardcoded?.print || "Print",
                      bookmark: messages.hardcoded?.bookmark || "Bookmark",
                      annotations: messages.hardcoded?.annotations || "Annotations",
                      highlight: messages.hardcoded?.highlight || "Highlight",
                      notes: messages.hardcoded?.notes || "Notes",
                      actualSize: messages.hardcoded?.actualSize || "Actual Size",
                      pageWidth: messages.hardcoded?.pageWidth || "Page Width",
                      twoPages: messages.hardcoded?.twoPages || "Two Pages",
                      continuous: messages.hardcoded?.continuous || "Continuous",
                      single: messages.hardcoded?.single || "Single",
                      facing: messages.hardcoded?.facing || "Facing",
                      outline: messages.hardcoded?.outline || "Outline",
                      noMatches: messages.hardcoded?.noMatches || "No matches",
                      matches: messages.hardcoded?.matches || "matches",
                      pdfViewer: {
                        loadingViewer: messages.hardcoded?.loadingPDFViewer || "Loading PDF Viewer",
                        loadingDocument: messages.hardcoded?.loadingDocument || "Please wait while we prepare your document...",
                        errorLoadingPDFs: messages.hardcoded?.errorLoadingPDFs || "Error Loading PDF",
                      }
                    }}
                  />
                </Suspense>
              </div>
            </div>
          </section>
        </Motion>

        {/* Issue Information */}
        <Motion preset="fadeInUp" delay={300}>
          <section id="issue-info" className="py-8">
            <div className="container mx-auto sm:px-4 px-2">
              <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {isArabic ? "معلومات الإصدار" : "Issue Information"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      {isArabic ? "العنوان" : "Title"}
                    </h3>
                    <p className="text-gray-900">{issueData.title}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      {isArabic ? "التصنيف" : "Category"}
                    </h3>
                    <p className="text-gray-900">{issueData.category}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      {isArabic ? "تاريخ النشر" : "Publication Date"}
                    </h3>
                    <p className="text-gray-900">{issueData.date}</p>
                  </div>
                  
                  {issueData.author && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        {isArabic ? "المؤلف" : "Author"}
                      </h3>
                      <p className="text-gray-900">{issueData.author}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    {isArabic ? "الوصف" : "Description"}
                  </h3>
                  <p className="text-gray-900">{issueData.description}</p>
                </div>
                
                {/* Download Section */}
                <div className="mt-8 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
                  <h3 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {isArabic ? "تحميل الإصدار" : "Download Issue"}
                  </h3>
                  <p className="text-emerald-700 mb-4">
                    {isArabic 
                      ? "احصل على نسخة PDF للقراءة دون اتصال أو للطباعة والتوزيع"
                      : "Get a PDF copy for offline reading or printing and distribution"
                    }
                  </p>
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = issueData.pdfUrl;
                      link.download = `${issueData.title.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '_')}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {magazine.download}
                    {issueData.fileSize && (
                      <span className="text-emerald-200">
                        ({issueData.fileSize})
                      </span>
                    )}
                  </button>
                </div>
                
                {/* Navigation */}
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                  <Link
                    href={`/${locale}/magazine`}
                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {isArabic ? "العودة إلى المجلة" : "Back to Magazine"}
                  </Link>
                  
                  <Link
                    href={`/${locale}/magazine/all`}
                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 gap-2"
                  >
                    {isArabic ? "تصفح جميع الإصدارات" : "Browse All Issues"}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m-7-7h18" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </Motion>
      </main>
    </>
  );
}
