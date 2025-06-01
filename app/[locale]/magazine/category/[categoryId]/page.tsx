import { Metadata } from "next/types";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import SEO from "@/components/ui/SEO";
import { SkipLinks } from "@/components/ui/AccessibilityComponents";
import { AccessibleMagazineCard, AccessibleGrid } from "@/components/ui/AccessibilityEnhancements";
import { Motion, StaggerContainer } from "@/components/ui/AnimationSystem";
import { MagazineGridSkeleton } from "@/components/ui/LoadingStates";
import { MemoizedPagination } from "@/components/ui/MemoizedComponents";

// Generate metadata for the page
export async function generateMetadata({ 
  params
}: { 
  params: Promise<{ locale: string; categoryId: string }>;
}): Promise<Metadata> {
  const { locale, categoryId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  
  // Get category info
  const categoryInfo = getCategoryInfo(categoryId, messages.magazine, locale);
  if (!categoryInfo) return notFound();
  
  return {
    ...SEO({
      title: `${categoryInfo.name} - ${messages.magazine.title}`,
      description: `${messages.magazine.description} - ${categoryInfo.description}`,
      locale,
      pageName: `magazine-category-${categoryId}`,
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

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

function getCategoryInfo(categoryId: string, magazine: any, locale: string): CategoryInfo | null {
  const isArabic = locale === 'ar';
  
  const categories: Record<string, CategoryInfo> = {
    "1": {
      id: "1",
      name: magazine.categoryNames.aqeedah,
      description: isArabic ? "مقالات حول العقيدة الإسلامية والتوحيد" : "Articles about Islamic faith and monotheism",
      icon: "🕌",
      color: "emerald"
    },
    "2": {
      id: "2", 
      name: magazine.categoryNames.fiqh,
      description: isArabic ? "أحكام فقهية ومسائل شرعية" : "Islamic jurisprudence and religious rulings",
      icon: "⚖️",
      color: "blue"
    },
    "3": {
      id: "3",
      name: magazine.categoryNames.prophetBiography,
      description: isArabic ? "سيرة النبي محمد صلى الله عليه وسلم" : "Biography of Prophet Muhammad (PBUH)",
      icon: "📖",
      color: "purple"
    },
    "4": {
      id: "4",
      name: magazine.categoryNames.islamicHistory,
      description: isArabic ? "تاريخ الحضارة الإسلامية" : "History of Islamic civilization",
      icon: "🏛️",
      color: "amber"
    }
  };

  return categories[categoryId] || null;
}

function getIssuesByCategory(categoryId: string, magazine: any, locale: string): MagazineIssue[] {
  const isArabic = locale === 'ar';
  
  // Mock data filtered by category
  const allIssues: Record<string, MagazineIssue[]> = {
    "1": [ // Aqeedah
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
        id: "4",
        title: isArabic ? "الأخلاق في الإسلام" : "Ethics in Islam",
        description: isArabic ? "دليل شامل للأخلاق الإسلامية وتطبيقها في الحياة اليومية" : "A comprehensive guide to Islamic ethics and their application in daily life",
        date: isArabic ? "ربيع الأول 1445" : "October 2023",
        category: magazine.categoryNames.aqeedah,
        fileSize: "2.2 MB",
        pageCount: 28
      },
      {
        id: "7",
        title: isArabic ? "التوحيد والشرك" : "Monotheism and Polytheism",
        description: isArabic ? "فهم مفهوم التوحيد وأنواع الشرك" : "Understanding the concept of monotheism and types of polytheism",
        date: isArabic ? "ذو الحجة 1444" : "July 2023",
        category: magazine.categoryNames.aqeedah,
        fileSize: "2.8 MB",
        pageCount: 35
      }
    ],
    "2": [ // Fiqh
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
        id: "5",
        title: isArabic ? "الزكاة وأحكامها" : "Zakat and its Rulings",
        description: isArabic ? "دليل مفصل لأحكام الزكاة ومقاديرها" : "A detailed guide to Zakat rulings and amounts",
        date: isArabic ? "صفر 1445" : "September 2023",
        category: magazine.categoryNames.fiqh,
        fileSize: "1.9 MB",
        pageCount: 24
      },
      {
        id: "8",
        title: isArabic ? "أحكام الصيام" : "Fasting Rulings",
        description: isArabic ? "الأحكام الفقهية المتعلقة بالصيام والاعتكاف" : "Jurisprudential rulings related to fasting and seclusion",
        date: isArabic ? "شعبان 1444" : "March 2023",
        category: magazine.categoryNames.fiqh,
        fileSize: "2.1 MB",
        pageCount: 30
      }
    ],
    "3": [ // Prophet Biography
      {
        id: "3",
        title: magazine.issues.issue3.title,
        description: magazine.issues.issue3.description,
        date: magazine.issues.issue3.date,
        category: magazine.categoryNames.prophetBiography,
        fileSize: "2.8 MB",
        pageCount: 36
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
    ],
    "4": [ // Islamic History
      {
        id: "9",
        title: isArabic ? "الخلافة الراشدة" : "The Rightly-Guided Caliphate",
        description: isArabic ? "تاريخ الخلفاء الراشدين وإنجازاتهم" : "History of the Rightly-Guided Caliphs and their achievements",
        date: isArabic ? "جمادى الآخرة 1444" : "January 2023",
        category: magazine.categoryNames.islamicHistory,
        fileSize: "3.5 MB",
        pageCount: 45
      }
    ]
  };

  return allIssues[categoryId] || [];
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; categoryId: string }>;
}) {
  const { locale, categoryId } = await params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const { magazine } = messages;
  const isArabic = locale === 'ar';

  // Get category information
  const categoryInfo = getCategoryInfo(categoryId, magazine, locale);
  if (!categoryInfo) {
    notFound();
  }

  // Get issues for this category
  const categoryIssues = getIssuesByCategory(categoryId, magazine, locale);

  // Skip links for accessibility
  const skipLinks = [
    { href: "#main-content", label: isArabic ? "انتقل إلى المحتوى الرئيسي" : "Skip to main content" },
    { href: "#issues-grid", label: isArabic ? "انتقل إلى قائمة الإصدارات" : "Skip to issues grid" },
  ];

  return (
    <>
      <SkipLinks links={skipLinks} />
      
      <main id="main-content" className="space-y-8" role="main">
        {/* Category Header */}
        <Motion preset="fadeInUp">
          <section className={`bg-gradient-to-r from-${categoryInfo.color}-700 to-${categoryInfo.color}-600 text-white py-16 rounded-xl`}>
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                {/* Category Icon */}
                <div className="text-6xl mb-6" role="img" aria-label={categoryInfo.name}>
                  {categoryInfo.icon}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {categoryInfo.name}
                </h1>
                
                <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
                  {categoryInfo.description}
                </p>
                
                {/* Stats */}
                <div className="flex justify-center items-center gap-8 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{categoryIssues.length}</div>
                    <div className="text-emerald-200">{isArabic ? "إصدار" : "Issues"}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {categoryIssues.reduce((total, issue) => total + (issue.pageCount || 0), 0)}
                    </div>
                    <div className="text-emerald-200">{isArabic ? "صفحة" : "Pages"}</div>
                  </div>
                </div>
                
                {/* Breadcrumb */}
                <nav aria-label={isArabic ? "مسار التنقل" : "Breadcrumb"} className="mt-8 flex justify-center">
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
                      {categoryInfo.name}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </section>
        </Motion>

        {/* Issues Grid */}
        {categoryIssues.length > 0 ? (
          <Motion preset="fadeInUp" delay={200}>
            <section id="issues-grid" className="py-8">
              <div className="container mx-auto px-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {isArabic ? `إصدارات ${categoryInfo.name}` : `${categoryInfo.name} Issues`}
                  </h2>
                  <p className="text-gray-600">
                    {isArabic 
                      ? `${categoryIssues.length} إصدار في هذا التصنيف` 
                      : `${categoryIssues.length} issues in this category`
                    }
                  </p>
                </div>

                <Suspense fallback={<MagazineGridSkeleton count={categoryIssues.length} columns={3} />}>
                  <StaggerContainer staggerDelay={100}>
                    <AccessibleGrid
                      columns={3}
                      gap={24}
                      navigationLabel={`${categoryInfo.name} ${isArabic ? "إصدارات" : "issues"}`}
                      locale={locale}
                    >
                      {categoryIssues.map((issue, index) => (
                        <Motion key={issue.id} preset="slideInUp" delay={index * 100}>
                          <AccessibleMagazineCard
                            issue={issue}
                            onView={(id) => {
                              window.location.href = `/${locale}/magazine/issue/${id}`;
                            }}
                            onDownload={(id) => {
                              console.log('Download issue:', id);
                              // Implement download functionality
                            }}
                            locale={locale}
                          />
                        </Motion>
                      ))}
                    </AccessibleGrid>
                  </StaggerContainer>
                </Suspense>

                {/* Pagination - if needed for large categories */}
                {categoryIssues.length > 9 && (
                  <div className="mt-12 flex justify-center">
                    <MemoizedPagination
                      currentPage={1}
                      totalPages={Math.ceil(categoryIssues.length / 9)}
                      onPageChange={(page) => console.log('Navigate to page:', page)}
                      showFirstLast={true}
                      showPrevNext={true}
                      maxVisiblePages={5}
                    />
                  </div>
                )}
              </div>
            </section>
          </Motion>
        ) : (
          // Empty State
          <Motion preset="fadeInUp" delay={200}>
            <section className="py-16">
              <div className="container mx-auto px-4 text-center">
                <div className="max-w-md mx-auto">
                  <div className="text-6xl mb-6">📚</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {isArabic ? "لا توجد إصدارات بعد" : "No Issues Yet"}
                  </h3>
                  <p className="text-gray-600 mb-8">
                    {isArabic 
                      ? "لم يتم نشر أي إصدارات في هذا التصنيف حتى الآن. تحقق مرة أخرى لاحقاً." 
                      : "No issues have been published in this category yet. Check back later."
                    }
                  </p>
                  <Link
                    href={`/${locale}/magazine`}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    {isArabic ? "تصفح جميع الإصدارات" : "Browse All Issues"}
                  </Link>
                </div>
              </div>
            </section>
          </Motion>
        )}

        {/* Related Categories */}
        <Motion preset="slideInUp" delay={300}>
          <section className="py-12 bg-gray-50 rounded-xl">
            <div className="container mx-auto px-4">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
                {isArabic ? "تصنيفات أخرى" : "Other Categories"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {["1", "2", "3", "4"].filter(id => id !== categoryId).slice(0, 3).map((id) => {
                  const relatedCategory = getCategoryInfo(id, magazine, locale);
                  if (!relatedCategory) return null;
                  
                  return (
                    <Link
                      key={id}
                      href={`/${locale}/magazine/category/${id}`}
                      className="group block bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                        {relatedCategory.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {relatedCategory.name}
                      </h4>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        </Motion>
      </main>
    </>
  );
}
