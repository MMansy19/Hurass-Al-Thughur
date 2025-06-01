import { Metadata } from "next/types";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { Motion } from "@/components/ui/AnimationSystem";
import PDFViewer from "@/components/pdf/PDFViewer";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string; brochureId: string }>;
}): Promise<Metadata> {
  const { locale, brochureId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  // Get brochure data (in real app, this would be from database/API)
  const brochureTitle = getBrochureTitle(brochureId, messages);
  
  return {
    ...SEO({
      title: `${brochureTitle} - ${messages.library.title}`,
      description: `${messages.library.description} - ${brochureTitle}`,
      locale,
      pageName: `library-brochure-${brochureId}`,
    }),
    robots: {
      index: true,
      follow: true,
    },
  };
}

function getBrochureTitle(brochureId: string, messages: Record<string, any>): string {
  const isArabic = messages.common.language === 'العربية';
  
  // Mock brochure data (in real app, this would be from database/API)
  const brochures: Record<string, { titleAr: string; titleEn: string }> = {
    "1": {
      titleAr: "مطوية التوحيد",
      titleEn: "Tawheed Brochure"
    },
    "2": {
      titleAr: "دليل المسلم الجديد",
      titleEn: "New Muslim Guide"
    },
    "3": {
      titleAr: "كيف تصلي",
      titleEn: "How to Pray"
    }
  };
  
  const brochure = brochures[brochureId];
  if (!brochure) return brochureId;
  
  return isArabic ? brochure.titleAr : brochure.titleEn;
}

interface BrochureData {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  pageCount: number;
  publishDate: string;
  author?: string;
  pdfUrl: string;
}

export default async function LibraryBrochurePage({
  params,
}: {
  params: Promise<{ locale: string; brochureId: string }>;
}) {
  const { locale, brochureId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { library } = messages;
  const isArabic = locale === 'ar';

  // Mock brochure data (in real app, this would be from database/API)
  const brochureData: BrochureData | null = getBrochureData(brochureId, isArabic);
  
  if (!brochureData) {
    notFound();
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <SkipLinks 
        links={[
          { href: "#main-content", label: isArabic ? "الانتقال إلى المحتوى الرئيسي" : "Skip to main content" },
          { href: "#pdf-viewer", label: isArabic ? "الانتقال إلى عارض PDF" : "Skip to PDF viewer" }
        ]}
      />
      
      <div id="main-content" className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8" aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"}>
          <ol className={`flex items-center space-x-2 text-sm ${isArabic ? 'flex-row-reverse space-x-reverse' : ''}`}>
            <li>
              <Link 
                href={`/${locale}`}
                className="text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                {messages.common.home}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                href={`/${locale}/library`}
                className="text-emerald-600 hover:text-emerald-800 transition-colors"
              >
                {library.title}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <span className="text-emerald-600">
                {library.brochures}
              </span>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-800 font-medium">{brochureData.title}</li>
          </ol>
        </nav>

        {/* Page Header */}
        <Motion delay={0.1}>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {brochureData.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {brochureData.description}
            </p>
            
            {/* Brochure Metadata */}
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-lg p-6 shadow-sm ${isArabic ? 'text-right' : ''}`}>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {isArabic ? 'التصنيف' : 'Category'}
                </h3>
                <p className="text-gray-900 font-medium">{brochureData.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {isArabic ? 'حجم الملف' : 'File Size'}
                </h3>
                <p className="text-gray-900 font-medium">{brochureData.fileSize}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {isArabic ? 'عدد الصفحات' : 'Pages'}
                </h3>
                <p className="text-gray-900 font-medium">{brochureData.pageCount}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  {isArabic ? 'تاريخ النشر' : 'Published'}
                </h3>
                <p className="text-gray-900 font-medium">{brochureData.publishDate}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex gap-4 mt-6 ${isArabic ? 'flex-row-reverse' : ''}`}>
              <a
                href={brochureData.pdfUrl}
                download
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {library.download}
              </a>
              <button 
                onClick={() => navigator.share?.({ 
                  title: brochureData.title, 
                  text: brochureData.description,
                  url: window.location.href 
                })}
                className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                {messages.common.share}
              </button>
            </div>
          </div>
        </Motion>        {/* PDF Viewer */}
        <Motion delay={0.2}>
          <section id="pdf-viewer" className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Suspense fallback={
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">{library.loading}</p>
                </div>
              </div>
            }>              <PDFViewer
                pdfFile={brochureData.pdfUrl}
                messages={{
                  previousPage: library.previousPage,
                  nextPage: library.nextPage,
                  zoomIn: library.zoomIn,
                  zoomOut: library.zoomOut,
                  loading: library.loading,
                  error: library.error,
                  thumbnails: library.thumbnails,
                  fullscreen: library.fullscreen,
                  fitWidth: library.fitWidth,
                  fitPage: library.fitPage,
                  download: library.download,
                  print: library.print,
                  bookmark: isArabic ? "إشارة مرجعية" : "Bookmark",
                  annotations: isArabic ? "التعليقات" : "Annotations",
                  highlight: isArabic ? "تمييز" : "Highlight",
                  notes: isArabic ? "ملاحظات" : "Notes",
                  actualSize: isArabic ? "الحجم الفعلي" : "Actual Size",
                  pageWidth: isArabic ? "عرض الصفحة" : "Page Width",
                  twoPages: isArabic ? "صفحتان" : "Two Pages",
                  continuous: isArabic ? "مستمر" : "Continuous",
                  outline: isArabic ? "المخطط التفصيلي" : "Outline",
                  facing: isArabic ? "متقابل" : "Facing",
                  single: isArabic ? "صفحة واحدة" : "Single",
                  noMatches: isArabic ? "لا توجد مطابقات" : "No matches",
                  matches: isArabic ? "مطابقات" : "matches"
                }}
                className="min-h-[600px]"
              />
            </Suspense>
          </section>
        </Motion>

        {/* Back to Library Button */}
        <Motion delay={0.3}>
          <div className="mt-8 text-center">
            <Link
              href={`/${locale}/library`}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium transition-colors"
            >
              <svg className={`w-5 h-5 ${isArabic ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {library.backToLibrary || messages.common.goToLibrary}
            </Link>
          </div>
        </Motion>
      </div>
    </main>
  );
}

function getBrochureData(brochureId: string, isArabic: boolean): BrochureData | null {
  // Mock brochure data (in real app, this would be from database/API)
  const brochures: Record<string, BrochureData> = {
    "1": {
      id: "1",
      title: isArabic ? "مطوية التوحيد" : "Tawheed Brochure",
      description: isArabic 
        ? "مطوية تعريفية شاملة بأساسيات التوحيد في الإسلام وأهميته في حياة المسلم"
        : "Comprehensive introductory brochure on the basics of Tawheed in Islam and its importance in a Muslim's life",
      category: isArabic ? "التوحيد" : "Tawheed",
      fileSize: "1.2 MB",
      pageCount: 8,
      publishDate: isArabic ? "محرم 1445" : "August 2023",
      author: isArabic ? "فريق حراس الثغور" : "Hurass Team",
      pdfUrl: "/pdfs/1.pdf"
    },
    "2": {
      id: "2", 
      title: isArabic ? "دليل المسلم الجديد" : "New Muslim Guide",
      description: isArabic
        ? "دليل شامل للمسلم الجديد يحتوي على الأساسيات التي يحتاج إلى معرفتها"
        : "Comprehensive guide for new Muslims containing the basics they need to know",
      category: isArabic ? "العبادات" : "Worship",
      fileSize: "2.1 MB",
      pageCount: 16,
      publishDate: isArabic ? "صفر 1445" : "September 2023",
      author: isArabic ? "فريق حراس الثغور" : "Hurass Team",
      pdfUrl: "/pdfs/2.pdf"
    },
    "3": {
      id: "3",
      title: isArabic ? "كيف تصلي" : "How to Pray",
      description: isArabic
        ? "دليل مصور ومفصل لكيفية أداء الصلاة بالطريقة الصحيحة"
        : "Illustrated and detailed guide on how to perform prayer correctly",
      category: isArabic ? "العبادات" : "Worship", 
      fileSize: "1.8 MB",
      pageCount: 12,
      publishDate: isArabic ? "ربيع الأول 1445" : "October 2023",
      author: isArabic ? "فريق حراس الثغور" : "Hurass Team",
      pdfUrl: "/pdfs/3.pdf"
    }
  };

  return brochures[brochureId] || null;
}
