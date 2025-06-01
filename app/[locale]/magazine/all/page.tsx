import { Metadata } from "next/types";
import { Suspense } from "react";
import Link from "next/link";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { AccessibleMagazineCard, AccessibleGrid, AccessibleSearch } from "@/components/ui/AccessibilityEnhancements";
import { Motion } from "@/components/ui/AnimationSystem";
import { MagazineGridSkeleton } from "@/components/ui/LoadingStates";
import { MemoizedPagination } from "@/components/ui/MemoizedComponents";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  return {
    ...SEO({
      title: `${messages.magazine.allIssues} - ${messages.magazine.title}`,
      description: messages.magazine.description + " - " + messages.magazine.allIssues,
      locale,
      pageName: "magazine-all",
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
  fileSize?: string;
  pageCount?: number;
}

export default async function AllMagazinesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { magazine } = messages;
  const isArabic = locale === 'ar';

  // Enhanced mock data with more issues
  const allIssues: MagazineIssue[] = [
    {
      id: "1",
      title: magazine.issues.issue1.title,
      description: magazine.issues.issue1.description,
      date: magazine.issues.issue1.date,
      category: magazine.categoryNames.aqeedah,
      fileSize: "2.5 MB",
      pageCount: 32
    },
    {
      id: "2", 
      title: magazine.issues.issue2.title,
      description: magazine.issues.issue2.description,
      date: magazine.issues.issue2.date,
      category: magazine.categoryNames.fiqh,
      fileSize: "3.1 MB",
      pageCount: 40
    },
    {
      id: "3",
      title: magazine.issues.issue3.title,
      description: magazine.issues.issue3.description,
      date: magazine.issues.issue3.date,
      category: magazine.categoryNames.prophetBiography,
      fileSize: "2.8 MB",
      pageCount: 36
    },
    // Additional mock issues
    {
      id: "4",
      title: isArabic ? "الأخلاق في الإسلام" : "Ethics in Islam",
      description: isArabic ? "دليل شامل للأخلاق الإسلامية وتطبيقها في الحياة اليومية" : "A comprehensive guide to Islamic ethics and their application in daily life",
      date: isArabic ? "ربيع الأول 1445" : "October 2023",
      category: magazine.categoryNames.aqeedah,
      fileSize: "2.2 MB",
      pageCount: 28
    },
    {
      id: "5",
      title: isArabic ? "الزكاة وأحكامها" : "Zakat and its Rulings",
      description: isArabic ? "دليل مفصل لأحكام الزكاة ومقاديرها" : "A detailed guide to Zakat rulings and amounts",
      date: isArabic ? "صفر 1445" : "September 2023",
      category: magazine.categoryNames.fiqh,
      fileSize: "1.9 MB",
      pageCount: 24
    },
    {
      id: "6",
      title: isArabic ? "الدعاء في الإسلام" : "Prayer in Islam",
      description: isArabic ? "آداب الدعاء وأوقاته المستجابة" : "Etiquette of prayer and blessed times for supplication",
      date: isArabic ? "محرم 1445" : "August 2023",
      category: magazine.categoryNames.prophetBiography,
      fileSize: "2.7 MB",
      pageCount: 34
    }
  ];

  // Categories for filtering
  const categories = [
    { id: "all", name: isArabic ? "جميع التصنيفات" : "All Categories" },
    { id: "aqeedah", name: magazine.categoryNames.aqeedah },
    { id: "fiqh", name: magazine.categoryNames.fiqh },
    { id: "prophetBiography", name: magazine.categoryNames.prophetBiography },
    { id: "islamicHistory", name: magazine.categoryNames.islamicHistory },
  ];

  // Skip links for accessibility
  const skipLinks = [
    { href: "#main-content", label: isArabic ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content" },
    { href: "#search", label: isArabic ? "انتقل إلى البحث" : "Skip to search" },
    { href: "#filters", label: isArabic ? "انتقل إلى المرشحات" : "Skip to filters" },
    { href: "#issues-grid", label: isArabic ? "انتقل إلى قائمة الإصدارات" : "Skip to issues grid" },
  ];

  return (
    <>
      <SkipLinks links={skipLinks} />
      
      <main id="main-content" className="space-y-8" role="main">
        {/* Page Header */}
        <Motion preset="fadeInUp">
          <section className="bg-gradient-to-r from-emerald-700 to-emerald-600 text-white py-12 rounded-xl">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {magazine.allIssues}
                </h1>
                <p className="text-xl text-emerald-100 mb-6">
                  {isArabic 
                    ? "استكشف جميع إصدارات المجلة واكتشف المحتوى المميز" 
                    : "Explore all magazine issues and discover featured content"
                  }
                </p>
                
                {/* Breadcrumb */}
                <nav aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"} className="flex justify-center">
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
                      {magazine.allIssues}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </section>
        </Motion>

        {/* Search and Filters */}
        <Motion preset="slideInUp" delay={200}>
          <section id="search" className="py-8">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Search */}
                <div>
                  <h2 className="sr-only">{isArabic ? "البحث في الإصدارات" : "Search Issues"}</h2>
                  <AccessibleSearch
                    value=""
                    onChange={(value) => console.log('Search:', value)}
                    placeholder={isArabic ? "ابحث في الإصدارات..." : "Search issues..."}
                    suggestions={[
                      isArabic ? "العقيدة" : "Faith",
                      isArabic ? "الفقه" : "Jurisprudence", 
                      isArabic ? "السيرة النبوية" : "Prophet's Biography"
                    ]}
                    locale={locale}
                    className="w-full"
                  />
                </div>

                {/* Category Filters */}
                <div id="filters">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    {isArabic ? "تصفية حسب التصنيف" : "Filter by Category"}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                          category.id === "all"
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                        }`}
                        aria-pressed={category.id === "all"}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Motion>

        {/* Issues Grid */}
        <Motion preset="fadeInUp" delay={300}>
          <section id="issues-grid" className="py-8">
            <div className="container mx-auto px-4">
              <div className="mb-8 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isArabic ? `${allIssues.length} إصدار` : `${allIssues.length} Issues`}
                </h2>
                
                {/* Sort Options */}
                <div className="flex items-center gap-4">
                  <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
                    {isArabic ? "ترتيب حسب:" : "Sort by:"}
                  </label>
                  <select
                    id="sort-select"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="date-desc">{isArabic ? "الأحدث أولاً" : "Newest First"}</option>
                    <option value="date-asc">{isArabic ? "الأقدم أولاً" : "Oldest First"}</option>
                    <option value="title">{isArabic ? "العنوان" : "Title"}</option>
                  </select>
                </div>
              </div>

              <Suspense fallback={<MagazineGridSkeleton count={6} columns={3} />}>
                <AccessibleGrid
                  columns={3}
                  gap={24}
                  navigationLabel={isArabic ? "شبكة إصدارات المجلة" : "Magazine issues grid"}
                  locale={locale}
                >
                  {allIssues.map((issue, index) => (
                    <AccessibleMagazineCard
                      key={issue.id}
                      issue={issue}
                      onView={(id) => {
                        window.location.href = `/${locale}/magazine/issue/${id}`;
                      }}
                      onDownload={(id) => {
                        console.log('Download issue:', id);
                        // Implement download functionality
                      }}
                      locale={locale}
                      delay={index * 100}
                    />
                  ))}
                </AccessibleGrid>
              </Suspense>

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <MemoizedPagination
                  currentPage={1}
                  totalPages={2}
                  onPageChange={(page) => console.log('Navigate to page:', page)}
                  showFirstLast={true}
                  showPrevNext={true}
                  maxVisiblePages={5}
                />
              </div>
            </div>
          </section>
        </Motion>

        {/* Call to Action */}
        <Motion preset="slideInUp" delay={400}>
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-emerald-900 mb-4">
                  {isArabic ? "لم تجد ما تبحث عنه؟" : "Didn't find what you're looking for?"}
                </h3>
                <p className="text-emerald-700 mb-6 max-w-2xl mx-auto">
                  {isArabic 
                    ? "تصفح مكتبة المواد الإضافية أو تواصل معنا لطلبات خاصة" 
                    : "Browse our additional materials library or contact us for special requests"
                  }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/library`}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {isArabic ? "تصفح المكتبة" : "Browse Library"}
                  </Link>
                  <Link
                    href={`/${locale}/contact`}
                    className="inline-flex items-center px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {isArabic ? "تواصل معنا" : "Contact Us"}
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
