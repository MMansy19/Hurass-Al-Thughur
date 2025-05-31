import { Metadata } from "next/types";
import Link from "next/link";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import SEO from "@/components/ui/SEO";
import { SkipLinks, VisuallyHidden } from "@/components/ui/AccessibilityComponents";
import { Motion, StaggerContainer } from "@/components/ui/AnimationSystem";
import { AnimatedMagazineCard, AnimatedSearchBar } from "@/components/ui/AnimatedComponents";
import { IntegratedMagazineGrid, IntegratedSearchInterface } from "@/components/ui/IntegratedComponents";
import { StructuredData } from "@/components/ui/StructuredData";
import { PerformanceOptimizer } from "@/utils/css-optimization";

// Dynamic imports for better code splitting
const PDFViewerSection = dynamic(() => import("@/components/pdf/PDFViewerSection"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
  ssr: false
});

const EnhancedPerformanceMonitor = dynamic(() => import("@/components/ui/EnhancedPerformanceMonitor"), {
  ssr: false
});

// Optimized image component
const OptimizedImage = dynamic(() => import("next/image"), {
  loading: () => <div className="animate-pulse bg-gray-200 w-full h-full" />
});

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
  id: number;
  title: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  date: string;
  author?: string;
  category?: string;
  tags?: string[];
}

interface Category {
  id: number;
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
      id: 1,
      title: magazine.issues.issue1.title,
      description: magazine.issues.issue1.description,
      coverImage: "/images/magazine-cover-1.jpg",
      pdfUrl: "/pdfs/magazine-issue-1.pdf",
      date: magazine.issues.issue1.date,
      author: locale === "ar" ? "فريق التحرير" : "Editorial Team",
      category: magazine.categoryNames.aqeedah,
      tags: [
        locale === "ar" ? "العقيدة" : "Faith",
        locale === "ar" ? "التوحيد" : "Monotheism"
      ]
    },
    {
      id: 2,
      title: magazine.issues.issue2.title,
      description: magazine.issues.issue2.description,
      coverImage: "/images/magazine-cover-2.jpg",
      pdfUrl: "/pdfs/magazine-issue-2.pdf",
      date: magazine.issues.issue2.date,
      author: locale === "ar" ? "فريق التحرير" : "Editorial Team",
      category: magazine.categoryNames.fiqh,
      tags: [
        locale === "ar" ? "الفقه" : "Jurisprudence",
        locale === "ar" ? "الأحكام" : "Rulings"
      ]
    },
    {
      id: 3,
      title: magazine.issues.issue3.title,
      description: magazine.issues.issue3.description,
      coverImage: "/images/magazine-cover-3.jpg",
      pdfUrl: "/pdfs/magazine-issue-3.pdf",
      date: magazine.issues.issue3.date,
      author: locale === "ar" ? "فريق التحرير" : "Editorial Team",
      category: magazine.categoryNames.prophetBiography,
      tags: [
        locale === "ar" ? "السيرة النبوية" : "Prophet's Biography",
        locale === "ar" ? "الأخلاق" : "Ethics"
      ]
    },
  ];

  // Enhanced categories with descriptions and icons
  const categories: Category[] = [
    { 
      id: 1, 
      name: magazine.categoryNames.aqeedah,
      description: locale === "ar" ? "مقالات حول العقيدة الإسلامية والتوحيد" : "Articles about Islamic faith and monotheism",
      icon: "🕌"
    },
    { 
      id: 2, 
      name: magazine.categoryNames.fiqh,
      description: locale === "ar" ? "أحكام فقهية ومسائل شرعية" : "Islamic jurisprudence and religious rulings",
      icon: "⚖️"
    },
    { 
      id: 3, 
      name: magazine.categoryNames.prophetBiography,
      description: locale === "ar" ? "سيرة النبي محمد صلى الله عليه وسلم" : "Biography of Prophet Muhammad (PBUH)",
      icon: "📖"
    },
    { 
      id: 4, 
      name: magazine.categoryNames.islamicHistory,
      description: locale === "ar" ? "تاريخ الحضارة الإسلامية" : "History of Islamic civilization",
      icon: "🏛️"
    },
  ];

  const selectedIssue = magazineIssues[0] || null;

  // Enhanced skip links
  const skipLinks = [
    { href: "#main-content", label: locale === "ar" ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content" },
    { href: "#search", label: locale === "ar" ? "انتقل إلى البحث" : "Skip to search" },
    { href: "#latest-issues", label: locale === "ar" ? "انتقل إلى آخر الإصدارات" : "Skip to latest issues" },
    { href: "#pdf-viewer", label: locale === "ar" ? "انتقل إلى عارض PDF" : "Skip to PDF viewer" },
    { href: "#categories", label: locale === "ar" ? "انتقل إلى التصنيفات" : "Skip to categories" },
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
        {/* Animated Hero Section */}
        <Motion
          animation="fadeInUp"
          duration={800}
          className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white py-16 rounded-xl shadow-2xl overflow-hidden relative"
          aria-labelledby="page-heading"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <Motion animation="slideInDown" delay={200}>
              <h1 id="page-heading" className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100">
                {magazine.title}
              </h1>
            </Motion>
            
            <Motion animation="fadeIn" delay={400}>
              <p className="text-xl md:text-2xl mt-4 max-w-3xl mx-auto leading-relaxed text-emerald-50">
                {magazine.description}
              </p>
            </Motion>

            <Motion animation="bounceIn" delay={600}>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={`#latest-issues`}
                  className="inline-flex items-center px-8 py-4 bg-white text-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {magazine.latestIssues}
                </Link>
                
                <Link
                  href={`#categories`}
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {magazine.categories}
                </Link>
              </div>
            </Motion>
          </div>
        </Motion>

        {/* Animated Search Section */}
        <Motion animation="fadeInUp" delay={200}>
          <section id="search" className="py-8" aria-labelledby="search-heading">
            <div className="container mx-auto px-4">
              <h2 id="search-heading" className="sr-only">
                {locale === "ar" ? "البحث في المجلة" : "Search Magazine"}
              </h2>
              <IntegratedSearchInterface
                placeholder={locale === "ar" ? "ابحث في إصدارات المجلة..." : "Search magazine issues..."}
                onSearch={(query) => {
                  // Implement search functionality
                  console.log("Search query:", query);
                }}
                className="max-w-2xl mx-auto"
              />
            </div>
          </section>
        </Motion>

        {/* Latest Issues Section with Animations */}
        <section 
          id="latest-issues"
          className="py-12"
          aria-labelledby="latest-issues-heading"
        >
          <div className="container mx-auto px-4">
            <Motion animation="fadeInLeft">
              <div className="mb-12 flex justify-between items-center">
                <h2 id="latest-issues-heading" className="text-3xl md:text-4xl font-bold text-emerald-800 relative">
                  {magazine.latestIssues}
                  <div className="absolute bottom-0 left-0 w-20 h-1 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"></div>
                </h2>
                
                <Link 
                  href={`/${locale}/magazine/all`}
                  className="inline-flex items-center text-emerald-600 hover:text-emerald-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded-lg px-4 py-2 font-semibold hover:bg-emerald-50"
                  aria-label={`${magazine.allIssues} - ${locale === "ar" ? "يفتح في صفحة جديدة" : "Opens in new page"}`}
                >
                  {magazine.allIssues}
                  <svg 
                    className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </Motion>

            <IntegratedMagazineGrid
              issues={magazineIssues}
              locale={locale}
              magazine={magazine}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            />
          </div>
        </section>

        {/* PDF Viewer Section */}
        <Motion animation="fadeInUp" delay={300}>
          <section id="pdf-viewer" aria-labelledby="pdf-viewer-heading">
            <div className="container mx-auto px-4">
              <h2 id="pdf-viewer-heading" className="text-3xl font-bold text-emerald-800 mb-8 text-center">
                {locale === "ar" ? "عارض المجلة" : "Magazine Viewer"}
              </h2>
              
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <Suspense fallback={
                  <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">
                        {locale === "ar" ? "جاري تحميل عارض PDF..." : "Loading PDF viewer..."}
                      </p>
                    </div>
                  </div>
                }>
                  <PDFViewerSection 
                    pdfUrl="https://drive.google.com/file/d/1fYPJGRKRD7iZVe0yheliURNuSQQswgJw/view?usp=sharing"
                    title={selectedIssue?.title || magazine.title}
                    messages={magazine}
                  />
                </Suspense>
              </div>
            </div>
          </section>
        </Motion>

        {/* Categories Section with Enhanced Design */}
        <Motion animation="fadeInUp" delay={400}>
          <section 
            id="categories"
            className="py-16 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl"
            aria-labelledby="categories-heading"
          >
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 id="categories-heading" className="text-3xl md:text-4xl font-bold text-emerald-800 mb-4">
                  {magazine.categories}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  {locale === "ar" 
                    ? "استكشف مختلف أقسام المجلة وتصفح المحتوى حسب اهتماماتك" 
                    : "Explore different sections of the magazine and browse content by your interests"
                  }
                </p>
              </div>
              
              <StaggerContainer
                staggerDelay={100}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {categories.map((category, index) => (
                  <Motion
                    key={category.id}
                    animation="fadeInUp"
                    delay={index * 100}
                    className="group"
                  >
                    <Link
                      href={`/${locale}/magazine/category/${category.id}`}
                      className="block bg-white border border-gray-200 p-8 rounded-xl text-center hover:bg-emerald-50 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-2"
                      aria-label={`${magazine.browseCategory || "Browse category"}: ${category.name}`}
                    >
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-xl text-emerald-900 mb-2 group-hover:text-emerald-700 transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {category.description}
                        </p>
                      )}
                      <div className="mt-4 inline-flex items-center text-emerald-600 font-medium group-hover:text-emerald-700">
                        {locale === "ar" ? "تصفح" : "Browse"}
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </Motion>
                ))}
              </StaggerContainer>
            </div>
          </section>
        </Motion>

        {/* Newsletter Subscription Section */}
        <Motion animation="fadeInUp" delay={500}>
          <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl text-white" aria-labelledby="newsletter-heading">
            <div className="container mx-auto px-4 text-center">
              <h2 id="newsletter-heading" className="text-3xl font-bold mb-4">
                {locale === "ar" ? "اشترك في النشرة الإخبارية" : "Subscribe to Newsletter"}
              </h2>
              <p className="text-emerald-100 mb-8 max-w-2xl mx-auto text-lg">
                {locale === "ar" 
                  ? "احصل على آخر الإصدارات والمقالات المميزة في بريدك الإلكتروني" 
                  : "Get the latest issues and featured articles delivered to your inbox"
                }
              </p>
              
              <form className="max-w-md mx-auto flex gap-3">
                <input
                  type="email"
                  placeholder={locale === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-300"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-emerald-600"
                >
                  {locale === "ar" ? "اشترك" : "Subscribe"}
                </button>
              </form>
            </div>
          </section>
        </Motion>
      </main>
    </>
  );
}
